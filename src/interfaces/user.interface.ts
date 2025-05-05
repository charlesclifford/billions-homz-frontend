export type UserRole = "user" | "realtor" | "admin" | "super_admin";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  avatar: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  favorites: [];
  lastLogin?: Date;
  isBlocked: boolean;
  isFirstLogin: boolean;
  phone: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role?: UserRole;
}

export interface UsersFilterInput {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
