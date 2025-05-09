"use client";

import { useAppSelector } from "@/store/hooks";
import { ThemeToggler } from "../ThemeToggler";
import HeaderUser from "./HeaderUser";

const Header = () => {
  const { loading } = useAppSelector((state) => state.auth);

  return (
    <div className="sticky top-0 z-10 w-full bg-background border-b border-gray-200 dark:border-neutral-700">
      <div className="flex w-full h-[60px] items-center justify-between px-3 bg-inherit border-b border-gray-200 dark:border-neutral-700 container mx-auto">
        <div>Logo</div>
        <div className="pr-2 flex items-center gap-2">
          <ThemeToggler />
          <div className="flex items-center">
            {loading ? "loading..." : <HeaderUser />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
