export interface IGallery {
  _id: string;
  imageUrl: string;
  publicId: string;
  caption?: string;
  tags?: string[];
  location?: string;
  category?: "property" | "land" | "event" | "estate" | "other";
  isFeatured: boolean;
  width: number;
  height: number;
}

export interface PhotosFilterInput {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  featured?: boolean;
}
