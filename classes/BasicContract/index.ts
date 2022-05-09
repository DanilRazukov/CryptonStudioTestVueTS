import {
  createInst,
  fetchContractData,
  getFee
} from '~/utils/web3'

export default class BasicContract {
  [key: string]: any;
  address: string
  abi: any
  use: string

  constructor ({ address, abi, use }: { address: string; abi: any; use: string }) {
    this.address = address
    this.abi = abi
    this.use = use
  }

  async getInst (): Promise<any> {
    return await createInst(this.abi, this.address)
  }

  fetchContractData (method: string, params?: Array<any>): Promise<any> {
    return fetchContractData(method, this.abi, this.address, params)
  }

  public getAbi (): Array<any> {
    return this.abi
  }

  getFee (method: string, params?: Array<any>): Promise<any> {
    return getFee(method, this.abi, this.address, params)
  }
}
