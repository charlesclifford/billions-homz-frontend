import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about-us",
        "/listings/estates",
        "/listings/properties",
        "/contact-us",
        "/blogs",
        "/post",
        "/gallery",
        "/login",
        "/register",
        "/academy"
      ],
      disallow: ["/admin", "/account", "/realtor"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
