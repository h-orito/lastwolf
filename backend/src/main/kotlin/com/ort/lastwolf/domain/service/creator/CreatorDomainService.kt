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
    ): VillageCreatorSituation =
        VillageCreatorSituation(
            isAvailableCreatorSetting = isAvailableCreatorSetting(village, player),
            isAvailableCreatorSay = isAvailableCreatorSay(village, player),
            isAvailableStartVillage = isAvailableStartVillage(village, player),
            isAvailableCancelVillage = isAvailableCancelVillage(village, player),
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

    // 廃村は「村建て or 管理者」が「未終了の村」に対してのみ実行可能。権限と状態の両方を domain 層で検証する
    fun assertCancelVillage(
        village: Village,
        player: Player,
        user: LastwolfUser,
    ) {
        if (user.authority != CDef.Authority.管理者 && village.creatorPlayer.id != player.id) {
            throw LastwolfBusinessException("村建てか管理者しか使えません")
        }
        if (village.status.isFinished()) {
            throw LastwolfBusinessException("廃村できません")
        }
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

    private fun isAvailableCancelVillage(
        village: Village,
        player: Player?,
    ): Boolean {
        if (!this.isAvailableCreatorSetting(village, player)) return false
        // isAvailableCreatorSetting が isFinished() をガード済のため、募集中・点呼中・進行中・決着すべてで廃村可能
        return true
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
