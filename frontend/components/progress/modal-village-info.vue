<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">村の情報</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="village">
        <div class="content">
          <b-table
            :data="settings"
            ref="table"
            detailed
            :show-detail-icon="false"
            :mobile-cards="false"
          >
            <template slot-scope="props">
              <b-table-column field="name" label="設定">
                <template>
                  {{ props.row.name }}
                  <a v-if="props.row.description" @click="toggle(props.row)">
                    <b-icon
                      pack="fas"
                      icon="question-circle"
                      size="is-small"
                    ></b-icon>
                  </a>
                </template>
              </b-table-column>

              <b-table-column
                field="value"
                label=""
                v-html="props.row.value.replace(/\n/g, '<br />')"
              />
            </template>

            <template slot="detail" slot-scope="props">
              <p v-html="props.row.description.replace(/\n/g, '<br />')"></p>
            </template>
          </b-table>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" @click="close">
          閉じる
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
// component
// type
import Village from '~/@types/village'
import VillageTime from '~/@types/village-time'
import Chara from '~/@types/chara'
import { VILLAGE_STATUS } from '~/consts/consts'

interface Settings {
  name: string
  value: string
  description?: string | null
}

@Component({
  components: {}
})
export default class ModalVillageInfo extends Vue {
  @Prop({ type: String })
  private charachipName?: string | null

  @Prop({ type: Boolean })
  private isOpen!: boolean

  private get village(): Village | null {
    return this.$store.getters.village
  }

  private get settings(): Settings[] {
    if (!this.village) return []
    const settings: Settings[] = []

    settings.push({
      name: '村の作成者',
      value: `@${this.village.creator_player.twitter_user_name}`,
      description: '村の作成者です。'
    })
    this.addCapacitySetting(settings)
    this.addOrganizationSetting(settings)
    this.addTimeSetting(settings)
    this.addCharachipSetting(settings)
    this.addRuleSetting(settings)
    this.addPasswordSetting(settings)

    return settings
  }

  private toggle(row: any): void {
    ;(this.$refs as any).table.toggleDetails(row)
  }

  private close(): void {
    this.$emit('close')
  }

  // 設定用
  private addCapacitySetting(settings: Settings[]): void {
    if (!this.village) return
    if (
      this.village.status.code === VILLAGE_STATUS.PROLOGUE ||
      this.village.status.code === VILLAGE_STATUS.CANCEL
    ) {
      const capacity = this.village.setting.capacity
      settings.push({
        name: '人数',
        value: `${capacity.min}人`,
        description:
          'この人数が集まると点呼や進行中に遷移できます。\nダミーを含む人数です。'
      })
    } else {
      settings.push({
        name: '人数',
        value: `${this.village!.participants.count}人`
      })
    }
  }

  private addTimeSetting(settings: Settings[]): void {
    if (!this.village) return
    const timeSetting = this.village.setting.time
    if (this.village.status.code === VILLAGE_STATUS.PROLOGUE) {
      settings.push({
        name: '開始予定日時',
        value: timeSetting.start_datetime
      })
    }
    settings.push({
      name: '昼時間',
      value: `${timeSetting.noon_seconds}秒`,
      description: '議論時間です。'
    })
    settings.push({
      name: '投票時間',
      value: `${timeSetting.vote_seconds}秒`,
      description: '投票時間です。'
    })
    settings.push({
      name: '夜時間',
      value: `${timeSetting.night_seconds}秒`,
      description: '能力者が能力行使を行う時間です。'
    })
  }

  private addCharachipSetting(settings: Settings[]): void {
    if (!this.village) return
    if (!this.charachipName) return
    settings.push({
      name: 'キャラチップ',
      value: this.charachipName
    })
    const self = this
    const dummyCharaName = this.village.participants.member_list.find(
      member => {
        return (
          member.chara.id === self.village!.setting.charachip.dummy_chara_id
        )
      }
    )!.chara.name.name
    settings.push({
      name: 'ダミーキャラ',
      value: dummyCharaName,
      description:
        '最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。'
    })
  }

  private addOrganizationSetting(settings: Settings[]): void {
    if (!this.village) return
    const org: string = this.village.setting.organizations.organization[
      this.village.setting.capacity.min
    ]
    settings.push({
      name: '編成',
      value: org,
      description: 'この村の配役です。役職詳細は仕様ページを参照ください。'
    })
  }

  private addRuleSetting(settings: Settings[]): void {
    if (!this.village) return
    const rules = this.village.setting.rules
    // 役職希望
    settings.push({
      name: '役職希望',
      value: rules.available_skill_request ? '有効' : '無効',
      description:
        '「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。'
    })
    // ダミー役欠け
    settings.push({
      name: 'ダミー役欠け',
      value: rules.available_dummy_skill ? 'あり' : 'なし',
      description:
        '「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。'
    })
    // 連続護衛
    settings.push({
      name: '連続護衛',
      value: rules.available_same_target_guard ? 'あり' : 'なし',
      description:
        '「あり」の場合、狩人が2日連続で同じ対象を護衛できます。\n「なし」の場合、前日護衛した対象を翌日護衛することはできません。'
    })
    // 初日白通知
    settings.push({
      name: '初日白通知',
      value: rules.first_divine_nowolf ? 'あり' : 'なし',
      description:
        '「あり」の場合、1日目夜の占いは人狼と妖狐以外からランダムで選択・行使されます。\n「なし」の場合、1日目夜も占い師が対象を選択して占うことができます。'
    })
    // 昼沈黙時間
    settings.push({
      name: '昼沈黙時間',
      value:
        rules.silent_seconds != null ? `${rules.silent_seconds}秒` : 'なし',
      description:
        '設定した場合、昼時間の開始数秒間は発言できない状態になります。'
    })
  }

  private addPasswordSetting(settings: Settings[]): void {
    if (!this.village) return
    settings.push({
      name: '入村パスワード',
      value: this.village.setting.password.join_password_required
        ? 'あり'
        : 'なし',
      description:
        '「あり」の場合、参加する際にパスワード入力が必要になります。'
    })
  }
}
</script>
