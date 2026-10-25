package com.ort.lastwolf.domain.service.participate

import com.ort.dbflute.allcommon.CDef
import com.ort.lastwolf.DummyData
import com.ort.lastwolf.domain.model.village.Village
import com.ort.lastwolf.domain.model.village.VillageStatus
import com.ort.lastwolf.domain.model.village.participant.VillageParticipants
import com.ort.lastwolf.fw.exception.LastwolfBusinessException
import org.assertj.core.api.Assertions.assertThatCode
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test

class ParticipateDomainServiceTest {
    private val participateDomainService = ParticipateDomainService()

    private fun recruitingVillage(): Village = DummyData.prologueVillage().copy(status = VillageStatus(CDef.VillageStatus.募集中))

    private fun fullVillage(village: Village): Village {
        val list = (1..village.setting.capacity.max).map { DummyData.villageParticipant() }
        return village.copy(participants = VillageParticipants(count = list.size, list = list))
    }

    @Test
    fun `assertParticipateCapacity 空きがあり未参加のキャラなら参加できる`() {
        val village = recruitingVillage()

        assertThatCode {
            participateDomainService.assertParticipateCapacity(DummyData.player(), village, DummyData.chara().id + 10000)
        }.doesNotThrowAnyException()
    }

    @Test
    fun `assertParticipateCapacity 定員に達していたら参加できない`() {
        val village = fullVillage(recruitingVillage())

        assertThatThrownBy {
            participateDomainService.assertParticipateCapacity(DummyData.player(), village, DummyData.chara().id + 10000)
        }.isInstanceOf(LastwolfBusinessException::class.java)
    }

    @Test
    fun `assertParticipateCapacity 進行中の別の村に参加済みなら参加できない`() {
        val village = recruitingVillage()
        val player = DummyData.player().copy(participateProgressVillageIdList = listOf(village.id + 1))

        assertThatThrownBy {
            participateDomainService.assertParticipateCapacity(player, village, DummyData.chara().id + 10000)
        }.isInstanceOf(LastwolfBusinessException::class.java)
    }

    @Test
    fun `assertParticipateCapacity 既に参加しているキャラでは参加できない`() {
        val village = recruitingVillage()
        val usedCharaId =
            village.participants.list
                .first()
                .chara.id

        assertThatThrownBy {
            participateDomainService.assertParticipateCapacity(DummyData.player(), village, usedCharaId)
        }.isInstanceOf(LastwolfBusinessException::class.java)
    }

    @Test
    fun `assertParticipateCapacity 募集中でなければ参加できない`() {
        val village = DummyData.prologueVillage().copy(status = VillageStatus(CDef.VillageStatus.進行中))

        assertThatThrownBy {
            participateDomainService.assertParticipateCapacity(DummyData.player(), village, DummyData.chara().id + 10000)
        }.isInstanceOf(LastwolfBusinessException::class.java)
    }
}
