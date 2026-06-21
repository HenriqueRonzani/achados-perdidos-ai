"use client";

import { DataTable } from "@/app/components/data-table";
import { useAuthGuard } from "@/app/hooks/auth-guard-hook";
import { getItems } from "@/app/services/api/item.service";
import { Item } from "@/app/types/entities";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button, Card, Label, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import dayjs from "dayjs";
import { SearchField } from '@heroui/react';
import AddItemModal from "./add-item-modal";

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
    accessorFn: (item) => item.date_claimed ? dayjs(item.date_claimed).format("DD/MM/YYYY") : 'Não resgatado'
  },
  {
    header: "Imagem",
    accessorKey: "image_url",
    cell: (info) => {
      const url = info.getValue() as string;
      console.log(url)
      if (!url) return <span className="text-gray-300">Sem imagem</span>;

      return (
        <Popover>
          <PopoverTrigger>
            <div
              className="cursor-pointer overflow-hidden rounded-md border border-gray-200 transition-transform hover:scale-105"
              style={{ width: '100px', height: '100px', display: 'block' }}
            >
              <img
                src={url}
                alt="Miniatura do item"
                className="h-full w-full"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          </PopoverTrigger>

          <PopoverContent className="p-1" placement="end">
            <div className="w-75 h-75 overflow-hidden rounded-lg">
              <img
                src={url}
                alt="Visualização expandida"
                className="w-full h-full object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>
      );
    }
  }];

const ItemsPage = () => {
  useAuthGuard();
  const [search, setSearch] = useState<string>('')
  const [items, setItems] = useState<Item[]>([]);
  const [addOpen, setAddOpen] = useState<boolean>(false)
  const [forceReload, setForceReload] = useState<number>(0)

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getItems(search || undefined);
        setItems(response.data);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    loadItems();
  }, [search, forceReload]);

  const addItem = async () => {
    setAddOpen(true)
    console.log("click no add");
  };

  const onAdd = () => {
    setSearch('')
    setForceReload(forceReload + 1)
  }

  return (
    <div className="flex flex-1 h-full w-full">
      <Card className="w-full mx-auto border border-default-100 shadow-md rounded-2xl flex flex-col gap-6">
        <div className="w-full mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Achados e Perdidos
            </h1>
            <p className="text-sm text-default-500 mt-1">
              Controle e gerenciamento de itens registrados.
            </p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <SearchField name="search" value={search} onChange={setSearch}>
              <Label className="font-bold">Pesquisar</Label>
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input className="w-70" placeholder="Pesquisar..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <Button className="font-medium shadow-sm" onClick={addItem}>
              Novo Registro
            </Button>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={items ?? []} />
        </div>
      </Card>

      <AddItemModal isOpen={addOpen} setIsOpen={setAddOpen} onAdd={onAdd} />
    </div>
  );
};

export default ItemsPage;
