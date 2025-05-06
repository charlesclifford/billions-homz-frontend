import { IUser } from "@/interfaces/user.interface";

export const formatCurrency = (
  amount: number,
  locale = "en-NG",
  currency = "NGN"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    // notation: "compact",
  }).format(amount);
};

export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const formatText = (status: string) => status.replace(/_/g, " ");

// Utility function to check user roles
export const isAdminUser = (user: IUser | null): boolean => {
  return user?.role ? ["admin", "super_admin"].includes(user.role) : false;
};

export const formatUnderscoreText = (text: string) => {
  // Replace underscores with spaces and capitalize each word
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};