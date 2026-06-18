import { api } from '@/app/lib/api'
import { ItemsFilterType } from '../database/item.service'
import { Item } from '@/app/types/entities'

export const getItems = async (params?: ItemsFilterType) => {
  const response = await api.get('/app/items', { params })
  return { data: response.data } as { data: Item[] }
}
