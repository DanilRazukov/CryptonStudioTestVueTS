import { ActionTree } from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import { connectNode, connectWallet } from '~/utils/web3'
import { STAKING, REWARD } from '~/utils/abis'

const actions: ActionTree<IWeb3State, IWeb3State> = {
  async connectNode ({ dispatch }) {
    const r = connectNode()
    const tokensInfo = [
      {
        address: process.env.staking,
        abi: STAKING,
        use: 'STAKING'
      },
      {
        address: process.env.rewards,
        abi: REWARD,
        use: 'REWARD'
      }
    ]
    dispatch('token/createTokensByAddresses', tokensInfo, { root: true })
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
