package com.ort.lastwolf.api.body

import com.ort.lastwolf.domain.model.message.MessageContent
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class VillageSayBody(
    @field:NotNull(message = "発言内容は必須")
    @field:Size(max = MessageContent.INPUT_LENGTH_MAX)
    val message: String?,
    @field:NotNull(message = "発言種別は必須")
    val messageType: String?,
    @field:NotNull(message = "強調発言かは必須")
    val strong: Boolean?,
) {
    constructor() : this(null, null, null)
}
