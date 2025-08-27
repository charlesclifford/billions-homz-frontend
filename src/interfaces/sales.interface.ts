import { IEstate } from "./estate.interface";
import { IImage, IProperty } from "./property.interface";
import { IUser } from "./user.interface";

export interface SalesFilterInput {
  page?: number;
  limit?: number;
  commissionStatus?: string;
  assetType?: AssetType;
}

export interface ISale {
  _id: string;
  referenceCode: string;
  estate: IEstate;
  property: IProperty;
  realtor?: IUser;
  units: number;

  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerAddress?: string;

  amountPaid: number;

  paymentType: "full" | "installment";
  paymentMethod: "cash" | "bank_transfer" | "cheque" | "others";
  paymentProof?: IImage;

  status: "active" | "completed" | "defaulted" | "cancelled";
  notes?: string;

  createdBy: IUser;

  createdAt: string;
  updatedAt: string;

  dateSold: string;

  assetType: AssetType;
}

export type AssetType = "estate" | "property";

export interface ISalesAnalytics {
  estateSales: number;
  propertySales: number;
  totalRevenue: number;
  totalCommission: number;
}
