import {CacheStore} from '@/data/protocols/cache'
import * as SavePurchases from '@/domain/usecases'

enum Action {
  delete = 'delete',
  insert = 'insert',
  fetch = 'fetch',
}

const MAX_AGE_IN_DAYS = 3

const getCacheExpirationDate = (timestamp: Date): Date => {
  const maxCacheAge = new Date(timestamp)
  maxCacheAge.setDate(maxCacheAge.getDate() - MAX_AGE_IN_DAYS)

  return maxCacheAge
}

class CacheStoreSpy implements CacheStore {
  actions: Array<Action> = []
  deleteKey = ''
  insertKey = ''
  fetchKey = ''
  insertValues: Array<SavePurchases.Params> = []
  fetchResult: any = []

  fetch(key: string): any {
    this.actions.push(Action.fetch)
    this.fetchKey = key

    return this.fetchResult
  }

  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
      this.actions.push(Action.fetch)
      throw new Error()
    })
  }
  delete(key: string) {
    this.actions.push(Action.delete)
    this.deleteKey = key
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(Action.delete)
      throw new Error()
    })
  }

  insert(key: string, value: any) {
    this.actions.push(Action.insert)
    this.insertKey = key
    this.insertValues = value
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.actions.push(Action.insert)
      throw new Error()
    })
  }

  replace(key: string, value: any): void {
    this.delete(key)
    this.insert(key, value)
  }
}

export {CacheStoreSpy, Action, getCacheExpirationDate}
