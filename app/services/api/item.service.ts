import { AddItemForm } from '@/app/(main)/items/add-item-modal'
import { EditItemForm } from '@/app/(main)/items/edit-item-modal'
import { api } from '@/app/lib/api'
import { Item } from '@/app/types/entities'

export const getItems = async (q?: string) => {
  const response = await api.get('/app/items', {
    params: { q }
  })
  return { data: response.data } as { data: Item[] }
}

export const uploadImage = async (formData: FormData) => {
  const response = await api.post('/app/items/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data
}

export const addItem = async (payload: AddItemForm) => {
  const response = await api.post('/app/items', payload)
  return response.data
}

export const updateItem = async (itemId: number, payload: EditItemForm) => {
  const response = await api.put(`/app/items/${itemId}`, payload)
  return response.data
}

export const archiveItem = async (itemId: number, status: string) => {
  const response = await api.patch(`/app/items/${itemId}/archive?status=${status}`)
  return response.data
}
