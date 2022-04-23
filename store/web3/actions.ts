import { ActionTree } from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import { connectNode, connectWallet } from '~/utils/web3'

const actions: ActionTree<IWeb3State, IWeb3State> = {
  async connectNode ({ dispatch }) {
    const r = connectNode()
    const addressesTokens = [
      '0x4b107a23361770534bd1839171bbf4b0eb56485c',
      '0xc13da4146d381c7032ca1ed6050024b4e324f4ef',
      '0x8d0c36c8842d1dc9e49fbd31b81623c1902b7819',
      '0xa364f66f40b8117bbdb772c13ca6a3d36fe95b13'
    ]
    dispatch('token/createTokensByAddresses', { addresses: addressesTokens }, { root: true })
    await dispatch('token/fetchCommonDataToken', null, { root: true })
    return r
  },
  async connectWallet ({ dispatch }) {
    const r = await connectWallet()
    if (!r.ok) {
      console.log(r)
      return r
    }
    await dispatch('token/fetchUserDataToken', null, { root: true })
    return r
  }
}

export default actions
