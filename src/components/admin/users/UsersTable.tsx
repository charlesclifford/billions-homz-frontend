"use client"
import React from "react";
import { IUser } from "@/interfaces/user.interface";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
import { formatText } from "@/utils/helpers";
import moment from "moment";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/DataTable";

const ActionsComp = ({
  user,
  refetch,
}: {
  user: IUser;
  refetch: () => void;
}) => {
  const handleDelete = () => {
    toast.success(`${user?.firstName} deleted`);
    refetch();
  };

  return (
    <div className="flex items-center gap-2">
      <Button size={"icon"} variant={"outline"}>
        <EyeIcon size={16} />
      </Button>
      <Button size={"icon"} variant={"outline"}>
        <Edit2Icon size={16} />
      </Button>
      <Button size={"icon"} variant={"destructive"} onClick={handleDelete}>
        <Trash2Icon size={16} />
      </Button>
    </div>
  );
};

const UsersTable = () => {
  const columns: ColumnDef<IUser>[] = [
    // {
    //   accessorKey: "",
    //   header: "S/N",
    //   cell: ({ row }) => {
    //     const index = row.index;
    //     const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
    //     return <span className="">{serialNumber}</span>;
    //   },
    // },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        return (
          <span className="capitalize">
            {formatText(row.original?.role).toLowerCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => {
        return (
          <span>
            {moment(row.original?.createdAt).format("MMM DD, YYYY HH:mm A")}
          </span>
        );
      },
    },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        return <ActionsComp user={row.original} refetch={() => {}} />;
      },
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
};

export default UsersTable;
