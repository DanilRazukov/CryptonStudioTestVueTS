import { GetterTree } from 'vuex'
import { ITokensMap, ITokenState } from '~/store/token/state'

export interface ITokenGetter {
  getTokensMap: ITokensMap;
  getTokensKeys: string[];
  getDecimalsByAddress: (address: string) => string;
  getTokenAbi: (address: string) => Array<any>
}

const getters: GetterTree<ITokenState, ITokenState> = {
  getTokensMap: (state): ITokensMap => state.tokensMap,
  getTokensKeys: (state): Array<string> => Object.keys(state.tokensMap),
  getDecimalsByAddress: state => (address: string): string => (state.tokensMap[address].decimals || ''),
  getTokenAbi: state => (address: string): Array<any> => (state.tokensMap[address].abi || [])
}

export default getters
