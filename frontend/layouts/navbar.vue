<template>
  <nav class="navbar is-dark-opacity">
    <div class="navbar-brand navbar-brand-center">
      <nuxt-link class="navbar-item has-text-center" to="/">
        LASTWOLF
      </nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {}
})
export default class Navbar extends Vue {}
</script>

<style lang="scss" scoped>
.navbar {
  display: block !important;

  .navbar-brand-center {
    justify-content: center;
    align-items: center;
  }
}
</style>
