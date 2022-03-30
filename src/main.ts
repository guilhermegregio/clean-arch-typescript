import {setEnv, Environments} from './config/environment'

type setupParams = {
  environment: `${Environments}`
  baseUrl?: string
}

const setupPersonClassificationSdk = ({
  environment,
  baseUrl,
}: setupParams): void => {
  setEnv(environment as Environments, baseUrl ?? '')
}

export {setupPersonClassificationSdk}
export default setupPersonClassificationSdk
