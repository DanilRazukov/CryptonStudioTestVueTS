import { GetterTree } from 'vuex'
import { IModalOptions, IModalsState } from '~/store/modals/state'

const getters: GetterTree<IModalsState, IModalsState> = {
  getIsShow: (state): boolean => state.isShow,
  getCurrentModalKey: (state): string => state.currentModalKey,
  getOptions: (state): IModalOptions => state.options
}

export default getters
