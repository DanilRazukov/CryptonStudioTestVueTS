import { GetterTree } from 'vuex'
import { IWeb3State } from '~/store/web3/state'

const getters: GetterTree<IWeb3State, IWeb3State> = {
  getIsShow: (state): boolean => state.isConnected
}

export default getters
