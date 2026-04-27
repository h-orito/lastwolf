<template>
  <b-button
    tag="nuxt-link"
    type="is-primary"
    :size="isSmall ? 'is-small' : ''"
    :to="{ path }"
    >{{ text }}</b-button
  >
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class MessageV extends Vue {
  @Prop({ type: String })
  private text!: string

  @Prop({ type: String })
  private path!: string

  @Prop({ type: Boolean, default: false })
  private isSmall?: boolean
}
</script>
