import {
  createInst,
  fetchContractData, getFee
} from '~/utils/web3'

export default class BasicContract {
  [key: string]: any;
  address: string
  abi: any

  constructor ({ address, abi }: { address: string; abi: any; }) {
    this.address = address
    this.abi = abi
  }

  async getInst (): Promise<any> {
    return await createInst(this.abi, this.address)
  }

  fetchContractData (method: string, params?: Array<any>): Promise<any> {
    return fetchContractData(method, this.abi, this.address, params)
  }

  getFee (method: string, params?: Array<any>): Promise<any> {
    return getFee(method, this.abi, this.address, params)
  }
}
