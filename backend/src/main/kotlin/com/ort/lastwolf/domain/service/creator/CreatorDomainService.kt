package com.ort.lastwolf.domain.service.creator

import com.ort.dbflute.allcommon.CDef
import com.ort.lastwolf.domain.model.myself.participant.VillageCreatorSituation
import com.ort.lastwolf.domain.model.player.Player
import com.ort.lastwolf.domain.model.village.Village
import com.ort.lastwolf.domain.service.daychange.RollCallingDomainService
import com.ort.lastwolf.fw.exception.LastwolfBusinessException
import com.ort.lastwolf.fw.security.LastwolfUser
import org.springframework.stereotype.Service

@Service
class CreatorDomainService(
    private val rollCallingDomainService: RollCallingDomainService,
) {
    fun convertToSituation(
        village: Village,
        player: Player?,
        user: LastwolfUser?,
    ): VillageCreatorSituation =
        VillageCreatorSituation(
            isAvailableCreatorSetting = isAvailableCreatorSetting(village, player),
            isAvailableCreatorSay = isAvailableCreatorSay(village, player),
            isAvailableStartVillage = isAvailableStartVillage(village, player),
            isAvailableCancelVillage = isAvailableCancelVillage(village, player, user),
            isAvailableKick = isAvailableKick(village, player),
            isAvailableModifySetting = isAvailableModifySetting(village, player),
            isAvailableStartRollCall = rollCallingDomainService.canStartRollCall(village, player),
            isAvailableCancelRollCall = rollCallingDomainService.canCancelRollCall(village, player),
            isViewableSpoiler = isViewableSpoiler(village, player),
        )

    fun assertStartVillage(
        village: Village,
        player: Player,
    ) {
        if (!isAvailableStartVillage(village, player)) throw LastwolfBusinessException("村を開始できません")
    }

    // 廃村は「村建て or 管理者」が「未終了の村」に対してのみ実行可能。
    // フロント表示用フラグ (isAvailableCancelVillage) と同じ判定ロジックを使い、サーバ側認可とのズレを生まない
    fun assertCancelVillage(
        village: Village,
        player: Player,
        user: LastwolfUser,
    ) {
        if (!isAvailableCancelVillage(village, player, user)) throw LastwolfBusinessException("廃村できません")
    }

    fun assertModifySetting(
        village: Village,
        player: Player,
    ) {
        if (!isAvailableModifySetting(village, player)) throw LastwolfBusinessException("設定を変更できません")
    }

    // ===================================================================================
    //                                                                        Assist Logic
    //                                                                        ============
    // 「村建て or GM（ダミー枠の参加者）」のみ true。管理者ロールはここでは見ない（廃村だけは isAvailableCancelVillage で別判定）。
    // 仕様メモ: 廃村は決着でも実行可能だが、本メソッドは isFinished() (= 廃村/終了) で弾いている。
    // ため決着では本メソッド経由のフラグ群 (isAvailableCreatorSay 等) は false になる。決着で廃村可能なのは isAvailableCancelVillage が
    // 本メソッドに依存せず独立して判定しているため。将来本メソッドのガードを変える際は isAvailableCancelVillage の独立性を維持すること。
    private fun isAvailableCreatorSetting(
        village: Village,
        player: Player?,
    ): Boolean {
        player ?: return false
        if (village.status.isFinished()) return false
        if (village.creatorPlayer.id == player.id) return true
        val dummyParticipant = village.dummyParticipant() ?: return false
        return dummyParticipant.player.id == player.id
    }

    private fun isViewableSpoiler(
        village: Village,
        player: Player?,
    ): Boolean {
        player ?: return false
        // GMか村建てならok
        if (village.isGameMaster(player)) return true
        val dummyParticipant = village.dummyParticipant() ?: return false
        return dummyParticipant.player.id == player.id
    }

    private fun isAvailableCreatorSay(
        village: Village,
        player: Player?,
    ): Boolean {
        if (!this.isAvailableCreatorSetting(village, player)) return false
        return true
    }

    private fun isAvailableStartVillage(
        village: Village,
        player: Player?,
    ): Boolean {
        if (!this.isAvailableCreatorSetting(village, player)) return false
        return village.isAvailableStart()
    }

    // 廃村可否は「村建て or GM（ダミー枠の参加者）or 管理者」+「未終了」で判定する。フロント表示と API 認可で同じ判定を共有する。
    // 仕様メモ: 管理者は廃村のみ実行可能。kick / creatorSay / startVillage 等の他操作は isAvailableCreatorSetting (creator/dummy のみ) で false になるため、管理者には他の操作フラグは立たない（運営介入は廃村に限る設計）
    private fun isAvailableCancelVillage(
        village: Village,
        player: Player?,
        user: LastwolfUser?,
    ): Boolean {
        if (player == null || user == null) return false
        // VillageStatus.isFinished() = CDef.VillageStatus.isFinishedVillage = 「廃村」「終了」のみ true（決着は含まない）。
        // 「決着」(エピローグ) は意図的にこのガードをすり抜けて廃村可能とする仕様（Issue #16）
        if (village.status.isFinished()) return false
        if (user.authority == CDef.Authority.管理者) return true
        if (village.creatorPlayer.id == player.id) return true
        // GM ルールの村では dummy 参加者 ≠ creator になりうるため、isAvailableCreatorSetting と同様 dummy も廃村可能とする
        val dummyParticipant = village.dummyParticipant() ?: return false
        return dummyParticipant.player.id == player.id
    }

    private fun isAvailableKick(
        village: Village,
        player: Player?,
    ): Boolean {
        if (!this.isAvailableCreatorSetting(village, player)) return false
        return village.status.isRecruiting() // プロローグ中のみ可能
    }

    private fun isAvailableModifySetting(
        village: Village,
        player: Player?,
    ): Boolean {
        if (!this.isAvailableCreatorSetting(village, player)) return false
        return village.status.isRecruiting() // プロローグ中のみ可能
    }
}
