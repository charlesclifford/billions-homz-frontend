"use client";
import { useIsTablet } from "@/hooks/useMobile";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { Calendar, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WiSunrise } from "react-icons/wi";
import { ThemeToggler } from "../shared/ThemeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";

const AdminHeader = () => {
  const isTablet = useIsTablet();
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const userName = useMemo(
    () => (user ? `${user.firstName} ${user.lastName}` : "Guest"),
    [user]
  );

  const userRole = useMemo(
    () => (user?.role ? formatText(user.role).toLowerCase() : "unknown role"),
    [user]
  );

  return (
    <div className="sticky top-0 z-10 w-full bg-background border-b border-gray-200 dark:border-neutral-700">
      <div className="flex w-full h-[60px] items-center px-3 bg-inherit border-b border-gray-200 dark:border-neutral-700">
        <div>{isTablet && <SidebarTrigger />}</div>

        <div className="ml-auto pr-2 flex items-center gap-2">
          <ThemeToggler />
          <div className="flex items-center">
            <Avatar className="size-10">
              <AvatarImage src={user?.avatar} alt="avatar" />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-2">
              <span className="font-semibold text-sm">{userName}</span>
              <span className="text-xs capitalize">{userRole}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-3 px-4 flex items-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <GreetingIcon aria-label="Greeting" />
          <p>
            Good {greeting}, {user?.firstName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} aria-label="Current date" />
          <p>{formattedDate}</p> |
          <span className="">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
