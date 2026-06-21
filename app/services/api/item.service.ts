import { api } from '@/app/lib/api'
import { Item } from '@/app/types/entities'

export const getItems = async (q?: string) => {
  const response = await api.get('/app/items', {
    params: { q }
  })
  return { data: response.data } as { data: Item[] }
}
