<<<<<<< Updated upstream
const UserPage = () => {
  return (
    <div>
      Pagina de listagem de usuarios
=======
"use client";

import { DataTable } from "@/app/components/data-table";
import { useAuthGuard } from "@/app/hooks/auth-guard-hook";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button, Card, Label, SearchField } from "@heroui/react";
import EditUserModal, { EditUserForm } from "./edit-user-modal";
import { getUsers, SafeUser } from "@/app/services/api/user.service";
import AddUserModal from "./add-user-modal";

const UsersPage = () => {
  useAuthGuard();
  const [search, setSearch] = useState<string>('')
  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [forceReload, setForceReload] = useState<number>(0)
  const [editUser, setEditUser] = useState<EditUserForm | undefined>(undefined)
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [addOpen, setAddOpen] = useState<boolean>(false)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers(search || undefined);
        setUsers(response.data);
      } catch (error: unknown) {
        console.log(error);
      }
    };

    loadUsers();
  }, [search, forceReload]);

  const openEdit = (user: EditUserForm) => {
    setEditUser(user)
    setEditOpen(true)
  }

  const onEdit = () => {
    setForceReload(forceReload + 1)
  }

  const cancelEdit = () => {
    setEditUser(undefined)
    setEditOpen(false)
  }

  const onUserAdded = () => {
    setForceReload(forceReload + 1)
  }

  const columns: ColumnDef<SafeUser>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      header: "Ações",
      size: 50,
      cell: (info) => {
        const row = info.row.original

        return (
          <div className="flex flex-col justify-between gap-4">
            <Button className="flex flex-row w-full" onClick={() => openEdit({ id: row.id, name: row.name, email: row.email })} variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Editar
            </Button>
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
              Usuários
            </h1>
            <p className="text-sm text-default-500 mt-1">
              Controle e gerenciamento de usuários do sistema.
            </p>
          </div>
          <div className="flex flex-row justify-between items-end gap-4">
            <SearchField name="search" value={search} onChange={setSearch}>
              <Label className="font-bold">Pesquisar</Label>
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input className="w-70" placeholder="Pesquisar..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            <Button
              color="primary"
              onClick={() => setAddOpen(true)}
              className="flex flex-row gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Novo Usuário
            </Button>
          </div>
        </div>
        <div className="p-6">
        </div>
        <DataTable columns={columns} data={users ?? []} tableClassName="table-fixed" />
      </Card>

      {editUser && (
        <EditUserModal
          isOpen={editOpen}
          setIsOpen={setEditOpen}
          onEdit={onEdit}
          onCancel={cancelEdit}
          user={editUser}
        />
      )}
      <AddUserModal
        isOpen={addOpen}
        setIsOpen={setAddOpen}
        onAdd={onUserAdded}
      />
>>>>>>> Stashed changes
    </div>
  )
}

export default UserPage
