import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="w-full overflow-y-auto py-12 flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold ">Billions Homz</h2>
            <p className="text-neutral-500">Create your account</p>
          </div>

          <RegisterForm />

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
