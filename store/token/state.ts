import Token from '~/classes/Token'

export interface ITokensMap {
  [key: string]: Token;
}

export interface ITokenState {
  tokensMap: ITokensMap
}

export const initState = (): ITokenState => ({
  tokensMap: {}
})

export default initState
