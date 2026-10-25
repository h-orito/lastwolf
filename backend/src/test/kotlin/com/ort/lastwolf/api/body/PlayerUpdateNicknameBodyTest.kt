package com.ort.lastwolf.api.body

import jakarta.validation.Validation
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

class PlayerUpdateNicknameBodyTest {
    private val validator = Validation.buildDefaultValidatorFactory().validator

    private fun errorsOf(twitterUserName: String) =
        validator.validate(PlayerUpdateNicknameBody("nickname", twitterUserName)).map { it.propertyPath.toString() }.toSet()

    @Test
    @DisplayName("Twitter のユーザー名と「仮登録」は受け付ける")
    fun valid() {
        listOf("a", "h_orito", "ABCdef_0123456", "a".repeat(15), "仮登録").forEach {
            assertTrue(errorsOf(it).isEmpty(), it)
        }
    }

    @Test
    @DisplayName("ユーザー名に使えない文字や 16 文字以上は受け付けない")
    fun invalid() {
        listOf("", "a".repeat(16), "<style>*{zoom:9", "a b", "@h_orito", "仮").forEach {
            assertEquals(setOf("twitterUserName"), errorsOf(it), it)
        }
    }
}
