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

    // ===================================================================================
    //                                                                        Assist Logic
    //                                                                        ============
    private fun isAvailableCreatorSetting(
        village: Village,
        player: Player?,
    ): Boolean {
        player ?: return false
        if (village.status.isFinished()) return false
        // 管理者か村建てならok
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

    // 廃村可否は「村建て or 管理者」+「未終了」で判定する。フロント表示と API 認可で同じ判定を共有する
    private fun isAvailableCancelVillage(
        village: Village,
        player: Player?,
        user: LastwolfUser?,
    ): Boolean {
        if (player == null || user == null) return false
        if (village.status.isFinished()) return false
        if (user.authority == CDef.Authority.管理者) return true
        if (village.creatorPlayer.id == player.id) return true
        return false
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
