"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusType } from "@/interfaces/commission.interface";
import { setFilter } from "@/store/features/commissions/commisson.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import RealtorCommissionsTable from "./RealtorCommissionsTable";

const statusConfig = {
  pending: {
    label: "Pending",
    description: "Commissions awaiting payout request",
    tableHeaders: [
      "S/N",
      "Asset Type",
      "Asset Name",
      "Buyer",
      "Sale Amount",
      "Commission Rate",
      "Commission Amount",
      "Status",
      "Date",
      "Action",
    ],
  },
  requested: {
    label: "Requests",
    description: "Payouts you've requested",
    tableHeaders: [
      "S/N",
      "Asset Type",
      "Asset Name",
      "Buyer",
      "Sale Amount",
      "Commission Amount",
      "Status",
      "Request Date",
    ],
  },
  approved: {
    label: "Approved",
    description: "Approved payouts",
    tableHeaders: [
      "S/N",
      "Asset Type",
      "Asset Name",
      "Buyer",
      "Sale Amount",
      "Commission Amount",
      "Status",
      "Payment Date",
    ],
  },
  paid: {
    label: "Paid",
    description: "Completed payouts",
    tableHeaders: [
      "S/N",
      "Asset Type",
      "Asset Name",
      "Buyer",
      "Sale Amount",
      "Commission Amount",
      "Status",
      "Payment Date",
    ],
  },
} as const;

const RealtorCommissionContent = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.commission);

  const handleTabChange = (value: StatusType) => {
    dispatch(setFilter({ status: value }));
  };

  return (
    <Tabs
      value={filter.status || "pending"}
      onValueChange={(value) => handleTabChange(value as StatusType)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
        {Object.entries(statusConfig).map(([key, config]) => (
          <TabsTrigger key={key} value={key} className="cursor-pointer">
            {config.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(statusConfig).map(([key, config]) => (
        <TabsContent key={key} value={key}>
          <RealtorCommissionsTable
            title={`${config.label} Commissions`}
            description={config.description}
            headers={Array.from(config.tableHeaders)}
            status={key as StatusType}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default RealtorCommissionContent;
