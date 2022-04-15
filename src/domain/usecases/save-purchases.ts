import {PurchaseModel} from '@/domain/models'

interface SavePurchases {
  save: (purchases: Array<Params>) => Promise<void>
}

type Params = PurchaseModel

export type {SavePurchases, Params}
