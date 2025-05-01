"use client";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import useUsers from "@/hooks/useUsers";
import { IUser } from "@/interfaces/user.interface";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Get filter state from Redux
  const { filter } = useAppSelector((state) => state.user);
  const { users, totalPages, totalUsers, isPending } = useUsers(filter);

  // Sync URL with filter state
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.search) params.set("search", filter.search);
    if (filter.role !== "all") params.set("role", filter.role);
    if (filter.page > 1) params.set("page", filter.page.toString());
    if (filter.sortBy !== "createdAt") params.set("sortBy", filter.sortBy);
    if (filter.sortOrder !== "desc") params.set("sortOrder", filter.sortOrder);

    router.replace(`${pathname}?${params.toString()}`);
  }, [filter, pathname, router]);

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
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        return (
          <span>
            {moment(row.original?.lastLogin).format("MMM DD, YYYY HH:mm A")}
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
      <DataTable columns={columns} data={users} loading={isPending} />
    </div>
  );
};

export default UsersTable;
