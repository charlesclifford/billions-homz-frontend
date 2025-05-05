export type AdminPermission =
  | "manage_users"
  | "manage_properties"
  | "manage_content"
  | "manage_settings"
  | "view_analytics"
  | "manage_admins";

export interface CreateAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "super_admin";
  permissions?: string[];
}

export interface IAdmin {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  permissions: AdminPermission[];
  isSuperAdmin?: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  propertiesListed: [];
}
