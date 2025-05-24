import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IMenu } from "./menu";

interface NavLinksProps {
  items: IMenu[];
}

const NavLinks = ({ items }: NavLinksProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-0">
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            {!item.children ? (
                <Link href={item.href} passHref>
                  <NavigationMenuLink
                    className={`py-[30px] px-5 flex items-center capitalize font-semibold relative transition duration-300 hover:bg-transparent rounded-none text-base group ${
                      isActive(item.href) ? "text-primary" : ""
                    }`}
                  >
                    <span
                      className={`relative before:absolute before:content-[''] before:bottom-0 before:left-0 before:h-[0.5px] before:bg-red-500 before:transition-all before:duration-500 before:w-0 group-hover:before:w-full hover:text-red-500 ${
                        isActive(item.href) ? "before:w-full" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  </NavigationMenuLink>
                </Link>
            ) : (
              <>
                <NavigationMenuTrigger
                  className={`py-[30px] px-5 flex items-center capitalize font-semibold relative transition duration-300 bg-transparent hover:!bg-transparent h-full rounded-none text-base group ${
                    isActive(item.href) ? "text-primary" : ""
                  }`}
                >
                  <span
                    className={`relative before:absolute before:content-[''] before:bottom-0 before:left-0 before:h-[0.5px] before:bg-primary before:transition-all before:duration-300 ${
                      isActive(item.href)
                        ? "before:w-full"
                        : "before:w-0 group-hover:before:w-full"
                    }`}
                  >
                    {item.name}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex flex-col w-[200px]">
                    {item?.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} passHref>
                          <NavigationMenuLink
                            className={`${
                              isActive(child.href) ? "text-primary" : ""
                            }`}
                          >
                            {child.name}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
