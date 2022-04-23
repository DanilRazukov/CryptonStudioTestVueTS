<template>
  <div class="example">
    <button class="btn btn-primary" @click="connectWallet">
      connect wallet
    </button>
    <div>
      <div>
        Tokens:
      </div>
      <div v-for="address in tokensKeys" :key="address">
        {{ tokensMap[address].symbol }}
        {{ tokensMap[address].decimals }}
        {{ tokensMap[address].balance || '-' }}
      </div>
    </div>
    <div>
      <input v-model="amount" type="text" placeholder="amount">
    </div>
    <div>
      <input v-model="recipient" type="text" placeholder="recipient">
      <button class="btn btn-primary" @click="handleApprove">
        Approve
      </button>
    </div>
  </div>
</template>
<script lang="ts">

import { mapActions, mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  data: () => ({
    recipient: '',
    amount: ''
  }),
  async mounted () {
    await this.connectNode()
    // await this.connectWallet()
  },
  computed: {
    ...mapGetters({
      tokensMap: 'token/getTokensMap',
      tokensKeys: 'token/getTokensKeys'
    })
  },
  methods: {
    ...mapActions({
      connectNode: 'web3/connectNode',
      connectWallet: 'web3/connectWallet',
      approve: 'token/approve'
    }),
    handleApprove () {
      const { recipient, tokensKeys, amount } = this
      this.approve({
        tokenAddress: tokensKeys[0],
        recipient,
        amount
      })
    }
  }
})

</script>
<style lang="scss" scoped>
.example {
  @include container;
}
</style>
