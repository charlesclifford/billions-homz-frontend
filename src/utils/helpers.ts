import { IUser } from "@/interfaces/user.interface";

export const formatCurrency = (
  amount: number,
  locale = "en-NG",
  currency = "NGN",
  notation: "standard" | "scientific" | "engineering" | "compact" = "standard"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    // maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    notation,
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
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Formats a commission rate for display
 * @param rate - The rate as a decimal (e.g., 0.1 for 10%)
 * @param options - Formatting options
 * @returns Formatted rate string
 */
export const formatRate = (
  rate: number,
  options?: {
    asPercentage?: boolean; // Show as percentage (default true)
    decimalPlaces?: number; // Number of decimal places (default 1)
    includeSymbol?: boolean; // Include % symbol (default true)
  }
): string => {
  const {
    asPercentage = true,
    decimalPlaces = 1,
    includeSymbol = true,
  } = options || {};

  // Convert to percentage if needed
  const displayValue = asPercentage ? rate * 100 : rate;

  // Format the number
  let formatted = displayValue.toFixed(decimalPlaces);

  // Add percentage symbol if needed
  if (asPercentage && includeSymbol) {
    formatted += "%";
  }

  return formatted;
};
