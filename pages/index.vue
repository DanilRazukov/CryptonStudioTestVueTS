<template>
  <div class="example">
    <button
      v-if="!isConnected"
      class="btn btn-primary"
      @click="connectWallet"
    >
      {{ $t('main.connectWallet') }}
    </button>
    <div>
      {{ $t('main.tokens') }}
    </div>
    <div class="tokens">
      <div
        v-for="address in tokensKeys"
        :key="address"
        class="tokens__info"
      >
        <div> {{ $t('main.symbol') }} {{ tokensMap[address].symbol }} </div>
        <div> {{ $t('main.decimal') }} {{ tokensMap[address].decimals }} </div>
        <div> {{ $t('main.name') }} {{ tokensMap[address].name }} </div>
        <div>
          {{ $t('main.allowance') }} {{ tokensMap[address].allowance }}
        </div>
        <div>
          {{ $t('main.balance') }} {{ tokensMap[address].balance || '-' }}
        </div>
        <div
          v-if="tokensMap[address].use === 'STAKING'"
        >
          <div>
            <input
              v-model="mint"
              type="number"
              :placeholder="$t('main.amount')"
            >
            <button
              class="btn btn-primary"
              :disabled="!mint"
              @click="handleMint(address)"
            >
              {{ $t('main.mint') }}
            </button>
          </div>
          <div>
            <input
              v-model="amount"
              type="number"
              :placeholder="$t('main.amount')"
            >
            <button
              v-if="amount <= tokensMap[address].allowance && amount > 0"
              class="btn btn-primary"
              @click="handleStake"
            >
              {{ $t('main.stake') }}
            </button>
            <button
              v-else
              class="btn btn-primary"
              :class="[
                {'disabled': amount <= 0}
              ]"
              @click="handleApprove"
            >
              {{ $t('main.approve') }}
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            {{ $t('main.staking') }} {{ staking }}
          </div>
          <input
            v-model="amountUnstake"
            type="number"
            :placeholder="$t('main.staking')"
          >
          <button
            class="btn btn-primary"
            :disabled="!amountUnstake"
            @click="unstake"
          >
            {{ $t('main.unstake') }}
          </button>
        </div>
        <div>
          <div>
            {{ $t('main.rewards') }} {{ rewards }}
          </div>
          <div>
            <button
              class="btn btn-primary"
              :disabled="!rewards"
              @click="claim"
            >
              {{ $t('main.claim') }}
            </button>
          </div>
        </div>
        <button
          class="btn btn-primary"
          @click="refresh"
        >
          {{ $t('main.refresh') }}
        </button>
      </div>
    </div>
    <div class="history">
      <b-table striped hover :items="history" />
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
    this.changeLoader(true)
    try {
      await this.connectNode()
      await this.connectWallet()
    } catch (e) {
      console.log(e)
    }
    this.changeLoader(false)
  },
  computed: {
    ...mapGetters({
      tokensMap: 'token/getTokensMap',
      tokensKeys: 'token/getTokensKeys',
      rewards: 'token/getClaimableRewards',
      staking: 'token/getStaking',
      history: 'token/getHistory',
      isConnected: 'web3/getIsConnected'
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

.history {
  &__item {
    display: flex;
    align-items: center;
    grid-gap: 10px;
  }
}
</style>
