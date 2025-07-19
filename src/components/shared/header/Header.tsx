"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import useLogout from "@/hooks/useLogout";
import { useIsTablet } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { formatText } from "@/utils/helpers";
import { HamburgerMenu } from "iconsax-reactjs";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatedLink } from "../AnimatedLink";
import Logo from "../Logo";
import { ThemeToggler } from "../ThemeToggler";
import HeaderUser from "./HeaderUser";
import { menuList } from "./menu";
import NavLinks from "./NavLinks";

const SCROLL_THRESHOLD = 150; // Minimum pixels to scroll before hiding header

const Header = () => {
  const { loading, user } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { signOut, isLoggingOut } = useLogout();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine if scrolled past threshold for compact mode
    setIsScrolled(currentScrollY > 5);

    // Hide/show logic
    if (
      currentScrollY > lastScrollY.current &&
      currentScrollY > SCROLL_THRESHOLD
    ) {
      // Scrolling down
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  const accountOptions = [
    { name: "Profile", href: "/#" },
    {
      name: "Dashboard",
      href: "/admin",
      roles: ["admin", "super_admin"],
    },
  ];

  const userRole = useMemo(
    () => (user?.role ? formatText(user.role).toLowerCase() : "unknown role"),
    [user]
  );

  const filteredMenu = accountOptions.filter(
    (nav) =>
      !nav.roles || (userRole && nav.roles.includes(user?.role as string))
  );

  return (
    <div
      className={cn(
        "fixed top-0 z-10 w-full transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
        isVisible ? "translate-y-0" : `-translate-y-[100%]`
      )}
    >
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
          isScrolled ? "px-0" : "px-4"
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
            isScrolled ? "py-0" : "py-5"
          )}
        >
          <div
            className={cn(
              "bg-background/95 backdrop-blur-[60px] px-4 border ",
              "transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
              "transform-gpu ",
              isScrolled
                ? "rounded-none border-x-0 origin-top"
                : "rounded-[100px] origin-top"
            )}
          >
            <div
              className={cn(
                "grid grid-cols-2 lg:grid-cols-5 items-center container mx-auto",
                isScrolled ? "scale-y-[0.98]" : "scale-y-100"
              )}
            >
              {/* Logo */}
              <div className="col-span-1 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] pl-2 lg:pl-4">
                <Link href="/" className="text-xl flex items-center gap-1">
                  <Logo className="h-8" />
                </Link>
              </div>

              <div className="col-span-1 lg:hidden flex items-center justify-end py-4">
                <button
                  className="cursor-pointer rounded-[30px] size-10 flex items-center justify-center border border-neutral-500 active:bg-primary/10"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <HamburgerMenu size="24" variant="Outline" />
                </button>

                {(isMobile || isTablet) && (
                  <>
                    <Drawer
                      open={isMenuOpen}
                      onOpenChange={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      <DrawerContent className="px-2 pb-2 h-[95dvh]">
                        <ScrollArea className="flex-1 overflow-auto">
                          <ul className="px-4 py-4 space-y-2">
                            {menuList.map((item, index) => (
                              <li key={index} className="py-2">
                                {item.children && item.children.length > 0 ? (
                                  <Accordion type="single" collapsible>
                                    <AccordionItem value={`item-${index}`}>
                                      <AccordionTrigger className="font-normal text-lg py-2 hover:no-underline hover:cursor-pointer">
                                        {item.name}
                                      </AccordionTrigger>
                                      <AccordionContent className="py-0">
                                        <ul className="pl-4">
                                          {item.children.map(
                                            (child, childIdx) => (
                                              <li
                                                key={childIdx}
                                                className="py-2"
                                              >
                                                <AnimatedLink
                                                  href={
                                                    child.disabled
                                                      ? "#"
                                                      : child.href
                                                  }
                                                  className={cn(
                                                    "text-lg",
                                                    child.disabled
                                                      ? "pointer-events-none opacity-50 relative block"
                                                      : ""
                                                  )}
                                                  onClick={() =>
                                                    setIsMenuOpen(false)
                                                  }
                                                  aria-disabled={child.disabled}
                                                  tabIndex={
                                                    child.disabled
                                                      ? -1
                                                      : undefined
                                                  }
                                                >
                                                  {child.name}
                                                  {child.disabled && (
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                                      Coming Soon
                                                    </span>
                                                  )}
                                                </AnimatedLink>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ) : (
                                  <AnimatedLink
                                    href={item.href}
                                    className="text-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {item.name}
                                  </AnimatedLink>
                                )}
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>

                        <Separator className="my-1" />

                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg">Theme</span>
                            <ThemeToggler />
                          </div>
                        </div>

                        <DrawerFooter>
                          {loading ? (
                            <div className="flex justify-center">
                              <Skeleton className="h-10 w-full rounded-full" />
                            </div>
                          ) : user ? (
                            <div className="flex flex-col space-y-4">
                              <Button
                                variant="outline"
                                className="w-full rounded-[30px] h-[45px] cursor-pointer"
                                onClick={() => {
                                  setIsAccountDrawerOpen(true);
                                }}
                              >
                                My Account
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col space-y-4">
                              <Button
                                asChild
                                className="rounded-[30px] h-[40px]"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Link href="/auth/login">Sign In</Link>
                              </Button>
                              <Button
                                variant="outline"
                                className="rounded-[30px] h-[40px]"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Link href="/auth/register/user">
                                  Create Account
                                </Link>
                              </Button>
                            </div>
                          )}
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>

                    {/* Account Options Drawer */}
                    <Drawer
                      open={isAccountDrawerOpen}
                      onOpenChange={setIsAccountDrawerOpen}
                    >
                      <DrawerContent className="px-2 pb-2">
                        <div className="px-4 py-6">
                          <div className="flex items-center space-x-4 mb-6">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">
                                {user?.firstName} {user?.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {user?.email}
                              </p>
                            </div>
                          </div>

                          <ul className="space-y-2 pl-2">
                            {filteredMenu.map((option, i) => (
                              <li
                                key={i}
                                className="py-2"
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setIsAccountDrawerOpen(false);
                                }}
                              >
                                <AnimatedLink
                                  href={option.href}
                                  className="text-lg"
                                >
                                  {option.name}
                                </AnimatedLink>
                              </li>
                            ))}
                            <li className="py-2">
                              <button
                                className="text-destructive !text-lg"
                                disabled={isLoggingOut}
                                onClick={signOut}
                              >
                                Logout
                              </button>
                            </li>
                          </ul>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </>
                )}
              </div>

              {/* navlinks */}
              <div className="col-span-3 hidden lg:flex justify-center">
                <NavLinks items={menuList} />
              </div>

              <div className="pr-2 col-span-1 hidden lg:flex items-center justify-end gap-2">
                <div className="flex items-center transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  {loading ? (
                    <Skeleton
                      className={cn(
                        "rounded-full transition-all duration-500",
                        isScrolled ? "h-7 w-7" : "h-8 w-8"
                      )}
                    />
                  ) : (
                    <div className={isScrolled ? "scale-95" : "scale-100"}>
                      {user ? (
                        <HeaderUser />
                      ) : (
                        <div>
                          <Button
                            asChild
                            className="rounded-[30px] h-[40px] px-6"
                          >
                            <Link href={"/auth/login"}>Login</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <ThemeToggler />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
