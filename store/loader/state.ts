export interface ILoaderState {
  isLoading: boolean,
  loaderStatusText: string,
  isBgHider: boolean,
}

export const initState = (): ILoaderState => ({
  isLoading: true,
  loaderStatusText: 'Loading',
  isBgHider: true
})

export default initState
