export type UserRole = "user" | "realtor" | "admin" | "super_admin";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  avatar: string;
  role: UserRole;
  favorites: [];
  lastLogin?: Date;
  isBlocked: boolean;
  isFirstLogin: boolean;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersFilterInput {
  page?: number;
  limit?: number;
  role?: string;
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
