import {LocalLoadPurchases} from '@/data/usecases'
import {
  CacheStoreSpy,
  Action as CacheStoreSpyActions,
  getCacheExpirationDate,
} from '@/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {sut, cacheStore}
}

describe('LocalLoadPurchases', () => {
  test('does not delete or insert cache on init', () => {
    const {cacheStore} = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  test('deletes cache if load fails', () => {
    const {cacheStore, sut} = makeSut()
    cacheStore.simulateFetchError()

    sut.validate()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpyActions.fetch,
      CacheStoreSpyActions.delete,
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('has no side effect if load succeeds', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const {cacheStore, sut} = makeSut(currentDate)
    cacheStore.fetchResult = {timestamp}

    sut.validate()

    expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    expect(cacheStore.fetchKey).toBe('purchases')
  })

  test('deletes cache if its expired', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
    const {cacheStore, sut} = makeSut(currentDate)
    cacheStore.fetchResult = {timestamp}

    sut.validate()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpyActions.fetch,
      CacheStoreSpyActions.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('deletes cache if its on expiration date', () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    const {cacheStore, sut} = makeSut(currentDate)
    cacheStore.fetchResult = {timestamp}

    sut.validate()

    expect(cacheStore.actions).toEqual([
      CacheStoreSpyActions.fetch,
      CacheStoreSpyActions.delete,
    ])
    expect(cacheStore.fetchKey).toBe('purchases')
    expect(cacheStore.deleteKey).toBe('purchases')
  })
})
