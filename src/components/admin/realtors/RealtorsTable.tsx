"use client";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useRealtors from "@/hooks/useRealtors";
import { IRealtor } from "@/interfaces/realtor.interface";
import { setFilter } from "@/store/features/realtor/realtor.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

const ActionsComp = ({
  user,
  refetch,
}: {
  user: IRealtor;
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

const RealtorsTable = () => {
  const dispatch = useAppDispatch();

  // Get filter state from Redux
  const { filter } = useAppSelector((state) => state.user);
  const { realtors, totalPages, totalRealtors, isPending, refetch } =
    useRealtors(filter);

  const columns: ColumnDef<IRealtor>[] = [
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
      accessorKey: "createdAt",
      header: "Date Joined",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original?.isActive;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Blocked"}
          </Badge>
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
          {Math.min((filter.page - 1) * filter.limit + 1, totalRealtors)} -{" "}
          {Math.min(filter.page * filter.limit, totalRealtors)} of{" "}
          {totalRealtors}
        </span>{" "}
        Users
      </p>
      <DataTable
        columns={columns}
        data={realtors}
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

export default RealtorsTable;
