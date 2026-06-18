import { api } from "@/app/lib/api";

export const loginUser = async (data: object) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: unknown) {
    const message = error.response?.data?.message || "Erro ao realizar login";
    throw new Error(message);
  }
};
