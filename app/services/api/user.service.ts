import { api } from '@/app/lib/api'
import { User } from '@/app/types/entities'

export const getUsers = async (q?: string) => {
  const response = await api.get('/app/users', {
    params: { q }
  })
  return { data: response.data } as { data: User[] }
}

export const updateUser = async (userId: number, payload: { name: string; email: string }) => {
  const response = await api.put(`/app/users/${userId}`, payload)
  return response.data
}
