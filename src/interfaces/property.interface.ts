import { IEstate } from "./estate.interface";
import { IRealtor } from "./realtor.interface";

export interface IProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images: string[];
  status: PropertyStatus;
  realtor: string;
  features: string[];
  views: number;
  slug: string;
  propertyCode: string;
  listingType: ListingType;
  // Sales related fields
  soldPrice?: number; // Actual sold price might differ from listing price
  soldDate?: Date;
  soldBy?: IRealtor;
  commissionRate?: number; // Commission rate applied for this sale
  commissionAmount?: number;
  commissionPaid: boolean;

  isPlot?: boolean;
  estateId?: IEstate;

  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    landmark?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export type PropertyType = "residential" | "commercial" | "land";
export type PropertyStatus = "available" | "sold" | "under contract" | "rented";
export type ListingType = "rent" | "sale" | "lease";

export interface PropertyFilterInput {
  page?: number;
  limit?: number;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  listingType?: string;
}

export interface IImage {
  caption: string;
  publicId: string; // Cloudinary public_id
  imageUrl: string; // Cloudinary secure_url
}

export interface DeleteImageParams {
  publicId: string;
  propertyId: string;
  roomName?: string;
}

export interface DeleteImagesParams {
  publicIds: string[];
  propertyId: string;
  roomName?: string;
}

export interface ErrorResponse {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
