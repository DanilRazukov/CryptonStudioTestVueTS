import Token from '~/classes/Token'

export interface ITokensMap {
  [key: string]: Token;
}

export interface stakingTokens {
  staking: number,
  rewards: number
}

export interface ITokenState {
  tokensMap: ITokensMap,
  stakerContractTokens: stakingTokens
  history: Array<any>
}

export const initState = (): ITokenState => ({
  tokensMap: {},
  stakerContractTokens: {
    staking: 0,
    rewards: 0
  },
  history: []
})

export default initState
