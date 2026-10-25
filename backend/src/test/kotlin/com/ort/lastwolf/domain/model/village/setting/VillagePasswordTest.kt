package com.ort.lastwolf.domain.model.village.setting

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class VillagePasswordTest {
    @Test
    fun `matches パスワードのない村は何を入れても通る`() {
        assertThat(VillagePassword(null).matches(null)).isTrue()
        assertThat(VillagePassword("").matches("abc")).isTrue()
    }

    @Test
    fun `matches 一致するときだけ通る`() {
        val password = VillagePassword("secret")

        assertThat(password.matches("secret")).isTrue()
        assertThat(password.matches("Secret")).isFalse()
        assertThat(password.matches("secre")).isFalse()
        assertThat(password.matches("")).isFalse()
        assertThat(password.matches(null)).isFalse()
    }
}
