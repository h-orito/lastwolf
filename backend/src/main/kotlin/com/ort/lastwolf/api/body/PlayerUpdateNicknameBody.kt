package com.ort.lastwolf.api.body

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class PlayerUpdateNicknameBody(
    @field:NotNull(message = "nicknameは必須")
    // 保存できるのは絵文字を除いて 50 文字まで。絵文字は 1 文字で 2 つ分と数えられるので、その分の余裕を持たせる
    @field:Size(max = 100)
    val nickname: String?,
    // Twitter のユーザー名 (英数字と _ の 15 文字以内)。Twitter 以外でログインした場合は画面から「仮登録」が送られる
    @field:NotNull(message = "twitterUserNameは必須")
    @field:Pattern(regexp = "^([A-Za-z0-9_]{1,15}|仮登録)$")
    val twitterUserName: String?,
) {
    constructor() : this(
        null,
        null,
    )
}
