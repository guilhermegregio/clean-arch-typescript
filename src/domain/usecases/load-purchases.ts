import {PurchaseModel} from '@/domain/models'

interface LoadPurchases {
  loadAll: () => Promise<Array<Result>>
}

type Result = PurchaseModel

export type {LoadPurchases, Result}
