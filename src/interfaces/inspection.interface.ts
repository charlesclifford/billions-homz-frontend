export interface InspectionQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  day?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IInspection {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  source: string;
  realtor?: string;
  day: string;
  estate: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: Date;
  confirmedDate?: Date;
  cancellationReason?: string;
}
