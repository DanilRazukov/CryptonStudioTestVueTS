import { ActionTree, createLogger } from 'vuex'
import { ITokensMap, ITokenState } from '~/store/token/state'
import Token from '~/classes/Token'
import { getFee, getUserAddress, fetchContractData, mintTokens } from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { CONTRACT } from '~/utils/abis'
import { ITokenGetter } from '~/store/token/getters'

const actions: ActionTree<ITokenState, ITokenState> = {
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
    console.log(map)
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
    const allowance = await fetchContractData(
      'allowance',
      token.abi,
      token.address,
      [getUserAddress(), token.address]
    )

    commit('SET_TOKEN_PROPS', {
      address,
      value: {
        balance,
        allowance
      }
    })
  },
  async approve ({ getters }:{ getters: ITokenGetter }, { tokenAddress, recipient, amount }:{ tokenAddress: string, recipient: string, amount: string }) {
    try {
      const abi = getters.getTokenAbi(tokenAddress)
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals)
      console.log(recipient, bigAmount)

      // // example get fee
      // let fee = await getFee('approve', CONTRACT, tokenAddress, [recipient, bigAmount])
      // fee = shiftedBy(fee, '18', 1)
      // console.log(fee)

      await Token.approve(abi, tokenAddress, recipient, bigAmount)
    } catch (e) {
      console.log(e)
    }
  },

  async mintTokens ({ getters }:{getters: ITokenGetter}, { tokenAddress, amount }: {tokenAddress: string, amount: string}) {
    try {
      console.log(tokenAddress)
      const abi = getters.getTokenAbi(tokenAddress)
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals, 0)
      await mintTokens(abi, tokenAddress, bigAmount)
    } catch (e) {
      console.log(e)
    }
  }
}

export default actions
