import { IAdmin } from "./admin.interface";
import { IImage } from "./property.interface";

export interface IPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: IAdmin;
  tags?: string[];
  isPublished?: boolean;
  slug: string;
  image?: IImage;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PostFilterInput {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isPublished?: boolean;
  featured?: boolean;
}
