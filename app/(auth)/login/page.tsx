"use client";

import CustomInput from "@/app/components/form/custom-input";
import { loginUser } from "@/app/services/api/auth.service";
import { Button, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import z from "zod";

const loginSchema = z.object({
  email: z.email({ error: "Email obrigatorio" }),
  password: z.string().min(1, { error: "Senha obrigatoria" }),
});

export type LoginForm = z.infer<typeof loginSchema>;

const initialForm = Object.freeze({
  email: "",
  password: "",
});

const LoginPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/menu");
    }
  }, [router]);

  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<z.ZodError["issues"] | undefined>();

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      setErrors(undefined);
    }

    try {
      const response = await loginUser(form);
      localStorage.setItem("token", response.token);
      router.replace("/menu");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error?.message : "Houve um erro";
      toast(errorMessage, { variant: "danger" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-slate-900">Login</h1>

          <CustomInput
            formState={form}
            setForm={setForm}
            errors={errors}
            path="email"
            type="email"
            placeholder="Email"
            label="E-mail"
          />

          <CustomInput
            formState={form}
            setForm={setForm}
            errors={errors}
            path="password"
            type="password"
            placeholder="Senha"
            label="Senha"
          />

          <Button type="submit">Entrar</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
