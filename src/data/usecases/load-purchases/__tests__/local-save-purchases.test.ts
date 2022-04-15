import {LocalLoadPurchases} from '@/data/usecases'
import {
  CacheStoreSpy,
  Action as CacheStoreSpyActions,
  mockPurchases,
} from '@/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  //SUT System under test
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {sut, cacheStore}
}

describe('LocalLoadPurchases.save()', () => {
  test('does not delete or insert cache on init', () => {
    const {cacheStore} = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  describe('when delete succeeds', () => {
    let instance: SutTypes, timestamp: Date

    beforeEach(() => {
      timestamp = new Date()
      instance = makeSut(timestamp)
    })

    test('calls delete and insert', async () => {
      const {cacheStore, sut} = instance

      await sut.save(mockPurchases())

      expect(cacheStore.actions).toEqual([
        CacheStoreSpyActions.delete,
        CacheStoreSpyActions.insert,
      ])
    })

    test('calls delete with correct key', async () => {
      const {cacheStore, sut} = instance

      await sut.save(mockPurchases())

      expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('calls insert with correct key', async () => {
      const {cacheStore, sut} = instance

      await sut.save(mockPurchases())

      expect(cacheStore.insertKey).toBe('purchases')
    })

    test('inserts new cache', async () => {
      const {cacheStore, sut} = instance
      const purchases = mockPurchases()

      await sut.save(purchases)

      expect(cacheStore.insertValues).toEqual({
        timestamp,
        value: purchases,
      })
    })

    test('inserts new cache without error', async () => {
      const {sut} = instance

      const promise = sut.save(mockPurchases())

      await expect(promise).resolves.toBeFalsy()
    })
  })

  describe('when delete fails', () => {
    let instance: SutTypes

    beforeEach(() => {
      instance = makeSut()
      instance.cacheStore.simulateDeleteError()
    })

    test('throws error', async () => {
      const {sut} = instance

      const promise = sut.save(mockPurchases())

      await expect(promise).rejects.toThrow()
    })

    test('does not insert new cache', done => {
      const {cacheStore, sut} = instance

      sut.save(mockPurchases()).catch(() => done())

      expect(cacheStore.actions).toEqual([CacheStoreSpyActions.delete])
    })
  })

  describe('when insert fails', () => {
    let instance: SutTypes

    beforeEach(() => {
      instance = makeSut()
      instance.cacheStore.simulateInsertError()
    })

    test('throws error', async () => {
      const {sut} = instance

      const promise = sut.save(mockPurchases())

      await expect(promise).rejects.toThrow()
    })

    test('calls delete and insert', done => {
      const {cacheStore, sut} = instance

      sut.save(mockPurchases()).catch(() => done())

      expect(cacheStore.actions).toEqual([
        CacheStoreSpyActions.delete,
        CacheStoreSpyActions.insert,
      ])
    })
  })
})
