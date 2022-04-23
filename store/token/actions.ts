import { ActionTree } from 'vuex'
import { ITokensMap, ITokenState } from '~/store/token/state'
import Token from '~/classes/Token'
import { getFee, getUserAddress } from '~/utils/web3'
import { shiftedBy } from '~/utils'
import { ERC20 } from '~/utils/abis'
import { ITokenGetter } from '~/store/token/getters'

const actions: ActionTree<ITokenState, ITokenState> = {
  createTokensByAddresses ({ commit }, { addresses }: { addresses: Array<string>}) {
    const tokens = addresses.map(address => new Token({ address }))
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
      decimals
    ] = await Promise.all([
      token.fetchContractData('symbol'),
      token.fetchContractData('decimals')
    ])
    commit('SET_TOKEN_PROPS', {
      address,
      value: {
        symbol,
        decimals
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
    commit('SET_TOKEN_PROPS', {
      address,
      value: {
        balance
      }
    })
  },
  async approve ({ getters }:{ getters: ITokenGetter }, { tokenAddress, recipient, amount }:{ tokenAddress: string, recipient: string, amount: string }) {
    try {
      const decimals = getters.getDecimalsByAddress(tokenAddress)
      const bigAmount = shiftedBy(amount, decimals)
      console.log(recipient, bigAmount)

      // example get fee
      let fee = await getFee('approve', ERC20, tokenAddress, [recipient, bigAmount])
      fee = shiftedBy(fee, '18', 1)
      console.log(fee)

      await Token.approve(tokenAddress, recipient, bigAmount)
    } catch (e) {
      console.log(e)
    }
  }
}

export default actions
