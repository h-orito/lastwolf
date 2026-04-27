<template>
  <b-modal
    :active="isOpen"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
    :on-cancel="close"
  >
    <div class="modal-card" v-if="myself">
      <header class="modal-card-head">
        <p class="modal-card-title has-text-left">村が開始されました</p>
      </header>
      <section class="modal-card-body has-text-left">
        <div class="content is-size-7" v-if="myself.skill">
          <p>
            あなたの役職は
            <strong class="is-size-6">{{ skillName }}</strong> です。
          </p>
          <b-notification :closable="false">
            {{ skillDescription }}
          </b-notification>
        </div>
      </section>
      <footer
        class="modal-card-foot"
        style="justify-content: flex-end !important;"
      >
        <b-button type="is-secondary" size="is-small" expanded @click="close">
          閉じる
        </b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/@types/situation-as-participant'
import VillageParticipant from '~/@types/village-participant'
// component
// type

@Component({
  components: {}
})
export default class ModalFirstDay extends Vue {
  @Prop({ type: Boolean })
  private isOpen!: boolean

  private get myself(): VillageParticipant | null {
    const situation: SituationAsParticipant = this.$store.getters.situation
    return situation?.participate?.myself
  }

  private get skillName(): string {
    return this.myself!.skill!.name
  }

  private get skillDescription(): string {
    return this.myself!.skill!.description
  }

  private close(): void {
    this.$emit('close')
  }
}
</script>
