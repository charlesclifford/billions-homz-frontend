"use client";
import { signUpUser } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import SuccessScreen from "./SuccessScreen";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { AlertCircle, Check, Eye, EyeOff, Loader2Icon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.enum(["male", "female"], {
      required_error: "Please select your gender",
    }),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterFormComp = ({ type }: { type: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const { theme } = useTheme();

  const callbackUrl = searchParams.get("callbackUrl") || "/auth/login";

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: undefined,
      password: "",
    },
    mode: "onChange",
  });

  // Watch password and confirmPassword fields for real-time validation
  const watchedPassword = useWatch({
    control: form.control,
    name: "password",
  });

  const watchedConfirmPassword = useWatch({
    control: form.control,
    name: "confirmPassword",
  });

  // Effect to check password match in real-time
  useEffect(() => {
    if (watchedConfirmPassword && watchedPassword) {
      setPasswordMatch(watchedPassword === watchedConfirmPassword);
    } else if (watchedConfirmPassword) {
      // If confirm password has value but password is empty
      setPasswordMatch(false);
    } else {
      // If confirm password is empty
      setPasswordMatch(null);
    }
  }, [watchedPassword, watchedConfirmPassword]);

  const registerMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data, variables) => {
      setRegisteredEmail(variables.email);
      setRegistrationSuccess(true);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      gender: values.gender,
      role: type,
    };

    // console.log(">>>>>>", data);
    registerMutation.mutate({
      ...payload,
      turnstileToken: turnstileToken as string,
    });
  };

  const handleContinueToLogin = () => {
    router.push(callbackUrl);
  };

  // If registration was successful, show the success screen
  if (registrationSuccess) {
    return (
      <SuccessScreen
        email={registeredEmail}
        onContinue={handleContinueToLogin}
      />
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold ">
          {type === "user" ? "User" : "Realtor"} Registration
        </h2>
        <p className="text-neutral-500">
          Create your {type === "user" ? "user" : "realtor"} account
        </p>
      </div>

      {/* form starts here */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>First Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="John"
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Last Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-4"
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
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Phone Number</FormLabel> */}
                <FormControl className="focus-within:border-ring overflow-hidden h-9">
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="NG"
                    placeholder="Enter phone number"
                    value={field.value}
                    onChange={field.onChange}
                    className={cn(
                      "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-full w-full min-w-0 rounded-sm border bg-transparent px-3 pr-0 py-0 text-base shadow-none transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                      "[&>input]:h-full [&>input]:outline-none",
                      "[&>div>select]:text-popover-foreground [&>div>select]:bg-popover [&>div>select]:focus:bg-accent [&>div>select]:focus:text-accent-foreground",
                      "rounded-[30px] h-[45px]"
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="focus-visible:ring-0 shadow-none rounded-[30px] !h-[45px] px-4 w-full cursor-pointer">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-6 pr-12"
                      {...field}
                    />
                  </FormControl>
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
                <PasswordRequirements password={field.value} />
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="focus-visible:ring-0 shadow-none rounded-[30px] h-[45px] px-6 pr-12"
                      {...field}
                    />
                  </FormControl>
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

                  {/* Real-time match indicator */}
                  {watchedConfirmPassword && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {passwordMatch === true ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : passwordMatch === false ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Real-time match message */}
                {watchedConfirmPassword && passwordMatch !== null && (
                  <p
                    className={`text-xs mt-1 px-4 ${
                      passwordMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {passwordMatch
                      ? "Passwords match!"
                      : "Passwords don't match"}
                  </p>
                )}

                {/* <FormMessage /> */}
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

              // console.log("token received:", token);
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
            className="w-full cursor-pointer rounded-[30px] h-[45px]"
            disabled={
              registerMutation.isPending || turnstileStatus !== "success"
            }
          >
            {registerMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* form ends here */}

      <div className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default RegisterFormComp;

export function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    {
      text: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      text: "At least 1 uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      text: "At least 1 lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      text: "At least 1 number",
      valid: /[0-9]/.test(password),
    },
    {
      text: "At least 1 special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const hasTyped = password.length > 0;

  return (
    <div className="mt-2 space-y-1 px-4">
      <p className="text-xs text-muted-foreground">Password must contain:</p>
      <ul className="grid grid-cols-2 gap-1">
        {requirements.map((req, i) => (
          <li key={i} className="flex items-center gap-2">
            {req.valid ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X
                className={`h-3 w-3 ${
                  hasTyped ? "text-red-500" : "text-muted-foreground"
                }`}
              />
            )}
            <span
              className={`text-[10px] ${
                req.valid
                  ? "text-green-600"
                  : hasTyped
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
