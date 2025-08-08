import { IImage } from "./user.interface";

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
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: IImage;
  permissions: AdminPermission[];
  isSuperAdmin?: boolean;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  propertiesListed: [];
  createdAt: string;
  updatedAt: string;
  lastLogin?: Date;
  isBlocked: boolean;
  isActive: boolean;
  isVerified: boolean;
  role: "admin" | "super_admin";
}

export interface IDashboardStats {
  cards: {
    totalProperties: number;
    available: number;
    sold: {
      _id: string | null;
      totalSoldUnits: number;
    }[];
    totalRevenue: number;
    requested: number;
  };
  charts: {
    salesPerformance: {
      _id: {
        month: number;
        year: number;
      };
      total: number;
    }[];
    inventoryDistribution: {
      _id: string;
      count: number;
    }[];
  };
}
