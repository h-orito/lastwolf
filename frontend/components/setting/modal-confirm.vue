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
        <p class="modal-card-title has-text-left">村作成確認</p>
      </header>
      <section class="modal-card-body has-text-left" v-if="param">
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
          戻る
        </b-button>
        <b-button
          type="is-primary"
          size="is-small"
          @click="create"
          :disabled="submitting"
        >
          {{ saveLabel }}
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
import { VILLAGE_STATUS, MESSAGE_TYPE } from '~/consts/consts'

interface Settings {
  name: string
  value: string
  description?: string | null
}

@Component({
  components: {}
})
export default class ModalVillageInfo extends Vue {
  @Prop({ type: Object })
  private param!: any

  @Prop({ type: String })
  private charachipName!: string

  @Prop({ type: String })
  private dummyCharaName!: string

  @Prop({ type: Boolean })
  private isOpen!: boolean

  @Prop({ type: String })
  private saveLabel!: string

  private submitting: boolean = false

  private messageNameMap: Map<string, string> = new Map([
    [MESSAGE_TYPE.NORMAL_SAY, '通常発言'],
    [MESSAGE_TYPE.WEREWOLF_SAY, '人狼の囁き'],
    [MESSAGE_TYPE.MONOLOGUE_SAY, '独り言'],
    [MESSAGE_TYPE.GRAVE_SAY, '死者の呻き'],
    [MESSAGE_TYPE.SPECTATE_SAY, '見学発言']
  ])

  private get settings(): Settings[] {
    if (!this.param) return []
    const settings: Settings[] = []

    settings.push({
      name: '村名',
      value: this.param.village_name
    })
    this.addCapacitySetting(settings)
    this.addTimeSetting(settings)
    this.addCharachipSetting(settings)
    this.addOrganizationSetting(settings)
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
    if (!this.param) return
    settings.push({
      name: '人数',
      value: `${this.param.setting.organization.organization.length}人`,
      description:
        'この人数参加するとゲームを開始できます。\nダミーを含む人数です。'
    })
  }

  private addTimeSetting(settings: Settings[]): void {
    if (!this.param) return
    const timeParam = this.param.setting.time
    // @ts-ignore
    const start = this.$dayjs(
      timeParam.start_datetime.replace('T', ' ')
    ).format('YYYY-MM-DD HH:mm')
    settings.push({
      name: '開始日時',
      value: start
    })
    settings.push({
      name: '昼時間',
      value: `${timeParam.noon_seconds}秒`,
      description: '投票先を決める議論時間です。'
    })
    settings.push({
      name: '投票時間',
      value: `${timeParam.vote_seconds}秒`,
      description: '投票する時間です。'
    })
    settings.push({
      name: '夜時間',
      value: `${timeParam.night_seconds}秒`,
      description: '能力者が能力を行使する時間です。'
    })
  }

  private addCharachipSetting(settings: Settings[]): void {
    if (!this.charachipName || this.charachipName === '') {
      return
    }
    settings.push({
      name: 'キャラチップ',
      value: this.charachipName
    })
    settings.push({
      name: 'ダミーキャラ',
      value: this.dummyCharaName,
      description:
        '最初に人狼に襲撃されるキャラです。\n1日目の人狼の襲撃はこのキャラに固定されます。'
    })
  }

  private addOrganizationSetting(settings: Settings[]): void {
    const org = this.param.setting.organization.organization
    settings.push({
      name: '編成',
      value: org,
      description: '配役です。役職詳細は仕様ページを参照ください。'
    })
  }

  private addRuleSetting(settings: Settings[]): void {
    const rules = this.param.setting.rule
    // 投票
    settings.push({
      name: '投票',
      value: rules.open_vote ? '記名投票' : '無記名投票',
      description:
        '「記名投票」の場合、処刑の投票結果について、誰が誰に投票したかがわかります。\n「無記名投票」の場合、誰に何票入ったかのみがわかります。'
    })
    // 役職希望
    settings.push({
      name: '役職希望',
      value: rules.available_skill_request ? '有効' : '無効',
      description:
        '「有効」の場合、割り当てられる役職の希望を出すことができます（自分以外の希望は見られません）。\n他に誰も希望していなかった場合はその役職が割り当てられます。'
    })
    // 突然死
    settings.push({
      name: '突然死',
      value: rules.available_suddenly_death ? 'あり' : 'なし',
      description:
        '「あり」の場合、日付更新のタイミングで、前日に一度も通常発言をしなかった生存者が突然死します。'
    })
    // 時短希望
    settings.push({
      name: '時短希望',
      value: rules.available_commit ? 'あり' : 'なし',
      description:
        '「あり」の場合、生存者全員が時短を希望すると、日付が更新されます。\n時短により余った時間は翌日に繰り越されます。'
    })
    // ダミー役欠け
    settings.push({
      name: 'ダミー役欠け',
      value: rules.available_dummy_skill ? 'あり' : 'なし',
      description:
        '「あり」の場合、ダミーキャラに村人以外の役職が割り当てられる可能性があります。\n「なし」の場合、必ず村人が割り当てられます。'
    })
  }

  private addPasswordSetting(settings: Settings[]): void {
    settings.push({
      name: '入村パスワード',
      value:
        this.param.setting.rule.join_password != null &&
        this.param.setting.rule.join_password.length > 0
          ? this.param.setting.rule.join_password
          : 'なし',
      description:
        '「あり」の場合、参加する際にパスワード入力が必要になります。'
    })
  }

  private async create(): Promise<void> {
    this.submitting = true
    await this.$emit('create')
    this.submitting = false
  }
}
</script>

<style lang="scss" scoped>
/** header, footerを隠さない */
.modal-card {
  max-height: calc(100vh - 6.5rem);
  font-family: sans-serif;
}
</style>
