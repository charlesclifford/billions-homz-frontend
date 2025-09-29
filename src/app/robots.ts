import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/account", "/realtor"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
