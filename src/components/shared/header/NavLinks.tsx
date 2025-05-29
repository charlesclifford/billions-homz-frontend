import Link from "next/link";
import { usePathname } from "next/navigation";
import { IMenu } from "./menu";
import { AnimatedLink } from "../AnimatedLink";
import { ChevronDown } from "lucide-react";

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
    <nav>
      <ul className="flex items-center gap-0">
        {items.map((item) => (
          <li key={item.href} className="relative group">
            {!item.children ? (
              <Link href={item.href} passHref>
                <span
                  className={`py-[30px] px-5 flex items-center capitalize font-semibold relative transition duration-300 hover:bg-transparent rounded-none text-base cursor-pointer ${
                    isActive(item.href) ? "text-primary" : ""
                  }`}
                >
                  <span
                    className={`relative before:absolute before:content-[''] before:bottom-0 before:left-0 before:h-[0.5px] before:bg-primary before:transition-all before:duration-500 before:w-0 group-hover:before:w-full  ${
                      isActive(item.href) ? "before:w-full" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </span>
              </Link>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  className={`py-[30px] px-5 flex items-center capitalize font-semibold relative transition duration-300 bg-transparent hover:!bg-transparent h-full rounded-none text-base group cursor-pointer ${
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
                  <ChevronDown className="ml-1 w-3.5 h-3.5 inline-block" />
                </button>
                <ul className="absolute left-0 top-[calc(100%-20px)] min-w-[220px] bg-white shadow-lg flex flex-col opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10 border border-gray-100 rounded-[20px] py-4">
                  {item?.children.map((child) => (
                    <li key={child.href} className="py-[7px] px-6">
                      <AnimatedLink
                        href={child.href}
                        className="!bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                      >
                        {child.name}
                      </AnimatedLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
