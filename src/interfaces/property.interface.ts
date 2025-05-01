export interface IProperty {
  id: string;
  name: string;
  description: string;
  images: IImage[];
  status: "available" | "unavailable";
  location: string;
  address?: string;
  price: number;
  slug: string;
  rooms?: IRoom[];
  type?: "rent" | "sell";
  beds?: number;
  baths?: number;
  area?: number;
  amenities?: string[];
  features: string[];
  virtualTour?: boolean;
  createdAt: string;
  updatedAt: string;
  draft: boolean;
  lobbies?: number;
  propertyCode?: string;
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

export interface PropertyFilterInput {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  location?: string;
  type?: string;
  rooms?: string;
  beds?: string;
  baths?: string;
  priceRange?: string;
  area?: string;
  draft?: boolean;
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