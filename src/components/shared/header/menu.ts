export interface IMenu {
  name: string;
  href: string;
  roles?: string[];
  children?: IMenu[];
  disabled?: boolean;
}
export const menuList: IMenu[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "About",
    href: "/about-us",
  },
  {
    name: "Listing",
    href: "/listings",
    children: [
      {
        name: "Estates",
        href: "/listings/estates",
      },
      {
        name: "Properties",
        href: "/listings/properties",
        disabled: false,
      },
    ],
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "Blog",
    href: "/blogs",
  },
  {
    name: "Contact",
    href: "/contact-us",
  },
  {
    name: "Realtor's Corner",
    href: "/#",
    roles: ["realtor"],
    children: [
      {
        name: "Dashboard",
        href: "/realtor/dashboard",
      },
    ],
  },
  {
    name: "Join as Realtor",
    href: "/auth/register/realtor",
    roles: ["user"],
  },
];
