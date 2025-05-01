"use client";
import {
  IProperty,
  PropertyFilterInput,
} from "@/interfaces/property.interface";
import { getAllProperties } from "@/lib/api/properties";
import { setProperties } from "@/store/features/property/propertySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const useProperties = (params: PropertyFilterInput) => {
  const dispatch = useAppDispatch();
  const { properties } = useAppSelector((state) => state.property);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["allProperties", params],
    queryFn: async () => getAllProperties(params),
  });

  const { memoizedProperties, totalProperties, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { memoizedProperties: [], totalProperties: 0, totalPages: 0 };

    return {
      memoizedProperties: (data.data as IProperty[]) || [],
      totalProperties: data.meta.total || 0,
      totalPages: data.meta.totalPages || 0,
    };
  }, [data, isPending, isError]);

  useEffect(() => {
    if (memoizedProperties.length > 0) {
      dispatch(setProperties(memoizedProperties));
    } else {
      dispatch(setProperties([]));
    }
  }, [memoizedProperties, dispatch]);

  // ✅ Ensure properties update before returning them
  const updatedProperties = useMemo(() => properties, [properties]);

  return {
    properties: updatedProperties,
    totalProperties,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default useProperties;
