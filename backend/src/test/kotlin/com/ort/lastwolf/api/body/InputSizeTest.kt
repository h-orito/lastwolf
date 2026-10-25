package com.ort.lastwolf.api.body

import com.ort.lastwolf.domain.model.message.MessageContent
import jakarta.validation.Validation
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

class InputSizeTest {
    private val validator = Validation.buildDefaultValidatorFactory().validator

    private fun say(message: String) = VillageSayBody(message, "NORMAL_SAY", false)

    private fun creatorSay(message: String) = CreatorSayBody(message)

    private fun nickname(nickname: String) = PlayerUpdateNicknameBody(nickname, "dummy")

    @Test
    @DisplayName("上限までの入力は受け付ける")
    fun withinLimit() {
        val text = "あ".repeat(MessageContent.INPUT_LENGTH_MAX)
        assertTrue(validator.validate(say(text)).isEmpty())
        assertTrue(validator.validate(creatorSay(text)).isEmpty())
        assertTrue(validator.validate(nickname("😀".repeat(50))).isEmpty())
    }

    @Test
    @DisplayName("上限を超える入力は受け付けない")
    fun overLimit() {
        val text = "あ".repeat(MessageContent.INPUT_LENGTH_MAX + 1)
        assertEquals(setOf("message"), validator.validate(say(text)).map { it.propertyPath.toString() }.toSet())
        assertEquals(setOf("message"), validator.validate(creatorSay(text)).map { it.propertyPath.toString() }.toSet())
        assertEquals(setOf("nickname"), validator.validate(nickname("あ".repeat(101))).map { it.propertyPath.toString() }.toSet())
    }
}
