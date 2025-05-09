import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { IRealtor } from "@/interfaces/realtor.interface";
import { updateRealtor } from "@/lib/api/users";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit2Icon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { toast } from "sonner";

interface FormProps {
  user: IRealtor;
}
const UpdateRealtor = ({ user }: FormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const form = useForm<IRealtor>({
    defaultValues: {
      ...user,
    },
  });

  const updateRealtorMutation = useMutation({
    mutationFn: (data: Partial<IRealtor>) => updateRealtor(user._id, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["allRealtors"] });
      queryClient.invalidateQueries({ queryKey: ["getRealtorById", user._id] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (data: Partial<IRealtor>) => {
    updateRealtorMutation.mutate(data);
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
        <Button size={"icon"} variant={"outline"}>
          <Edit2Icon size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b">
          <SheetTitle className="text-xl">Edit Realtor</SheetTitle>
        </SheetHeader>

        <ScrollArea className="overflow-x-hidden overflow-y-auto">
          <Form {...form}>
            <form
              id="user-form"
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
                          className="focus-visible:ring-0 shadow-none rounded-sm"
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
              </div>

              <div className="space-y-4">
                <div className="bg-sidebar py-1 px-1">
                  <h3 className="font-medium">Address Information</h3>
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          className="focus-visible:ring-0 shadow-none rounded-sm"
                          {...field}
                          rows={3}
                        />
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
                        <Input
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 shadow-none rounded-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            form="user-form"
            className="rounded-sm cursor-pointer"
            disabled={updateRealtorMutation.isPending}
          >
            {updateRealtorMutation.isPending && (
              <Loader2Icon className="animate-spin" />
            )}
            {updateRealtorMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateRealtor;
