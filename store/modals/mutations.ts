import { MutationTree } from 'vuex'
import { IModalOptions, IModalsState } from '~/store/modals/state'

const mutations: MutationTree<IModalsState> = {
  SET_IS_SHOW: (state, payload: boolean) => (state.isShow = payload),
  SET_CURRENT_MODAL_KEY: (state, payload: string) => (state.currentModalKey = payload),
  SET_OPTIONS: (state, payload: IModalOptions) => (state.options = payload),
  SET_UNCLOSABLE (state) {
    state.options = {
      ...state.options,
      isUnclosable: true
    }
  }
}

export default mutations
