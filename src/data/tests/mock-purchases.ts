import {faker} from '@faker-js/faker'
import * as SavePurchases from '@/domain/usecases'

const mockPurchases = (): Array<SavePurchases.Params> => {
  const generateItem = () => ({
    id: faker.datatype.uuid(),
    date: faker.date.recent(),
    value: faker.datatype.number(),
  })

  return [generateItem()]
}

export {mockPurchases}
