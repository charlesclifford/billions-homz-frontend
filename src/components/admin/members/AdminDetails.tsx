"use client"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit2Icon, EyeIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import UserDetailSkeleton from "../users/UserDetailSkeleton";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { IAdmin } from "@/interfaces/admin.interface";
import { getAdminById } from "@/lib/api/admin";
import { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
import { formatUnderscoreText } from "@/utils/helpers";

const AdminDetails = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: admin,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAdminById", id],
    queryFn: async () => getAdminById(id),
    select: (data) => data.data as IAdmin,
    enabled: isOpen,
  });

  const userName = useMemo(
    () => (admin ? `${admin.firstName} ${admin.lastName}` : "Guest"),
    [admin]
  );

  // Role badge color mapping
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default"; // or "destructive" for red
      case "admin":
        return "secondary"; // or "outline" for gray
      default:
        return "outline";
    }
  };

  // Format role display text
  const formatRole = (role: string) => {
    return role === "super_admin" ? "Super Admin" : "Admin";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <EyeIcon size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto gap-0">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-semibold">
            Admin Details
          </SheetTitle>
        </SheetHeader>

        {isPending ? (
          <UserDetailSkeleton />
        ) : isError ? (
          <ErrorMessage
            message={
              (error as AxiosError<{ message: string }>)?.response?.data
                .message || "Failed to load admin details"
            }
            onRetry={refetch}
          />
        ) : !admin ? (
          <div className="text-center py-8">Admin not found</div>
        ) : (
          <ScrollArea className="overflow-x-hidden overflow-y-auto">
            <div className="space-y-6 py-4 px-4">
              {/* Profile Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="size-32 border-4 border-primary/10">
                    <AvatarImage src={admin?.avatar} alt={userName} />
                    <AvatarFallback className="text-4xl font-medium bg-primary/10">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full cursor-pointer shadow-md"
                    variant="secondary"
                  >
                    <Edit2Icon size={16} />
                  </Button>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">{userName}</h2>
                  <p className="text-muted-foreground">{admin?.email}</p>
                  {admin?.role && (
                    <Badge
                      variant={getRoleBadgeVariant(admin.role)}
                      className="mt-1"
                    >
                      {formatRole(admin.role)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Divider */}
              <Separator />
              
              {/* Information Sections */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        First Name
                      </p>
                      <p className="font-medium">{admin?.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Name</p>
                      <p className="font-medium">{admin?.lastName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{admin?.phone || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Super Admin
                      </p>
                      <p className="font-medium">
                        {admin?.isSuperAdmin ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <Separator />

                {/* Permissions Section */}
                {admin?.permissions && admin.permissions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">Permissions</h3>
                    <div className="flex flex-wrap gap-2">
                      {admin.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-sm"
                        >
                          {formatUnderscoreText(permission)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider */}
                {admin?.permissions && admin.permissions.length > 0 && (
                  <Separator />
                )}

                {/* Account Status */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Account Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div>
                        <Badge
                          variant={admin?.isActive ? "default" : "destructive"}
                          className="text-sm"
                        >
                          {admin?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Verification
                      </p>
                      <div>
                        <Badge
                          variant={admin?.isVerified ? "default" : "destructive"}
                          className="text-sm"
                        >
                          {admin?.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <Separator />

                {/* System Information */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Joined Date
                      </p>
                      <p className="font-medium">
                        {moment(admin?.createdAt).format("MMM DD, YYYY")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Last Login
                      </p>
                      <p className="font-medium">
                        {admin?.lastLogin
                          ? moment(admin?.lastLogin).format(
                              "MMM DD, YYYY h:mm A"
                            )
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AdminDetails;