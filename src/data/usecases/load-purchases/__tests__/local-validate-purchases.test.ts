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

describe('LocalLoadPurchases.validate()', () => {
  test('does not delete or insert cache on init', () => {
    const {cacheStore} = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  describe('when load fails', () => {
    let instance: SutTypes

    beforeEach(() => {
      instance = makeSut()
      instance.cacheStore.simulateFetchError()
    })

    test('deletes cache', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('calls cache fetch and delete', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.actions).toEqual([
        CacheStoreSpyActions.fetch,
        CacheStoreSpyActions.delete,
      ])
    })
  })

  describe('when load succeeds', () => {
    let instance: SutTypes

    beforeEach(() => {
      instance = makeSut()
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      timestamp.setSeconds(timestamp.getSeconds() + 1)
      instance = makeSut(currentDate)
      instance.cacheStore.fetchResult = {timestamp}
    })

    test('has no side effect', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })

    test('calls cache fetch with correct key', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.fetchKey).toBe('purchases')
    })
  })

  describe('when cache expired', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      timestamp.setSeconds(timestamp.getSeconds() - 1)
      instance = makeSut(currentDate)
      instance.cacheStore.fetchResult = {timestamp}
    })

    test('deletes cache', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.actions).toEqual([
        CacheStoreSpyActions.fetch,
        CacheStoreSpyActions.delete,
      ])
    })

    test('calls delete with correct key', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.deleteKey).toBe('purchases')
    })
  })

  describe('when cache its on expiration date', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      instance = makeSut(currentDate)
      instance.cacheStore.fetchResult = {timestamp}
    })

    test('deletes cache', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.actions).toEqual([
        CacheStoreSpyActions.fetch,
        CacheStoreSpyActions.delete,
      ])
    })

    test('calls delete with correct key', () => {
      const {cacheStore, sut} = instance

      sut.validate()

      expect(cacheStore.deleteKey).toBe('purchases')
    })
  })
})
