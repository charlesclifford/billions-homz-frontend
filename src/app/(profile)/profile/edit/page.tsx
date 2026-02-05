"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser, uploadUserAvatar } from "@/lib/api/users";
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Camera, Loader2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { cn } from "@/lib/utils";
import { useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nigeriaStates } from "@/data/nigeria-states";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedState, setSelectedState] = useState(user?.state || "");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      country: user?.country || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: FormValues) => updateUser(user?._id || "", data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({
        queryKey: ["getUserById", user?._id],
      });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      uploadUserAvatar(user?._id || "", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["getUserById", user?._id] });
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

  const onSubmit = async (data: FormValues) => {
    updateProfileMutation.mutate(data);
  };

  const userName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Guest"),
    [user]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your personal information
        </p>
      </div>

      {/* Avatar Upload */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="size-24">
                <AvatarImage src={user?.avatar?.imageUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
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
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                disabled={uploadMutation.isPending}
              >
                <Camera className="size-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter first name"
                          className="focus-visible:ring-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          className="focus-visible:ring-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email address"
                        className="focus-visible:ring-2"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInputWithCountrySelect
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="NG"
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={field.onChange}
                        className={cn(
                          "focus-visible:ring-2 rounded-md border border-input",
                          "placeholder:text-muted-foreground flex h-10 w-full px-3 py-2 text-sm",
                          "disabled:opacity-50"
                        )}
                        error={
                          field.value
                            ? isValidPhoneNumber(field.value)
                              ? undefined
                              : "Invalid phone number"
                            : "Phone number required"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedState(value);
                            // reset city when state changes
                            form.setValue("city", "");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(nigeriaStates).map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedState &&
                              nigeriaStates[selectedState]?.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/profile")}
          disabled={updateProfileMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="user-form"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending && (
            <Loader2Icon className="animate-spin" />
          )}
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
