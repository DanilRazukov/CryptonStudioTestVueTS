import { ActionTree } from 'vuex'
import { ILoaderState } from '~/store/loader/state'

const actions: ActionTree<ILoaderState, ILoaderState> = {
  setLoading ({ commit }, payload: boolean) {
    commit('SET_IS_LOADING', payload)
    commit('SET_STATUS_TEXT', '')
    commit('SET_IS_BG_HIDER', false)
  },
  setIsBgHider ({ commit }, payload: boolean) {
    commit('SET_IS_BG_HIDER', payload)
  },
  setStatusText ({ commit }, payload: string) {
    commit('SET_STATUS_TEXT', payload)
  }
}

export default actions
