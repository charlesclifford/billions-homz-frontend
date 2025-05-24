export interface IMenu {
  name: string;
  href: string;
  roles?: string[];
  children?: IMenu[];
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
    href: "/listing",
    children: [
      {
        name: "Estates",
        href: "/listing/estates",
      },
      {
        name: "Properties",
        href: "/listing/properties",
      },
    ],
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "Contact",
    href: "/contact-us",
  },
  {
    name: "Dashboard",
    href: "/admin",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

export const rightMenu: IMenu[] = [
  {
    name: "Favourites",
    href: "",
  },
];
