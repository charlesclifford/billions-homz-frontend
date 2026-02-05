import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminPermission } from "@/interfaces/admin.interface";
import { inviteAdmin } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["admin", "super_admin"]),
  permissions: z.array(z.string()).optional(),
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
});

export type InviteAdminFormValues = z.infer<typeof formSchema>;

const permissionLabels: Record<AdminPermission, string> = {
  manage_users: "Manage Users",
  manage_properties: "Manage Properties",
  manage_content: "Manage Content",
  // manage_settings: "Manage Settings",
  // view_analytics: "View Analytics",
  manage_admins: "Manage Admins",
};

const InviteAdmin = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<InviteAdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "admin",
      permissions: [],
      gender: undefined,
    },
  });

  const inviteMutation = useMutation({
    mutationFn: inviteAdmin,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allAdmins"] });

      form.reset();
      setOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (data: InviteAdminFormValues) => {
    inviteMutation.mutate(data);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(); // Reset form when sheet closes
    }
    setOpen(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Invite</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl">Invite Admin</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-[calc(100dvh-170px)]">
          <Form {...form}>
            <form
              id="admin-invite-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4 px-4"
            >
              <div className="space-y-4">
                <div className="bg-sidebar py-1 px-1">
                  <h3 className="font-medium">Basic Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="focus-visible:ring-0 shadow-none rounded-sm"
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
                            className="focus-visible:ring-0 shadow-none rounded-sm"
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
                          className="focus-visible:ring-0 shadow-none rounded-sm"
                          {...field}
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
                            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            "[&>input]:h-full [&>input]:outline-none",
                            "[&>div>select]:text-popover-foreground [&>div>select]:bg-popover [&>div>select]:focus:bg-accent [&>div>select]:focus:text-accent-foreground"
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-0 shadow-none rounded-sm w-full cursor-pointer">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus-visible:ring-0 shadow-none rounded-sm w-full cursor-pointer">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">
                            Super Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="bg-sidebar py-1 px-1">
                    <h3 className="font-medium">Permissions</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="permissions"
                    render={() => (
                      <FormItem>
                        <div className="space-y-3">
                          {(
                            Object.keys(permissionLabels) as AdminPermission[]
                          ).map((permission) => (
                            <FormField
                              key={permission}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={permission}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          permission
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                permission,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== permission
                                                ) || []
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {permissionLabels[permission]}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex flex-row justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-sm cursor-pointer"
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="admin-invite-form"
            className="rounded-sm cursor-pointer"
            disabled={inviteMutation.isPending}
          >
            {inviteMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Sending Invite...
              </>
            ) : (
              "Send Invite"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default InviteAdmin;
