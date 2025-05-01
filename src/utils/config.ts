export const config = {
  CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET,

  SITE_NAME: process.env.WEBSITE_NAME || "",
  SITE_DESCRIPTION: process.env.WEBSITE_DESCRIPTION || "",
  SITE_URL: process.env.WEBSITE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
};
