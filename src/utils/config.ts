export const config = {
  CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET,

  SITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Billions Homz",
  SITE_DESCRIPTION: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION || "",
  SITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.billionshomz.com",

  JWT_SECRET: process.env.JWT_SECRET || "",

  MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
};
