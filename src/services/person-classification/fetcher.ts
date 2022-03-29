import http from 'http'
import https from 'https'
import axios, {AxiosInstance} from 'axios'
import {getEnv} from '../../config/environment'

const httpAgent = new http.Agent({keepAlive: true})
const httpsAgent = new https.Agent({keepAlive: true})

const headers = {
  'Content-Type': 'application/json',
}

const personClassificationFetcher = (): AxiosInstance =>
  axios.create({
    baseURL: getEnv('baseUrl'),
    headers,
    httpAgent,
    httpsAgent,
  })

export {personClassificationFetcher}
