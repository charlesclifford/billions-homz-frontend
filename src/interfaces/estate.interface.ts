import { IAdmin } from "./admin.interface";
import { IImage } from "./user.interface";

export interface IEstate {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  estateType: "land" | "house";
  location: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    landmarks?: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: string[];
  documents: string[];
  bannerImage?: IImage;
  totalUnits?: number;
  soldUnits?: number;
  createdBy?: IAdmin;
  plotSize?: number;
  price?: number;
  allowInstallment: boolean;
  marketingNotes?: string;
  status: "active" | "upcoming" | "sold_out";
  createdAt: string;
  updatedAt: string;
}
