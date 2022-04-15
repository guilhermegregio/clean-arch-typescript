import {CacheStore, CachePolicy} from '@/data/protocols/cache'
import {SavePurchases, LoadPurchases, Params} from '@/domain/usecases'

const PURCHASES_KEY = 'purchases'

class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date,
  ) {}

  async save(purchases: Array<Params>) {
    this.cacheStore.replace(PURCHASES_KEY, {
      timestamp: this.currentDate,
      value: purchases,
    })
  }

  async loadAll() {
    try {
      const cache = this.cacheStore.fetch(PURCHASES_KEY)

      return CachePolicy.validate(cache.timestamp, this.currentDate)
        ? cache.value
        : []
    } catch (error) {
      return []
    }
  }

  async validate() {
    try {
      const cache = this.cacheStore.fetch(PURCHASES_KEY)

      if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
        throw new Error()
      }
    } catch (error) {
      this.cacheStore.delete(PURCHASES_KEY)
    }
  }
}

export {LocalLoadPurchases}
