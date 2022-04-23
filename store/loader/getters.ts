import { GetterTree } from 'vuex'
import { ILoaderState } from '~/store/loader/state'

const getters: GetterTree<ILoaderState, ILoaderState> = {
  getIsLoading: (state): boolean => state.isLoading
}

export default getters
