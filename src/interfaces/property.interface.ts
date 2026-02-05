import { IAdmin } from "./admin.interface";
import { IRealtor } from "./realtor.interface";
import { IReview } from "./review.interface";

export interface IProperty {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  dimensions: number;
  images: IImage[];
  status: PropertyStatus;
  features: string[];
  documents: string[];
  views: number;
  listingType: ListingType;

  rooms: IRoom[];

  location?: {
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

  addedBy?: IAdmin;
  soldBy?: IRealtor;

  virtualTour: boolean;
  reviews: IReview[];

  createdAt: string
  updatedAt: string
}

export type PropertyType = "residential" | "commercial";
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

export interface IRoom {
  name: string;
  imageUrl: string;
  publicId: string;
}

export interface ErrorResponse {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
