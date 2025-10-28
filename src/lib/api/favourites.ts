import instance from "@/services/axios";

/**
 * Get user favorites (both properties & estates)
 */
export const getUserFavorites = async () => {
  const res = await instance.get("/favourites");
  return res.data; // { success, data: { properties, estates } }
};

/**
 * Toggle a favorite (add/remove)
 * @param type - 'property' | 'estate'
 * @param itemId - Mongo ObjectId of the item
 */
export const toggleFavorite = async (
  type: "property" | "estate",
  itemId: string
) => {
  const res = await instance.post(`/favourites/toggle`, { type, itemId });
  return res.data; // { success, message, isFavorite }
};
