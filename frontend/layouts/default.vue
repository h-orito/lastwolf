<template>
  <div class="site">
    <navbar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import navbar from '~/layouts/navbar.vue'

@Component({
  components: { navbar }
})
export default class Default extends Vue {}
</script>
