import { IAdmin } from "./admin.interface";
import { IImage } from "./user.interface";

export interface IEstate {
  _id: string;
  name: string;
  description?: string;
  location: {
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
  features?: string[];
  bannerImage?: IImage;
  totalPlots?: number;
  soldPlots?: number;
  createdBy?: IAdmin;
  slug: string;
  area?: number;
  price?: number;
}
