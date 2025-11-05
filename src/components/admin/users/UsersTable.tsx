"use client";
import { DataTable } from "@/components/shared/DataTable";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
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
import useUsers from "@/hooks/useUsers";
import { IUser } from "@/interfaces/user.interface";
import { blockUser } from "@/lib/api/admin";
import { deleteUser } from "@/lib/api/users";
import { setFilter } from "@/store/features/user/user.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Loader2, Loader2Icon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import UpdateUser from "./UpdateUser";
import UserDetails from "./UserDetails";

const ActionsComp = ({ user }: { user: IUser }) => {
  const queryClient = useQueryClient();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message: data?.message || "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["allRealtors"] });
      setShowDeleteDialog(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message: error.message || error?.response?.data?.message || "",
      });
      setShowDeleteDialog(false);
      console.error("Delete error:", error);
    },
  });
  const confirmDelete = () => {
    deleteMutation.mutate(user._id);
  };

  return (
    <div className="flex items-center gap-2">
      <UserDetails id={user._id} />
      <UpdateUser user={user} />

      {authUser?.role === "super_admin" && (
        <Button
          size={"icon"}
          variant={"destructive"}
          className="cursor-pointer"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2Icon size={16} />
        </Button>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete ${user.firstName}? This action cannot
                    be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeedbackDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        actionLabel={dialog.type === "success" ? "Continue" : "Try Again"}
        onAction={() => {
          setDialog((prev) => ({ ...prev, open: false }));
        }}
        allowOutsideInteraction={false}
        hideCloseButton
      />
    </div>
  );
};

const BlockAction = ({ user }: { user: IUser }) => {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [intendedStatus, setIntendedStatus] = useState<boolean | null>(null);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const blockUserMutation = useMutation({
    mutationFn: (block: boolean) => blockUser(user._id, block),
    onSuccess: (data) => {
      setDialog({
        open: true,
        type: "success",
        title: "Success",
        message:
          data?.message ||
          `User ${data.isActive ? "activated" : "blocked"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["getUserById", user._id] });
      setShowDialog(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      setDialog({
        open: true,
        type: "error",
        title: "Delete Failed",
        message: error.message || error?.response?.data?.message || "",
      });
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
    <div className="flex items-center gap-1 flex-col">
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
              className="data-[state=checked]:bg-green-500 cursor-pointer"
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
                : `Are you sure you want to block ${user.firstName} ${user.lastName}? Blocked users won't be able to access the system.`}
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
                  <Loader2Icon className="h-4 w-4 animate-spin" />
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

      <Badge
        variant={user.isActive ? "default" : "destructive"}
        className="text-[10px]"
      >
        {blockUserMutation.isPending
          ? intendedStatus
            ? "Activating..."
            : "Blocking..."
          : user.isActive
          ? "Active"
          : "Blocked"}
      </Badge>

      <FeedbackDialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
        actionLabel={dialog.type === "success" ? "Continue" : "Try Again"}
        onAction={() => {
          if (dialog.type === "success") {
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
            setDialog((prev) => ({ ...prev, open: false }));
          } else {
            setDialog((prev) => ({ ...prev, open: false }));
          }
        }}
        allowOutsideInteraction={false}
        hideCloseButton
      />
    </div>
  );
};

const UsersTable = () => {
  const dispatch = useAppDispatch();

  // Get filter state from Redux
  const { filter } = useAppSelector((state) => state.user);
  const { users, totalPages, totalUsers, isPending } = useUsers(filter);

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
        return <ActionsComp user={row.original} />;
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
