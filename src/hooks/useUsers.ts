"use client";
import {
  IUser,
  PaginatedResponse,
  UsersFilterInput,
} from "@/interfaces/user.interface";
import { getAllUsers } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useUsers = (params: UsersFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IUser>
  >({
    queryKey: ["allUsers", params],
    queryFn: async () => getAllUsers(params),
  });

  const { users, totalUsers, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { users: [], totalUsers: 0, totalPages: 0 };

    return {
      users: data.data || [],
      totalUsers: data.pagination.total || 0,
      totalPages: data.pagination.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    users,
    totalUsers,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default useUsers;
