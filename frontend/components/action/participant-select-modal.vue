<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">画像から選択</p>
    </header>
    <section class="modal-card-body">
      <div class="chara-select-content">
        <div
          v-for="p in participants"
          :key="p.id"
          class="has-text-centered chara-select-box is-size-7"
          @click="selected(p.id)"
        >
          <img
            :src="p.chara.image.image_url"
            :alt="p.chara.name.name"
            :width="p.chara.image.width"
            :height="p.chara.image.height"
            :class="p.dead ? 'dead' : ''"
          />
          <p :class="charaNameClass(p)">{{ p.chara.name.name }}</p>
          <p v-if="p.dead" class="has-text-danger">
            {{ `${p.dead.village_day.day}d${p.dead.reason}` }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Village from '~/@types/village'
import VillageParticipant from '~/@types/village-participant'
import { getColorClass } from '~/components/message/message-color'

@Component({
  components: {}
})
export default class ParticipantSelectModal extends Vue {
  @Prop({ type: Array })
  private participants!: VillageParticipant[]

  private get village(): Village {
    return this.$store.getters.village
  }

  private charaNameClass(participant: VillageParticipant): string {
    return getColorClass(this.village, participant) || ''
  }

  private selected(participantId: number): void {
    this.$emit('participant-select', { participantId })
  }
}
</script>

<style lang="scss" scoped>
.modal-card {
  max-height: calc(100vh - 100px);

  .chara-select-content {
    display: flex;
    flex-wrap: wrap;

    .chara-select-box {
      border: 1px solid #cccccc;
      border-radius: 16px;
      padding: 5px;
      margin: 5px auto;
      width: 160px;

      img.dead {
        opacity: 0.3;
      }
    }
    .chara-select-box:hover {
      cursor: pointer;
      border: 1px solid $primary;
      font-weight: 700;
    }
  }
}
</style>
