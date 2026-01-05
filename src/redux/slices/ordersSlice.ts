import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getTenantDomain = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
};

export interface OrderProduct {
  id: string;
  orderId: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    subCategoryId: number;
    createdBy: string;
    brand: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
export interface Order {
  id: number;
  userId: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  order_items: OrderProduct[];
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/orders/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
          cache: "no-cache",
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData?.message || "Failed to fetch orders");
      }
      const result = await response.json();
      return result?.data || [];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    orderData: {
      order_items: Array<{
        productId: string;
        quantity: number;
      }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData?.message || "Failed to create order");
      }
      const result = await response.json();
      return result?.data || result;
    } catch (error) {
      console.error("Error creating order:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/orders/update/status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData?.message || "Failed to cancel order");
      }
      const result = await response.json();
      return { orderId, ...result };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/orders/details/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(
          errorData?.message || "Failed to fetch order details"
        );
      }
      const result = await response.json();
      return result?.data || result;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);
interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: {
    fetchOrders: boolean;
    fetchOrderDetails: boolean;
    cancelOrder: boolean;
    createOrder: boolean;
  };
  error: {
    fetchOrders: string | null;
    fetchOrderDetails: string | null;
    cancelOrder: string | null;
    createOrder: string | null;
  };
  lastFetched: number | null;
}
const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: {
    fetchOrders: false,
    fetchOrderDetails: false,
    cancelOrder: false,
    createOrder: false,
  },
  error: {
    fetchOrders: null,
    fetchOrderDetails: null,
    cancelOrder: null,
    createOrder: null,
  },
  lastFetched: null,
};
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.error.fetchOrders = null;
      state.error.fetchOrderDetails = null;
      state.error.cancelOrder = null;
      state.error.createOrder = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading.fetchOrders = true;
        state.error.fetchOrders = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading.fetchOrders = false;
        state.orders = action.payload;
        state.lastFetched = Date.now();
        state.error.fetchOrders = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading.fetchOrders = false;
        state.error.fetchOrders =
          (action.payload as string) || "Failed to fetch orders";
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading.fetchOrderDetails = true;
        state.error.fetchOrderDetails = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading.fetchOrderDetails = false;
        state.selectedOrder = action.payload;
        state.error.fetchOrderDetails = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading.fetchOrderDetails = false;
        state.error.fetchOrderDetails =
          (action.payload as string) || "Failed to fetch order details";
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading.cancelOrder = true;
        state.error.cancelOrder = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.cancelOrder = false;
        const orderId = action.payload.orderId;
        const orderIndex = state.orders.findIndex(
          (order) => order.id === orderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = "cancelled";
        }
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder.status = "cancelled";
        }
        state.error.cancelOrder = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancelOrder = false;
        state.error.cancelOrder =
          (action.payload as string) || "Failed to cancel order";
      })
      .addCase(createOrder.pending, (state) => {
        state.loading.createOrder = true;
        state.error.createOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading.createOrder = false;
        state.orders.unshift(action.payload);
        state.error.createOrder = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading.createOrder = false;
        state.error.createOrder =
          (action.payload as string) || "Failed to create order";
      });
  },
});
export const { clearOrderErrors, setSelectedOrder, clearSelectedOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
