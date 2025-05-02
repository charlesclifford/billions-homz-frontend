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
  soldPrice?: number;
  soldDate?: Date;
  soldBy?: string;
  commissionRate?: number;
}

export type PropertyType =
  | "apartment"
  | "house"
  | "land"
  | "commercial"
  | "villa";
export type PropertyStatus = "available" | "sold" | "under contract" | "rented";

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

export interface IRoom {
  name: string;
  publicId: string; // Cloudinary public_id
  imageUrl: string; // Cloudinary secure_url
}

export interface IImage {
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
