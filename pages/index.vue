<template>
  <div class="example">
    <button class="btn btn-primary" @click="connectWallet">
      connect wallet
    </button>
    <div>
      Tokens:
    </div>
    <div class="tokens">
      <div v-for="address in tokensKeys" :key="address" class="tokens__info">
        <div> Symbol: {{ tokensMap[address].symbol }} </div>
        <div> Decimal: {{ tokensMap[address].decimals }} </div>
        <div> Name: {{ tokensMap[address].name }} </div>
        <div>
          Allowance: {{ tokensMap[address].allowance }}
        </div>
        <div>
          Your balance: {{ tokensMap[address].balance || '-' }}
        </div>
        <div v-if="tokensMap[address].use === 'STAKING'">
          <div>
            <input v-model="mint" type="text" placeholder="mint">
            <button class="btn btn-primary" @click="handleMint(address)">
              Mint
            </button>
          </div>
          <div>
            <input v-model="amount" type="text" placeholder="amount">
            <button class="btn btn-primary" @click="handleApprove">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { mapActions, mapGetters } from 'vuex'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  data: () => ({
    recipient: '',
    amount: '',
    mint: ''
  }),
  async mounted () {
    await this.connectNode()
    await this.connectWallet()
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
      approve: 'token/approve',
      mintTokens: 'token/mintTokens'
    }),
    handleApprove () {
      const { recipient, tokensKeys, amount } = this
      this.approve({
        tokenAddress: tokensKeys[0],
        recipient,
        amount
      })
    },
    handleMint (address: string) {
      this.mintTokens({
        tokenAddress: address,
        amount: this.mint
      })
    }
  }
})

</script>
<style lang="scss" scoped>
.example {
  @include container;
}
.tokens {
  display: flex;
  justify-content: space-between;
}
</style>
