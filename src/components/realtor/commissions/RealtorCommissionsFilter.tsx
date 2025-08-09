"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusType } from "@/interfaces/commission.interface";
import { setFilter } from "@/store/features/commissions/commisson.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";

const RealtorCommissionsFilter = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.commission);

  const handleTabChange = (value: StatusType) => {
    dispatch(setFilter({ status: value }));
  };

  return (
    <Card>
      <CardContent>
        <Tabs
          value={filter.status || "pending"}
          onValueChange={(value) => handleTabChange(value as StatusType)}
        >
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="requested">Requested</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealtorCommissionsFilter;
