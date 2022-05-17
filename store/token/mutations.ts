import { MutationTree } from 'vuex'
import { ITokensMap, ITokenState } from '~/store/token/state'

const mutations: MutationTree<ITokenState> = {
  SET_TOKENS_MAP: (state, payload: ITokensMap) => (state.tokensMap = {
    ...state.tokensMap,
    ...payload
  }),
  SET_TOKEN_PROPS: (state, { address, value }: { address: string, value: Record<string, unknown>}) => {
    const token = state.tokensMap[address]
    const keys = Object.keys(value)
    for (const key of keys) {
      token[key] = value[key]
    }
    state.tokensMap = {
      ...state.tokensMap,
      [address]: token
    }
  },
  SET_USER_STAKING_CONTRACT_TOKENS: (state, { staking, rewards }: {staking: number, rewards: number}) => {
    state.stakerContractTokens.rewards = rewards
    state.stakerContractTokens.staking = staking
  },
  SET_USER_TRANSACTION_HISTORY: (state, history: Array<any>) => {
    state.history = history || []
  },
  SET_USER_INIT_STATE: (state) => {
    state.stakerContractTokens = {
      staking: 0,
      rewards: 0
    }
    Object.keys(state.tokensMap).forEach((key: string) => {
      state.tokensMap[key].balance = ''
    })
    state.history = []
  }
}

export default mutations
