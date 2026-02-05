import RegisterPageComp from "@/components/auth/RegisterFormComp";
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
    <div className="w-full flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <RegisterPageComp type={type} />
      </div>
    </div>
  );
};

export default RegisterPage;
