"use client";

import { Card, CardContent } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="bg-slate-100 p-8 rounded-2xl shadow-md">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>

          <p className="mt-2 text-slate-600">
            Escolha uma área para gerenciar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card
            className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            onClick={() => router.push("/items")}
          >
            <CardContent className="p-8">
              <h2 className="mb-3 text-2xl font-semibold">Itens</h2>

              <p className="text-slate-600">
                Gerencie os itens encontrados e perdidos do sistema.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            onClick={() => router.push("/users")}
          >
            <CardContent className="p-8">
              <h2 className="mb-3 text-2xl font-semibold">Usuários</h2>

              <p className="text-slate-600">
                Visualize e administre os usuários cadastrados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
