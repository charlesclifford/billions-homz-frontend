import VerifyEmailContent from "@/components/auth/VerifyEmailContent";
import React from "react";

const VerifyEmailPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { token } = await searchParams;

  return (
    <div className="w-full h-[calc(100dvh-80px)] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        {/* <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold ">Billions Homz</h2>
        </div> */}

        <VerifyEmailContent token={token as string} />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
