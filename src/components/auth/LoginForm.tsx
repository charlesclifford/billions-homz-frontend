"use client";
import { TOKEN_NAME, USER_DETAILS } from "@/constants/app.constant";
import { useUser } from "@/hooks/use-user";
import { loginUser } from "@/lib/api/auth";
import { loginFailure, loginSuccess } from "@/store/features/auth/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import cookies from "js-cookie";
import { AlertCircle, Eye, EyeOff, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PageLoader } from "../shared/PageLoader";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginFormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { refetch } = useUser();
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const callbackUrl = searchParams.get("redirect") || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      if (data?.requiresPasswordChange) {
        setRedirecting(true);
        router.push(
          `/auth/update-password?token=${data?.tempToken}&userId=${data?.userId}`
        );
      } else {
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
        setRedirecting(true);
        router.push(callbackUrl);
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the security check");
      return;
    }
    loginMutation.mutate({ ...values, turnstileToken });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-4"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-end items-center">
                  {/* <FormLabel>Password</FormLabel> */}
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-4 pr-12"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            options={{
              theme: theme === "dark" || theme === "system" ? "dark" : "light",
              size: "flexible",
            }}
            onError={() => {
              setTurnstileStatus("error");
              setTurnstileError("Security check failed. Please try again.");
            }}
            onExpire={() => {
              setTurnstileStatus("expired");
              setTurnstileError("Security check expired. Please verify again.");
            }}
            onWidgetLoad={() => {
              setTurnstileStatus("required");
              setTurnstileError(null);
            }}
            onSuccess={(token) => {
              setTurnstileStatus("success");
              setTurnstileToken(token);
              setTurnstileError(null);

              console.log("token received:", token);
            }}
            scriptOptions={{
              async: true,
              defer: true,
              appendTo: "head",
            }}
          />
          {turnstileError && (
            <div
              className="flex items-center gap-2 text-red-500 text-sm mb-2"
              aria-live="polite"
            >
              <AlertCircle size={16} />
              <span>{turnstileError}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending || turnstileStatus !== "success"}
            className="w-full rounded-[30px] cursor-pointer h-[45px]"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      {redirecting && <PageLoader />}
    </>
  );
};

export default LoginForm;
