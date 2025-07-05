"use client";

import { useAppSelector } from "@/store/hooks";
import { ThemeToggler } from "../ThemeToggler";
import HeaderUser from "./HeaderUser";
import { menuList } from "./menu";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import NavLinks from "./NavLinks";
import { useCallback, useEffect, useRef, useState } from "react";
import { HamburgerMenu } from "iconsax-reactjs";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { AnimatedLink } from "../AnimatedLink";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useIsTablet } from "@/hooks/useMobile";

const SCROLL_THRESHOLD = 150; // Minimum pixels to scroll before hiding header

const Header = () => {
  const { loading, user } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

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
              <div className="col-span-1 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
                <Link href="/" className="text-xl flex items-center gap-1">
                  <Avatar
                    className={cn(
                      "transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                      "size-10",
                      "group-data-[collapsible=icon]:size-8",
                      "group-data-[collapsible=icon]:mx-auto",
                      isScrolled ? "scale-90" : "scale-100"
                    )}
                  >
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      BH
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className={cn(
                      "text-lg font-semibold whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                      "group-data-[collapsible=icon]:hidden",
                      isScrolled
                        ? "opacity-90 scale-95"
                        : "opacity-100 scale-100"
                    )}
                  >
                    Billions Homz
                  </span>
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
                  <Drawer
                    open={isMenuOpen}
                    onOpenChange={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <DrawerContent className="px-6 pb-8">
                      <ul className="pl-2 py-4">
                        {menuList.map((item, index) => (
                          <li key={index} className="py-2">
                            {item.children && item.children.length > 0 ? (
                              <Accordion type="single" collapsible>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger className="font-normal text-xl py-2">
                                    {item.name}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="pl-4">
                                      {item.children.map((child, childIdx) => (
                                        <li
                                          key={childIdx}
                                          className="font-normal text-base py-2"
                                        >
                                          <AnimatedLink
                                            href={child.href}
                                            className="text-xl"
                                            onClick={() => setIsMenuOpen(false)}
                                          >
                                            {child.name}
                                          </AnimatedLink>
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ) : (
                              <AnimatedLink
                                href={item.href}
                                className="text-xl"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </AnimatedLink>
                            )}
                          </li>
                        ))}
                      </ul>
                    </DrawerContent>
                  </Drawer>
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
                    <div className={isScrolled ? "scale-90" : "scale-100"}>
                      {user ? (
                        <HeaderUser />
                      ) : (
                        <div>
                          <Link href={"/auth/login"}>
                            <Button>Login</Button>
                          </Link>
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
