"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { useUser } from "@/hooks/use-user";
import { changeInitialPassword } from "@/lib/api/auth";
import { loginFailure, loginSuccess } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import cookies from "js-cookie";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export interface ChangeTempPassword {
  newPassword: string;
  tempToken: string;
  userId: string;
}

const UpdatePasswordForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { refetch } = useUser();

  const tempToken = searchParams.get("token");
  const userId = searchParams.get("userId");
  const callbackUrl = searchParams.get("redirect") || "/";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: changeInitialPassword,
    onSuccess: async (data) => {
      toast.success(data?.message);
      cookies.set(TOKEN_NAME, data?.accessToken);
      // Fetch user data after successful login
      try {
        const { data } = await refetch();
        cookies.set(USER_DETAILS, JSON.stringify(data?.data));
        dispatch(loginSuccess({ user: data?.data || data.user }));
      } catch (error) {
        console.log(error);
        // Fallback to the user data from login response if user fetch fails
        dispatch(loginSuccess({ user: data?.data || data.user }));
      }
      router.push(callbackUrl);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  async function onSubmit(values: FormValues) {
    if (!tempToken || !userId) {
      toast.error("Invalid password reset link");
      return;
    }
    updatePasswordMutation.mutate({
      newPassword: values.newPassword,
      tempToken: tempToken || "",
      userId: userId || "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>New Password</FormLabel> */}
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-6 pr-12"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Confirm Password</FormLabel> */}
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-6 pr-12"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer rounded-[30px] h-[45px]"
          disabled={updatePasswordMutation.isPending}
        >
          {updatePasswordMutation.isPending && (
            <Loader2Icon className="animate-spin" />
          )}
          Update Password
        </Button>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
