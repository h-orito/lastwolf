package com.ort.lastwolf.api.body

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class PlayerUpdateNicknameBody(
    @field:NotNull(message = "nicknameは必須")
    // 保存できるのは絵文字を除いて 50 文字まで。絵文字は 1 文字で 2 つ分と数えられるので、その分の余裕を持たせる
    @field:Size(max = 100)
    val nickname: String?,
    @field:NotNull(message = "twitterUserNameは必須")
    val twitterUserName: String?,
) {
    constructor() : this(
        null,
        null,
    )
}
