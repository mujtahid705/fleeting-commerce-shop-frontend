import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  slug: string;
  stock: number;
  size?: string;
  color?: string;
  productData: {
    id: string;
    title: string;
    slug: string;
    price: number;
    stock: number;
    brand: string;
    images: { url: string }[];
    description?: string;
    categoryId?: string | number;
    subCategoryId?: string | number;
  };
}
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
}
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
};
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalAmount };
};
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }
};
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  }
  return [];
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (state) => {
      const savedItems = loadCartFromStorage();
      state.items = savedItems;
      const { totalItems, totalAmount } = calculateTotals(savedItems);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },
    addToCart: (
      state,
      action: PayloadAction<{
        productData: CartItem["productData"];
        quantity?: number;
        size?: string;
        color?: string;
      }>
    ) => {
      const { productData, quantity = 1, size, color } = action.payload;
      const itemId = `${productData.id}-${size || "default"}-${
        color || "default"
      }`;
      const existingItem = state.items.find(
        (item) =>
          item.id === productData.id &&
          item.size === size &&
          item.color === color
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const imageUrl = productData.images[0]?.url;
        const newItem: CartItem = {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          quantity,
          image: imageUrl
            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${imageUrl}`
            : "/vercel.svg",
          brand: productData.brand,
          slug: productData.slug,
          stock: productData.stock,
          size,
          color,
          productData,
        };
        state.items.push(newItem);
      }
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCartToStorage(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{
        id: string;
        size?: string;
        color?: string;
      }>
    ) => {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      );
      const { totalItems, totalAmount } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        size?: string;
        color?: string;
        quantity: number;
      }>
    ) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          );
        } else {
          item.quantity = Math.min(quantity, item.stock);
        }
        const { totalItems, totalAmount } = calculateTotals(state.items);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      saveCartToStorage([]);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});
export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;
export default cartSlice.reducer;
