import { IAdmin } from "./admin.interface";
import { IRealtor } from "./realtor.interface";
import { ISale } from "./sales.interface";

export interface IPaymentRequest {
  requestedAt?: string;
  requestNote?: string;
  status: "pending" | "requested" | "approved" | "rejected" | "processed";
  rejectedReason?: string;
  processedAt?: string;
}

export interface ICommission {
  _id: string
  amount: number;
  rate: number;
  realtor: IRealtor;
  sale: ISale;

  // Payment Request Tracking
  paymentRequest: IPaymentRequest;

  approvedBy?: IAdmin;
  approvalDate?: string;

  createdAt?: string;
}

export interface CommissionsFilterInput {
  page?: number;
  limit?: number;
  commissionStatus?: string;
}