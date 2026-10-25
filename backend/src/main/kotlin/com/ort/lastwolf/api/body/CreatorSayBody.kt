package com.ort.lastwolf.api.body

import com.ort.lastwolf.domain.model.message.MessageContent
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CreatorSayBody(
    @field:NotNull
    @field:Size(max = MessageContent.INPUT_LENGTH_MAX)
    val message: String?,
) {
    constructor() : this(null)
}
