<template>
  <div class="site">
    <google-ads />
    <navbar />
    <div class="siteContent">
      <nuxt class="has-text-centered" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import navbar from '~/layouts/navbar.vue'
import googleAds from '~/components/common/google-ads.vue'

@Component({
  components: { navbar, googleAds }
})
export default class Default extends Vue {}
</script>
