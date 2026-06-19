"use client";

import { DataTable } from "@/app/components/data-table";
import { useAuthGuard } from "@/app/hooks/auth-guard-hook";
import { getItems } from "@/app/services/api/item.service";
import { Item } from "@/app/types/entities";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import dayjs from "dayjs";

const STATUS_LABEL: Record<Item["status"], string> = {
  open: "Em aberto",
  claimed: "Resgatado",
  archived: "Arquivado",
};

const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorFn: (item) => STATUS_LABEL[item.status],
    header: "Status",
  },
  {
    accessorKey: "location",
    header: "Local",
  },
  {
    header: "Data Encontrado",
    accessorFn: (item) => dayjs(item.date_reported).format("DD/MM/YYYY"),
  },
  {
    header: "Data Resgatado",
    accessorFn: (item) => dayjs(item.date_claimed).format("DD/MM/YYYY"),
  },
];

const ItemsPage = () => {
  useAuthGuard();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getItems();
        setItems(response.data);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    loadItems();
  }, []);

  const addItem = async () => {
    // TODO: Add modal de criação de item
    console.log("click no add");
  };

  return (
    <div className="min-h-screen w-full">
      <Card className="w-full mx-auto border border-default-100 shadow-md rounded-2xl flex flex-col gap-6">
        <div className="w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Achados e Perdidos
            </h1>
            <p className="text-sm text-default-500 mt-1">
              Controle e gerenciamento de itens registrados.
            </p>
          </div>
          <div>
            <Button className="font-medium shadow-sm" onClick={addItem}>
              Novo Registro
            </Button>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={items ?? []} />
        </div>
      </Card>
    </div>
  );
};

export default ItemsPage;
