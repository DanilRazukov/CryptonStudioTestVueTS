import BasicContract from '~/classes/BasicContract'
import { ERC20 } from '~/utils/abis'
import { createInst, fetchContractData, getUserAddress } from '~/utils/web3'
import { error, IResponse, output } from '~/utils'

export default class Token extends BasicContract {
  decimals = '0'
  symbol: string | undefined
  balance: string | undefined

  constructor ({ address }:{ address: string}) {
    super({
      address,
      abi: ERC20
    })
  }

  static async approve (tokenAddress: string, recipient: string, amount: string): Promise<IResponse> {
    try {
      const allowance = await fetchContractData(
        'allowance',
        ERC20,
        tokenAddress,
        [getUserAddress(), recipient]
      )
      if (+allowance >= +amount) {
        return output()
      }
      const inst = await createInst(ERC20, tokenAddress)
      // const r = await inst.approve(recipient, shiftedBy('1000000000', 18)) // use this if you want to make only one big approve
      const r = await inst.approve(recipient, amount)
      return output(r)
    } catch (e) {
      console.log(e)
      return error(500, 'approve error', e)
    }
  }
}
