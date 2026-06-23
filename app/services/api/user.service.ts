import { api } from '@/app/lib/api'
import { User } from '@/app/types/entities'
import { AddUserForm } from "@/app/(main)/users/add-user-modal";

export type SafeUser = Omit<User, 'password'>

export const getUsers = async (q?: string) => {
  const response = await api.get('/app/users', {
    params: { q }
  })
  return { data: response.data } as { data: SafeUser[] }
}

export const updateUser = async (userId: number, payload: { name: string; email: string }) => {
  const response = await api.put(`/app/users/${userId}`, payload)
  return response.data
}


export const addUser = async (payload: AddUserForm) => {
  const response = await api.post('/app/users', payload);
  return response.data;
};