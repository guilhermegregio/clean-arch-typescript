import {LocalLoadPurchases} from '@/data/usecases'
import {
  CacheStoreSpy,
  Action as CacheStoreSpyActions,
  mockPurchases,
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

describe('LocalLoadPurchases.loadAll()', () => {
  test('does not delete or insert cache on init', () => {
    const {cacheStore} = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  describe('when load fails', () => {
    test('returns an empty list', async () => {
      const {cacheStore, sut} = makeSut()
      cacheStore.simulateFetchError()

      const purchases = await sut.loadAll()

      expect(purchases).toEqual([])
    })

    test('calls cache fetch', async () => {
      const {cacheStore, sut} = makeSut()
      cacheStore.simulateFetchError()

      await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })
  })

  describe('when cache is valid', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      timestamp.setSeconds(timestamp.getSeconds() + 1)
      instance = makeSut(currentDate)

      instance.cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases(),
      }
    })

    test('returns list of purchases', async () => {
      const {sut, cacheStore} = instance

      const purchases = await sut.loadAll()

      expect(purchases).toEqual(cacheStore.fetchResult.value)
    })

    test('calls cache fetch with correct key', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.fetchKey).toBe('purchases')
    })

    test('calls cache fetch', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })
  })

  describe('when cache is empty', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      timestamp.setSeconds(timestamp.getSeconds() + 1)
      instance = makeSut(currentDate)

      instance.cacheStore.fetchResult = {
        timestamp,
        value: [],
      }
    })

    test('returns an empty list', async () => {
      const {sut, cacheStore} = instance

      const purchases = await sut.loadAll()

      expect(purchases).toEqual(cacheStore.fetchResult.value)
    })

    test('calls cache fetch', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })

    test('calls cache fetch with correct key', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.fetchKey).toBe('purchases')
    })
  })

  describe('when cache is expired', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      timestamp.setSeconds(timestamp.getSeconds() - 1)
      instance = makeSut(currentDate)

      instance.cacheStore.fetchResult = {
        timestamp,
        value: [],
      }
    })

    test('returns an empty list', async () => {
      const {sut, cacheStore} = instance

      const purchases = await sut.loadAll()

      expect(purchases).toEqual([])
    })

    test('calls cache fetch', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })

    test('calls cache fetch with correct key', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.fetchKey).toBe('purchases')
    })
  })

  describe('when cache is on expiration date', () => {
    let instance: SutTypes

    beforeEach(() => {
      const currentDate = new Date()
      const timestamp = getCacheExpirationDate(currentDate)
      instance = makeSut(currentDate)

      instance.cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases(),
      }
    })

    test('returns an empty list', async () => {
      const {sut} = instance

      const purchases = await sut.loadAll()

      expect(purchases).toEqual([])
    })

    test('calls cache fetch', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.fetch])
    })

    test('calls cache fetch with correct key', async () => {
      const {sut, cacheStore} = instance

      await sut.loadAll()

      expect(cacheStore.fetchKey).toBe('purchases')
    })
  })
})
