import { IPost } from "@/interfaces/blog.interface";
import { IEstate } from "@/interfaces/estate.interface";
import { IProperty } from "@/interfaces/property.interface";
import { PaginatedResponse } from "@/interfaces/user.interface";
import { getAllPosts } from "@/lib/api/blog";
import { getAllEstates, getAllProperties } from "@/lib/api/properties";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const blogRes: PaginatedResponse<IPost> = await getAllPosts({
    page: 1,
    limit: 1000,
    isPublished: true,
  });

  const estatesRes: PaginatedResponse<IEstate> = await getAllEstates({
    page: 1,
    limit: 1000,
  });
  const propertiesRes: PaginatedResponse<IProperty> = await getAllProperties({
    page: 1,
    limit: 1000,
  });

  const posts = blogRes.data || [];
  const estates = estatesRes.data || [];
  const properties = propertiesRes.data || [];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post?.slug}`,
    lastModified: new Date(post?.updatedAt),
  }));
  const estateUrls: MetadataRoute.Sitemap = estates.map((estate) => ({
    url: `${baseUrl}/listings/estates/${estate?.slug}`,
    lastModified: new Date(estate?.updatedAt),
  }));
  const propertyUrls: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${baseUrl}/listings/properties/${property?.slug}`,
    lastModified: new Date(property?.updatedAt),
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postUrls,
    ...estateUrls,
    ...propertyUrls,
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/academy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
