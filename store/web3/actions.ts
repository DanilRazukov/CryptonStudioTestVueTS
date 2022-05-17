import { ActionTree, Store } from 'vuex'
import { IWeb3State } from '~/store/web3/state'
import { connectNode, connectWallet, getClaimableAmount, getStakerData } from '~/utils/web3'
import { STAKING, REWARD } from '~/utils/abis'
import { shiftedBy } from '~/utils'

const isMainNet = process.env.isMainNet

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
  async connectWallet ({ dispatch, commit, getters }) {
    console.log('connectWallet')
    const r = await connectWallet()
    if (!r.ok) {
      console.log(r)
      return r
    }
    commit('SET_IS_CONNECTED', true)
    // @ts-ignore
    const { ethereum } = window

    ethereum.on('chainChanged', async (_chainId: any) => {
      dispatch('loader/setLoading', true, { root: true })
      commit('SET_IS_CONNECTED', false)
      const isConnected = getters.getIsConnected
      if ((_chainId === '0x4' && isMainNet === 'false' && !isConnected) || (_chainId === '0x1' && isMainNet === 'true' && !isConnected)) {
        await dispatch('connectNode')
        await dispatch('connectWallet')
      } else {
        dispatch('token/initState', {}, { root: true })
      }
      dispatch('loader/setLoading', false, { root: true })
    })
    await dispatch('token/fetchUserDataToken', null, { root: true })
    const stakerData = await getStakerData()
    const claimableAmount = await getClaimableAmount()
    dispatch('token/setUserStakingContractTokens', {
      staking: shiftedBy(stakerData[0], '18', 1),
      rewards: shiftedBy(claimableAmount, '18', 1)
    }, { root: true })
    await dispatch('token/getOperationsInfo', {}, { root: true })
    return r
  }
}

export default actions
