import { api } from '@/app/lib/api'
import { User } from '@/app/types/entities'

export type SafeUser = Omit<User, 'password'>

export const getUsers = async (q?: string) => {
  const response = await api.get('/app/users', {
    params: { q }
  })
  return { data: response.data } as { data: SafeUser[] }
}
