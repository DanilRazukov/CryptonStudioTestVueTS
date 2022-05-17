import { ActionTree, createLogger } from 'vuex'
import { i18n } from '~/plugins/i18n'
import { ITokensMap, ITokenState } from '~/store/token/state'
import Token from '~/classes/Token'
import {
  getFee,
  getUserAddress,
  fetchContractData,
  mintTokens,
  stakeTokens,
  unstakeTokens,
  getStakerData,
  getClaimableAmount,
  getRewards,
  getContractOperationsInfo
} from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { CONTRACT } from '~/utils/abis'
import { ITokenGetter } from '~/store/token/getters'

const actions: ActionTree<ITokenState, ITokenState> = {
  initState ({ commit }) {
    commit('SET_USER_INIT_STATE')
  },

  createTokensByAddresses ({ commit }, tokensArray: Array<any>) {
    const tokens = tokensArray.map((item: any) => new Token(
      {
        address: item.address,
        abi: item.abi,
        use: item.use
      }
    ))
    const map: ITokensMap = {}
    tokens.forEach((inst) => {
      map[inst.address] = inst
    })
    commit('SET_TOKENS_MAP', map)
  },
  async fetchCommonDataToken ({ getters, dispatch }:{ getters: ITokenGetter, dispatch: any }) {
    const { getTokensKeys: tokenKeys } = getters
    await Promise.all(tokenKeys.map((address: string) => dispatch('fetchCommonDataTokenByAddress', { address })))
  },
  async fetchCommonDataTokenByAddress ({ getters, commit }, { address }: { address: string}) {
    const { getTokensMap: tokensMap } = getters
    const token = tokensMap[address]
    const [
      symbol,
      decimals,
      name
    ] = await Promise.all([
      token.fetchContractData('symbol'),
      token.fetchContractData('decimals'),
      token.fetchContractData('name')
    ])
    commit('SET_TOKEN_PROPS', {
      address,
      value: {
        symbol,
        decimals,
        name
      }
    })
  },
  async fetchUserDataToken ({ getters, dispatch }:{ getters: ITokenGetter, dispatch: any }) {
    const { getTokensKeys: tokenKeys } = getters
    await Promise.all(tokenKeys.map((address: string) => dispatch('fetchUserDataTokenByAddress', { address })))
  },
  async fetchUserDataTokenByAddress ({ getters, commit }:{ getters: ITokenGetter, commit: any }, { address }: { address: string }) {
    const { getTokensMap: tokensMap } = getters
    const token = tokensMap[address]
    let balance = await token.fetchContractData('balanceOf', [getUserAddress()])
    balance = shiftedBy(balance, token.decimals, 1)
    let allowance = await fetchContractData(
      'allowance',
      token.abi,
      token.address,
      [getUserAddress(), process.env.CONTRACT]
    )
    allowance = shiftedBy(allowance, token.decimals, 1)

    commit('SET_TOKEN_PROPS', {
      address,
      value: {
        balance,
        allowance
      }
    })
  },

  setUserStakingContractTokens ({ commit }:{commit: any}, { staking, rewards }: {staking: number, rewards: number}) {
    commit('SET_USER_STAKING_CONTRACT_TOKENS', {
      staking,
      rewards
    })
  },

  async approve ({ getters }:{ getters: ITokenGetter }, { tokenAddress, recipient, amount }:{ tokenAddress: string, recipient: string, amount: string }) {
    try {
      const abi = getters.getTokenAbi(tokenAddress)
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals, 0)
      await Token.approve(abi, tokenAddress, recipient, bigAmount)
    } catch (e) {
      console.log(e)
    }
  },

  async stake ({ getters }:{ getters: ITokenGetter }, { tokenAddress, recipient, amount }:{ tokenAddress: string, recipient: string, amount: string }) {
    try {
      const abi = getters.getTokenAbi(tokenAddress)
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals, 0)
      await Token.approve(abi, tokenAddress, recipient, bigAmount)

      // @ts-ignore
      const stakeFee = await getFee('stake', CONTRACT, process.env.CONTRACT, [bigAmount])

      await stakeTokens(bigAmount, stakeFee)
    } catch (e) {
      console.log(e)
    }
  },

  async mintTokens ({ getters }:{getters: ITokenGetter}, { tokenAddress, amount }: {tokenAddress: string, amount: string}) {
    try {
      const abi = getters.getTokenAbi(tokenAddress)
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals, 0)
      const fee = await getFee('mint', abi, tokenAddress, [getUserAddress(), bigAmount])
      await mintTokens(abi, tokenAddress, bigAmount, fee)
    } catch (e) {
      console.log(e)
    }
  },

  async unstake ({}, amount: string) {
    try {
      const bigAmount = shiftedBy(amount, '18', 0)
      // @ts-ignore
      const fee = await getFee('unstake', CONTRACT, process.env.CONTRACT, [bigAmount])
      await unstakeTokens(bigAmount, fee)
    } catch (e) {
      console.log(e)
    }
  },

  async fetchStakingContractData ({ dispatch }) {
    const stakerData = await getStakerData()
    const claimableAmount = await getClaimableAmount()
    dispatch('setUserStakingContractTokens', {
      staking: shiftedBy(stakerData[0], '18', 1),
      rewards: shiftedBy(claimableAmount, '18', 1)
    })
  },

  async getUserTokensData ({ dispatch }) {
    try {
      await dispatch('fetchStakingContractData')
      await dispatch('fetchCommonDataToken')
      await dispatch('fetchUserDataToken')
      await dispatch('getOperationsInfo')
    } catch (e) {
      console.log(e)
    }
  },

  async getRewards () {
    try {
      // @ts-ignore
      const fee = await getFee('claim', CONTRACT, process.env.CONTRACT)
      await getRewards(fee)
    } catch (e) {
      console.log(e)
    }
  },

  async getOperationsInfo ({ getters, commit }) {
    try {
      const tokens = getters.getTokensMap
      // @ts-ignore
      const stakingToken = tokens[process.env.STAKING]
      // @ts-ignore
      const rewardToken = tokens[process.env.REWARDS]
      let history = await getContractOperationsInfo()
      history = history.map((event: any) => ({
        event: event.event,
        blockHash: event.blockHash,
        time: i18n.d(event.returnValues.time * 1000, 'long'),
        amount: shiftedBy(event.returnValues.amount, stakingToken.decimals, 1),
        asset: event.event === 'Claimed' ? rewardToken.symbol : stakingToken.symbol
      }))
      commit('SET_USER_TRANSACTION_HISTORY', history)
    } catch (e) {
      console.log(e)
    }
  }
}

export default actions
