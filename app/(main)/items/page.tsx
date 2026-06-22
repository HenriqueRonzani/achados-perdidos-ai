"use client";

import { DataTable } from "@/app/components/data-table";
import { useAuthGuard } from "@/app/hooks/auth-guard-hook";
import { archiveItem, getItems } from "@/app/services/api/item.service";
import { Item } from "@/app/types/entities";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button, Card, Label, Popover, PopoverContent, PopoverTrigger, toast } from "@heroui/react";
import dayjs from "dayjs";
import { SearchField } from '@heroui/react';
import AddItemModal from "./add-item-modal";
import EditItemModal, { EditItemForm } from "./edit-item-modal";

const STATUS_LABEL: Record<Item["status"], string> = {
  open: "Em aberto",
  claimed: "Resgatado",
  archived: "Arquivado",
};


const ItemsPage = () => {  
  useAuthGuard();
  const [search, setSearch] = useState<string>('')
  const [items, setItems] = useState<Item[]>([]);
  const [addOpen, setAddOpen] = useState<boolean>(false)
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [forceReload, setForceReload] = useState<number>(0)
  const [editItem, setEditItem] = useState<EditItemForm | undefined>(undefined)

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
  };

  const onAdd = () => {
    setSearch('')
    setForceReload(forceReload + 1)
  }

  const openEdit = async (item: EditItemForm) => {
    console.log(item)
    setEditItem(item)
    setEditOpen(true)
  }

  const onEdit = async () => {
    setForceReload(forceReload + 1)
  }

  const onArchive = async (itemId: number, status: string) => {
    await archiveItem(itemId, status == 'open' ? 'archived' : 'open')
    toast('Item editado com sucesso!', {variant: "success"})
    setForceReload(forceReload + 1)
  }

  const cancelEdit = () => {
    setEditItem(undefined)
    setEditOpen(false)
  }

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
    },
    {
      header: "Ações",
      accessorKey: 'status',
      cell: (info) => {
        const row = info.row.original
        const status = row.status
        const id = row.id
        
        return (
          <div className="flex flex-col justify-between gap-4">
            <Button className="flex flex-row w-full" onClick={() => openEdit(row)} variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Editar
            </Button>
            {status === 'archived' 
              ? (
                <Button className="flex flex-row w-full" variant="outline" onClick={() => onArchive(id, status)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                  Desarquivar
                </Button>
              )
            : (
              <Button className="flex flex-row w-full" variant="outline" onClick={() => onArchive(id, status)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                Arquivar
              </Button>
            )}
          </div>  
        ) 
      }
    }
  ];

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
      
      { editItem && (
        <EditItemModal 
          isOpen={editOpen}
          setIsOpen={setEditOpen}
          onEdit={onEdit}
          onCancel={cancelEdit}
          item={editItem}
        />
        )
      }
    </div>
  );
};

export default ItemsPage;
