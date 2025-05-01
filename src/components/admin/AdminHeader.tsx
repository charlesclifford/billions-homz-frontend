"use client";
import { useIsTablet } from "@/hooks/useMobile";
// import { formatText } from "@/utils/helpers";
import {
  Calendar,
  MoonIcon,
  SunIcon,
  UserCircle2
} from "lucide-react";
import { WiSunrise } from "react-icons/wi";
import { ThemeToggler } from "../shared/ThemeToggler";
import { SidebarTrigger } from "../ui/sidebar";

const AdminHeader = () => {
  const isTablet = useIsTablet();

  const getGreetingTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return "morning";
    } else if (currentHour < 17) {
      return "afternoon";
    } else {
      return "evening";
    }
  };

  const greeting = getGreetingTime();

  const GreetingIcon = () => {
    switch (greeting) {
      case "morning":
        return <WiSunrise size={24} aria-label="Morning" />;
      case "afternoon":
        return <SunIcon size={20} aria-label="Afternoon" />;
      case "evening":
        return <MoonIcon size={20} aria-label="Evening" />;
      default:
        return <SunIcon />;
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="sticky top-0 z-40 w-full bg-background border-b border-gray-200 dark:border-neutral-700">
      <div className="flex w-full h-[60px] items-center px-3 bg-inherit border-b border-gray-200 dark:border-neutral-700">
        <div>{isTablet && <SidebarTrigger />}</div>

        <div className="ml-auto pr-2 flex items-center gap-2">
          <ThemeToggler />
          <div className="flex items-center">
            <UserCircle2 className="w-6 h-6" />
            <div className="flex flex-col ml-2">
              <span className="font-semibold text-sm">
                {/* {session?.user?.name} */}
              </span>
              <span className="text-xs capitalize">
                {/* {formatText(session?.user?.role as string).toLowerCase()} */}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-3 px-4 flex items-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <GreetingIcon aria-label="Greeting" />
          <p>Good {greeting}, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} aria-label="Current date" />
          <p>{today}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
