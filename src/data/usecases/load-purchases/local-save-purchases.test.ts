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
  const sut = new LocalLoadPurchases(cacheStore, timestamp)

  return {sut, cacheStore}
}

describe('LocalLoadPurchases', () => {
  test('does not delete or insert cache on init', () => {
    const {cacheStore} = makeSut()

    expect(cacheStore.actions).toEqual([])
  })

  test('does not insert new cache when delete fails', async () => {
    const {cacheStore, sut} = makeSut()
    cacheStore.simulateDeleteError()
    const purchases = mockPurchases()

    const promise = sut.save(purchases)

    await expect(promise).rejects.toThrow()
    expect(cacheStore.actions).toEqual([CacheStoreSpyActions.delete])
  })

  test('inserts new cache when delete succeeds', async () => {
    const timestamp = new Date()
    const {cacheStore, sut} = makeSut(timestamp)
    const purchases = mockPurchases()

    const promise = sut.save(purchases)

    await expect(promise).resolves.toBeFalsy()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpyActions.delete,
      CacheStoreSpyActions.insert,
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    })
  })

  test('throws error when insert fails', async () => {
    const {cacheStore, sut} = makeSut()
    cacheStore.simulateInsertError()
    const purchases = mockPurchases()

    const promise = sut.save(purchases)

    await expect(promise).rejects.toThrow()
    expect(cacheStore.actions).toEqual([
      CacheStoreSpyActions.delete,
      CacheStoreSpyActions.insert,
    ])
  })
})
