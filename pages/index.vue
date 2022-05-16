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
            <button
              v-if="amount <= tokensMap[address].allowance && amount > 0"
              class="btn btn-primary"
              @click="handleStake"
            >
              Stake
            </button>
            <button
              v-else
              class="btn btn-primary"
              :class="[
                {'disabled': amount <= 0}
              ]"
              @click="handleApprove"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            Staking: {{ staking }}
          </div>
          <input v-model="amountUnstake" type="text" placeholder="amount unstake">
          <button class="btn btn-primary" @click="unstake">
            Unstake
          </button>
        </div>
        <div>
          <div>
            Rewards: {{ rewards }}
          </div>
          <div>
            <button class="btn btn-primary" @click="claim">
              Claim
            </button>
          </div>
        </div>
        <button class="btn btn-primary" @click="refresh">
          Refresh
        </button>
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
    mint: '',
    amountUnstake: ''
  }),
  async mounted () {
    await this.connectNode()
    await this.connectWallet()
  },
  computed: {
    ...mapGetters({
      tokensMap: 'token/getTokensMap',
      tokensKeys: 'token/getTokensKeys',
      rewards: 'token/getClaimableRewards',
      staking: 'token/getStaking'
    })
  },
  methods: {
    ...mapActions({
      connectNode: 'web3/connectNode',
      connectWallet: 'web3/connectWallet',
      stake: 'token/stake',
      approve: 'token/approve',
      mintTokens: 'token/mintTokens',
      getUserDataTokens: 'token/fetchUserDataToken',
      changeLoader: 'loader/setLoading',
      unstakeTokens: 'token/unstake',
      fetchUserDataTokens: 'token/getUserTokensData',
      claimRewards: 'token/getRewards'
    }),
    async handleStake () {
      this.changeLoader(true)
      const { tokensKeys, amount } = this
      await this.stake({
        tokenAddress: tokensKeys[0],
        recipient: process.env.CONTRACT,
        amount
      })
      await this.fetchUserDataTokens()
      this.amount = ''
      this.changeLoader(false)
    },
    async handleApprove () {
      this.changeLoader(true)
      const { tokensKeys, amount } = this
      await this.approve({
        tokenAddress: tokensKeys[0],
        recipient: process.env.CONTRACT,
        amount
      })
      await this.fetchUserDataTokens()
      this.amount = ''
      this.changeLoader(false)
    },
    async handleMint (address: string) {
      this.changeLoader(true)
      await this.mintTokens({
        tokenAddress: address,
        amount: this.mint
      })
      await this.fetchUserDataTokens()
      this.mint = ''
      this.changeLoader(false)
    },
    async claim () {
      this.changeLoader(true)
      await this.claimRewards()
      await this.fetchUserDataTokens()
      this.changeLoader(false)
    },
    async unstake () {
      this.changeLoader(true)
      await this.unstakeTokens(this.amountUnstake)
      await this.fetchUserDataTokens()
      this.amountUnstake = ''
      this.changeLoader(false)
    },
    async refresh () {
      this.changeLoader(true)
      await this.fetchUserDataTokens()
      this.changeLoader(false)
    }
  }
})

</script>
<style lang="scss" scoped>
.example {
  @include container;
}
.disabled {
  opacity: 0.3;
  pointer-events: none;
}
.tokens {
  display: flex;
  justify-content: space-between;
}
</style>
