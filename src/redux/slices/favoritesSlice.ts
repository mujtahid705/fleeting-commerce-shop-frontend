import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface FavoriteItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  slug: string;
  stock: number;
  rating: number;
  productData: {
    id: string;
    title: string;
    slug: string;
    price: number;
    stock: number;
    brand: string;
    images: { url?: string; imageUrl?: string; [key: string]: any }[];
    description?: string;
    categoryId?: string | number;
    subCategoryId?: string | number;
  };
}
interface FavoritesState {
  items: FavoriteItem[];
  totalItems: number;
  isOpen: boolean;
}
const initialState: FavoritesState = {
  items: [],
  totalItems: 0,
  isOpen: false,
};
const saveFavoritesToStorage = (items: FavoriteItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("favorites", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }
};
const loadFavoritesFromStorage = (): FavoriteItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
      return [];
    }
  }
  return [];
};
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    initializeFavorites: (state) => {
      const savedItems = loadFavoritesFromStorage();
      state.items = savedItems;
      state.totalItems = savedItems.length;
    },
    addToFavorites: (
      state,
      action: PayloadAction<{
        productData: FavoriteItem["productData"];
        originalPrice?: number;
        rating?: number;
      }>
    ) => {
      const { productData, originalPrice, rating = 4.5 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === productData.id
      );
      if (!existingItem) {
        const imageUrl =
          productData.images[0]?.imageUrl || productData.images[0]?.url;
        const newItem: FavoriteItem = {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          originalPrice,
          image: imageUrl || "/vercel.svg",
          brand: productData.brand,
          slug: productData.slug,
          stock: productData.stock,
          rating,
          productData,
        };
        state.items.push(newItem);
        state.totalItems = state.items.length;
        saveFavoritesToStorage(state.items);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      state.totalItems = state.items.length;
      saveFavoritesToStorage(state.items);
    },
    toggleFavorite: (
      state,
      action: PayloadAction<{
        productData: FavoriteItem["productData"];
        originalPrice?: number;
        rating?: number;
      }>
    ) => {
      const { productData } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === productData.id
      );
      if (existingItemIndex >= 0) {
        state.items.splice(existingItemIndex, 1);
      } else {
        const { originalPrice, rating = 4.5 } = action.payload;
        const imageUrl =
          productData.images[0]?.imageUrl || productData.images[0]?.url;
        const newItem: FavoriteItem = {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          originalPrice,
          image: imageUrl || "/vercel.svg",
          brand: productData.brand,
          slug: productData.slug,
          stock: productData.stock,
          rating,
          productData,
        };
        state.items.push(newItem);
      }
      state.totalItems = state.items.length;
      saveFavoritesToStorage(state.items);
    },
    clearFavorites: (state) => {
      state.items = [];
      state.totalItems = 0;
      saveFavoritesToStorage([]);
    },
    toggleFavorites: (state) => {
      state.isOpen = !state.isOpen;
    },
    setFavoritesOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});
export const selectIsInFavorites = (
  state: { favorites: FavoritesState },
  productId: string
) => {
  return state.favorites.items.some((item) => item.id === productId);
};
export const {
  initializeFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  toggleFavorites,
  setFavoritesOpen,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
