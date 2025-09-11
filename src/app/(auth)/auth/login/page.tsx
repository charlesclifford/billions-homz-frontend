import LoginForm from "@/components/auth/LoginForm";
import SignUpModal from "@/components/auth/SignUpModal";

const LoginPage = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold ">Welcome back! </h2>
          <p className="text-neutral-500">Please sign in to your account</p>
        </div>
        <LoginForm />

        <SignUpModal />
      </div>
    </div>
  );
};

export default LoginPage;
