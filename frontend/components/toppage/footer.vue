<template>
  <div>
    <ul class="has-text-left">
      <li><nuxt-link to="/charachip-list">キャラ画像一覧</nuxt-link></li>
      <li>
        要望、改善提案、不具合報告はTwitter<a
          href="https://twitter.com/ort_dev"
          target="_blank"
          >@ort_dev</a
        >へお願いします
      </li>
      <li>
        投げ銭いただける方は<a
          href="javascript:void(0);"
          @click="openKampaModal"
          >こちら</a
        >からお願いします
      </li>
      <li><a href="javascript:void(0);" @click="openTermModal">利用規約</a></li>
      <li>
        <a href="javascript:void(0);" @click="openPolicyModal"
          >プライバシーポリシー</a
        >
      </li>
    </ul>
    <kampa-modal :is-open="isKampaModalOpen" @close-modal="closeKampaModal" />
    <term-modal :is-open="isTermModalOpen" @close-modal="closeTermModal" />
    <policy-modal
      :is-open="isPolicyModalOpen"
      @close-modal="closePolicyModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
const kampaModal = () => import('~/components/toppage/modal-kampa.vue')
const termModal = () => import('~/components/toppage/modal-term.vue')
const policyModal = () => import('~/components/toppage/modal-policy.vue')

@Component({
  components: {
    kampaModal,
    termModal,
    policyModal
  }
})
export default class IndexFooter extends Vue {
  private isKampaModalOpen: boolean = false
  private isTermModalOpen: boolean = false
  private isPolicyModalOpen: boolean = false

  private openKampaModal(): void {
    this.isKampaModalOpen = true
  }

  private closeKampaModal(): void {
    this.isKampaModalOpen = false
  }

  private openTermModal(): void {
    this.isTermModalOpen = true
  }

  private closeTermModal(): void {
    this.isTermModalOpen = false
  }

  private openPolicyModal(): void {
    this.isPolicyModalOpen = true
  }

  private closePolicyModal(): void {
    this.isPolicyModalOpen = false
  }
}
</script>
