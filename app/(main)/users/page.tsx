"use client";

import { DataTable } from "@/app/components/data-table";
import { useAuthGuard } from "@/app/hooks/auth-guard-hook";
import { getUsers, SafeUser } from "@/app/services/api/user.service";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Card, Label, SearchField } from "@heroui/react";

const columns: ColumnDef<SafeUser>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
];

const UsersPage = () => {
  useAuthGuard();
  const [search, setSearch] = useState<string>('')
  const [users, setUsers] = useState<SafeUser[]>([]);

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
  }, [search]);

  return (
    <div className="flex flex-1 h-full w-full">
      <Card className="w-full mx-auto border border-default-100 shadow-md rounded-2xl flex flex-col gap-6">
        <div className="w-full mx-auto flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Usuários
            </h1>
            <p className="text-sm text-default-500 mt-1">
              Visualização dos usuários cadastrados no sistema.
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
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={users ?? []} tableClassName="table-fixed" />
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;
