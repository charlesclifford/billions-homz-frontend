"use client";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import useAdmins from "@/hooks/useAdmins";
import { IAdmin } from "@/interfaces/admin.interface";
import { blockUser } from "@/lib/api/admin";
import { setFilter } from "@/store/features/admin/admin.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";
import AdminDetails from "./AdminDetails";
import UpdateAdmin from "./UpdateAdmin";
import { AxiosError } from "axios";

const ActionsComp = ({
  user,
  refetch,
}: {
  user: IAdmin;
  refetch: () => void;
}) => {
  const handleDelete = () => {
    toast.success(`${user?.firstName} deleted`);
    refetch();
  };

  return (
    <div className="flex items-center gap-2">
      <AdminDetails id={user._id} />
      <UpdateAdmin user={user} />
      <Button size={"icon"} variant={"destructive"} onClick={handleDelete}>
        <Trash2Icon size={16} />
      </Button>
    </div>
  );
};

const BlockAction = ({ user }: { user: IAdmin }) => {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [intendedStatus, setIntendedStatus] = useState<boolean | null>(null);
  const { user: authUser } = useAppSelector((state) => state.auth);

  const blockUserMutation = useMutation({
    mutationFn: (block: boolean) => blockUser(user._id, block),
    onSuccess: (data) => {
      toast.success(
        data.message ||
          `User ${data.isActive ? "activated" : "blocked"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["allAdmins"] });
      queryClient.invalidateQueries({ queryKey: ["getAdminById", user._id] });

      setShowDialog(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const handleSwitchToggle = (newStatus: boolean) => {
    setIntendedStatus(newStatus);
    setShowDialog(true);
  };

  const confirmStatusChange = () => {
    if (intendedStatus !== null) {
      blockUserMutation.mutate(!intendedStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {authUser?._id !== user._id && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-2">
              {blockUserMutation.isPending && (
                <Loader2Icon className="h-3 w-3 animate-spin" />
              )}
              <Switch
                checked={user.isActive}
                onCheckedChange={handleSwitchToggle}
                disabled={blockUserMutation.isPending}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {intendedStatus ? "Activate User" : "Block User"}
              </DialogTitle>
              <DialogDescription>
                {intendedStatus
                  ? `Are you sure you want to activate ${user.firstName} ${user.lastName}?`
                  : `Are you sure you want to block ${user.firstName} ${user.lastName}? Blocked admins won't be able to access the system.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={blockUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant={intendedStatus ? "default" : "destructive"}
                onClick={confirmStatusChange}
                disabled={blockUserMutation.isPending}
              >
                {blockUserMutation.isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {intendedStatus ? "Activating..." : "Blocking..."}
                  </>
                ) : intendedStatus ? (
                  "Activate"
                ) : (
                  "Block"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Badge variant={user.isActive ? "default" : "destructive"}>
        {blockUserMutation.isPending
          ? intendedStatus
            ? "Activating..."
            : "Blocking..."
          : user.isActive
          ? "Active"
          : "Blocked"}
      </Badge>
    </div>
  );
};

const MembersTable = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.admin);

  const { admins, totalPages, totalAdmins, isPending, refetch } =
    useAdmins(filter);

  const columns: ColumnDef<IAdmin>[] = [
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
        const role = row.original.role;
        const variant = role === "super_admin" ? "default" : "secondary";

        return (
          <Badge variant={variant} color="blue">
            {role === "super_admin" ? "Super Admin" : "Admin"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Joined",
      cell: ({ row }) => {
        return (
          <span>
            {moment(row.original?.createdAt).format("MMM DD, YYYY hh:mm A")}
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
            {moment(row.original?.lastLogin).format("MMM DD, YYYY hh:mm A")}
          </span>
        ) : (
          <span className="text-muted-foreground">Never</span>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return <BlockAction user={user} />;
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
          {Math.min((filter.page - 1) * filter.limit + 1, totalAdmins)} -{" "}
          {Math.min(filter.page * filter.limit, totalAdmins)} of {totalAdmins}
        </span>{" "}
        admins
      </p>
      <DataTable
        columns={columns}
        data={admins}
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

export default MembersTable;
