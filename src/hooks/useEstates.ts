"use client";
import { IEstate } from "@/interfaces/estate.interface";
import { getAllEstates } from "@/lib/api/properties";
import { useQuery } from "@tanstack/react-query";

const useEstates = () => {
  const { data, isPending, error, isError, refetch } = useQuery<{
    data: IEstate[];
  }>({
    queryKey: ["allEstates"],
    queryFn: async () => getAllEstates(),
  });

  return {
    estates: data?.data,
    isPending,
    error,
    isError,
    refetch,
  };
};

export default useEstates;
