<template>
  <div>
    <hr class="m-t-10 m-b-10" />
    <p class="m-b-10"><strong>退村</strong></p>
    <p>
      参加を取りやめたい場合は退村することができます。
    </p>
    <b-button type="is-danger" size="is-small" @click="confirmLeave"
      >退村する</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class Leave extends Vue {
  private confirmLeave(): void {
    const self = this
    this.$buefy.dialog.confirm({
      title: '退村確認',
      message: '本当に退村しますか？',
      confirmText: '退村する',
      type: 'is-danger',
      hasIcon: false,
      iconPack: 'fas',
      onConfirm: async () => {
        await self.leave()
      },
      size: 'is-small',
      cancelText: 'キャンセル'
    })
  }

  private async leave(): Promise<void> {
    try {
      await this.$axios.$post(`/village/${this.$store.getters.villageId}/leave`)
      this.$buefy.toast.open({
        message: '退村しました',
        type: 'is-info',
        position: 'is-top'
      })
      location.reload()
    } catch (error) {}
  }
}
</script>
