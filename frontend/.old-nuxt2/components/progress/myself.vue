<template>
  <p class="m-t-10" v-if="situation && situation.participate.myself">
    あなたは<strong class="is-size-6">
      {{ situation.participate.myself.chara.name.name }} </strong
    >です。<span v-if="situation.participate.myself.skill"
      >役職は<strong class="is-size-6">
        {{ situation.participate.myself.skill.name }} </strong
      >です。</span
    ><span v-if="isDead" class="has-text-danger"
      ><br />あなたは死亡しました。</span
    >
  </p>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SituationAsParticipant from '~/@types/situation-as-participant'

@Component({
  components: {}
})
export default class Myself extends Vue {
  private get situation(): SituationAsParticipant | null {
    return this.$store.getters.situation
  }

  private get isDead(): boolean {
    return !!this.situation!.participate.myself!.dead
  }
}
</script>
