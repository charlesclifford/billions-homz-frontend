"use client";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IUser } from "@/interfaces/user.interface";
import { getRealtorById, uploadRealtorAvatar } from "@/lib/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit2Icon, EyeIcon, Loader2 } from "lucide-react";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import UserDetailSkeleton from "../users/UserDetailSkeleton";

const RealtorDetails = ({ id }: { id: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getRealtorById", id],
    queryFn: async () => getRealtorById(id),
    select: (data) => data.data as IUser,
    enabled: isOpen,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      uploadRealtorAvatar(id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allRealtors"] });
      queryClient.invalidateQueries({ queryKey: ["getRealtorById", id] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    uploadMutation.mutate(formData);

    // Reset input to allow selecting same file again
    e.target.value = "";
  };

  const userName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Guest"),
    [user]
  );

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
            Realtor Details
          </SheetTitle>
        </SheetHeader>

        {isPending ? (
          <UserDetailSkeleton />
        ) : isError ? (
          <ErrorMessage
            message={
              (error as AxiosError<{ message: string }>)?.response?.data
                .message || "Failed to load user details"
            }
            onRetry={refetch}
          />
        ) : !user ? (
          <div className="text-center py-8">Realtor not found</div>
        ) : (
          <ScrollArea className="overflow-x-hidden overflow-y-auto">
            <div className="space-y-6 py-4 px-4">
              {/* Profile Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="relative">
                    <Avatar className="size-32 border-4 border-primary/10">
                      <AvatarImage
                        src={user?.avatar?.imageUrl}
                        alt={userName}
                        className={uploadMutation.isPending ? "opacity-50" : ""}
                      />
                      <AvatarFallback className="text-4xl font-medium bg-primary/10">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {uploadMutation.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full cursor-pointer shadow-md"
                    variant="secondary"
                    onClick={handleUploadClick}
                    disabled={uploadMutation.isPending}
                  >
                    <Edit2Icon size={16} />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">{userName}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>

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
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Name</p>
                      <p className="font-medium">{user?.lastName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone || "-"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Account Status */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Account Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div>
                        <Badge
                          variant={user?.isActive ? "default" : "destructive"}
                          className="text-sm"
                        >
                          {user?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Verified</p>
                      <div>
                        <Badge
                          variant={user?.isVerified ? "default" : "outline"}
                          className="text-sm"
                        >
                          {user?.isVerified ? "Verified" : "Not Verified"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

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
                        {moment(user?.createdAt).format("MMM DD, YYYY")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Last Login
                      </p>
                      <p className="font-medium">
                        {user?.lastLogin
                          ? moment(user?.lastLogin).format(
                              "MMM DD, YYYY h:mm A"
                            )
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information (if available) */}
                {(user?.address ||
                  user?.city ||
                  user?.state ||
                  user?.country) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg">
                        Address Information
                      </h3>
                      <div className="space-y-2">
                        {user?.address && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p className="font-medium">{user.address}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                          {user?.city && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                City
                              </p>
                              <p className="font-medium">{user.city}</p>
                            </div>
                          )}
                          {user?.state && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                State
                              </p>
                              <p className="font-medium">{user.state}</p>
                            </div>
                          )}
                          {user?.country && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">
                                Country
                              </p>
                              <p className="font-medium">{user.country}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RealtorDetails;
