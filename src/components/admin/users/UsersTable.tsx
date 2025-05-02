"use client";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import useUsers from "@/hooks/useUsers";
import { IUser } from "@/interfaces/user.interface";
import { setFilter } from "@/store/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

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
  const dispatch = useAppDispatch();

  // Get filter state from Redux
  const { filter } = useAppSelector((state) => state.user);
  const { users, totalPages, totalUsers, isPending, refetch } =
    useUsers(filter);

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "",
      header: "S/N",
      cell: ({ row }) => {
        const index = row.index;
        const serialNumber = (filter.page - 1) * filter.limit + index + 1;
        return <span>{serialNumber}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <span>{row.original?.firstName + " " + row.original?.lastName}</span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: (info) => info.getValue() || "-",
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
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        return row.original?.lastLogin ? (
          <span>
            {moment(row.original?.lastLogin).format("MMM DD, YYYY HH:mm A")}
          </span>
        ) : (
          <span className="text-muted-foreground">Never</span>
        );
      },
    },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        return <ActionsComp user={row.original} refetch={refetch} />;
      },
    },
  ];

  return (
    <div className="w-full">
      <p className="text-sm mb-4 font-medium text-muted-foreground">
        Showing{" "}
        <span className=" text-primary">
          {Math.min((filter.page - 1) * filter.limit + 1, totalUsers)} -{" "}
          {Math.min(filter.page * filter.limit, totalUsers)} of {totalUsers}
        </span>{" "}
        Users
      </p>
      <DataTable
        columns={columns}
        data={users}
        loading={isPending}
        pageCount={totalPages}
        pageIndex={filter.page - 1}
        onPaginationChange={(page) => {
          dispatch(setFilter({ page: page + 1 }));
        }}
      />
    </div>
  );
};

export default UsersTable;
