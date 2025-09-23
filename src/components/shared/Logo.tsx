"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const Logo = ({ ...props }: React.ComponentProps<"div">) => {
  const { resolvedTheme } = useTheme();
  return (
    <div className="h-10" {...props}>
      <Image
        src={
          resolvedTheme === "light"
            ? "/logos/billionz-logo-color.png"
            : "/logos/billionz-logo-white.png"
        }
        alt="logo"
        width={300}
        height={150}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default Logo;
