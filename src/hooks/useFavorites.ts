import { IEstate } from "@/interfaces/estate.interface";
import { IProperty } from "@/interfaces/property.interface";
import { getUserFavorites, toggleFavorite } from "@/lib/api/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface FavoritesResponse {
  properties: IProperty[];
  estates: IEstate[];
}

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-favorites"],
    queryFn: getUserFavorites,
    select: (data) => data.data as FavoritesResponse,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ type, id }: { type: "property" | "estate"; id: string }) =>
      toggleFavorite(type, id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error);
      const apiMessage =
        error?.response?.data?.message ||
        error.message ||
        "favorites toggle failed";
      toast.error(apiMessage);
    },
  });

  return {
    data,
    isLoading,
    isError,
    toggleFavorite: toggleMutation.mutate,
  };
};
