package com.ort.lastwolf.domain.service.creator

import com.ort.dbflute.allcommon.CDef
import com.ort.lastwolf.DummyData
import com.ort.lastwolf.domain.model.village.Village
import com.ort.lastwolf.domain.model.village.VillageStatus
import com.ort.lastwolf.domain.service.daychange.RollCallingDomainService
import com.ort.lastwolf.fw.exception.LastwolfBusinessException
import org.assertj.core.api.Assertions.assertThatCode
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock

class CreatorDomainServiceTest {
    private val creatorDomainService = CreatorDomainService(mock<RollCallingDomainService>())

    private fun village(status: CDef.VillageStatus): Village = DummyData.prologueVillage().copy(status = VillageStatus(status))

    @Test
    fun `assertKick プロローグ中の村建てはキックできる`() {
        val village = village(CDef.VillageStatus.募集中)

        assertThatCode { creatorDomainService.assertKick(village, village.creatorPlayer) }.doesNotThrowAnyException()
    }

    @Test
    fun `assertKick 進行中はキックできない`() {
        val village = village(CDef.VillageStatus.進行中)

        assertThatThrownBy { creatorDomainService.assertKick(village, village.creatorPlayer) }
            .isInstanceOf(LastwolfBusinessException::class.java)
    }

    @Test
    fun `assertKick 決着後はキックできない`() {
        val village = village(CDef.VillageStatus.決着)

        assertThatThrownBy { creatorDomainService.assertKick(village, village.creatorPlayer) }
            .isInstanceOf(LastwolfBusinessException::class.java)
    }

    @Test
    fun `assertKick 村建て以外はキックできない`() {
        val village = village(CDef.VillageStatus.募集中)

        assertThatThrownBy { creatorDomainService.assertKick(village, DummyData.player()) }
            .isInstanceOf(LastwolfBusinessException::class.java)
    }
}
