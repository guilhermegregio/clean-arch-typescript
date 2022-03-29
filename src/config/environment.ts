export type EnvironmentSchema = {
  baseUrl: string;
};

type Keys = keyof EnvironmentSchema 

enum Environments {
  production = 'production',
  development = 'development',
  staging = 'staging',
  proxy = 'proxy'
}

const production: EnvironmentSchema = {
  baseUrl: 'https://api.creditas.io/person-classification',
}

const staging: EnvironmentSchema = {
  baseUrl: 'https://stg-api.creditas.io/person-classification',
}

const development: EnvironmentSchema = {
  baseUrl: 'https://dev-api.creditas.io/person-classification',
}

const proxy: EnvironmentSchema = {
  baseUrl: `/api/person-classification`,
}

const environments = {
  [Environments.production]: production,
  [Environments.staging]: staging,
  [Environments.development]: development,
  [Environments.proxy]: proxy
}

let defaultEnv = Environments.development

const setEnv = (environment:Environments, baseUrl:string)  => {
  if (!Object.keys(environments).includes(environment)){
    throw new Error ('Invalid environment. Try production, staging, development or proxy')
  }

  defaultEnv = environment  

  if (environment === Environments.proxy && Boolean(baseUrl)) {
    environments[Environments.proxy].baseUrl = baseUrl
  }
}

const getEnv = (key: Keys) => environments[defaultEnv][key]

export {setEnv, getEnv}
