import { IRealtorStats } from "@/interfaces/realtor.interface";
import { getRealtorStats } from "@/lib/api/realtors";
import { useQuery } from "@tanstack/react-query";

export function useRealtorStats() {
  return useQuery({
    queryKey: ["realtor-stats"],
    queryFn: getRealtorStats,
    select: (data) => data.data as IRealtorStats,
  });
}
