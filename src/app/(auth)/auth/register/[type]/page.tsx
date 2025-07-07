import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

const RegisterPage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const { type } = await params;

  const isValidType = ["user", "realtor"].includes(type);

  if (!isValidType) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold">Invalid Registration Type</h2>
          <p className="mt-4">Please select a valid registration type.</p>
          <Link
            href="/auth/register/user"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Go to User Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100dvh-80px)] overflow-y-auto py-12 flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold ">
              {type === "user" ? "User" : "Realtor"} Registration
            </h2>
            <p className="text-neutral-500">
              Create your {type === "user" ? "user" : "realtor"} account
            </p>
          </div>

          <RegisterForm type={type} />

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
      </div>
    </div>
  );
};

export default RegisterPage;
