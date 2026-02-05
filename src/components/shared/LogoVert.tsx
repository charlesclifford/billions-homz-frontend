"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const LogoVert = ({ ...props }: React.ComponentProps<"div">) => {
  const { theme } = useTheme();
  return (
    <div className="h-20" {...props}>
      <Image
        src={
          theme === "light"
            ? "/logos/billionz-logo-vert-color.png"
            : "/logos/billionz-logo-vert-white.png"
        }
        alt="logo"
        width={300}
        height={150}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default LogoVert;
