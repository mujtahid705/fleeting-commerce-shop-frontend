import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const getTenantDomain = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return JSON.parse(token) as string;
  } catch {
    return token;
  }
};

const getErrorMessage = async (response: Response, fallback: string) => {
  const errorData = await response.json().catch(() => null);
  return errorData?.message || fallback;
};

export interface ReviewUser {
  id: string;
  name: string;
  email?: string;
}

export interface ReviewProduct {
  id: string;
  title: string;
  slug?: string;
  images?: { imageUrl?: string; url?: string }[];
}

export interface CustomerReview {
  id: string;
  productId?: string;
  userId?: string;
  orderId?: number;
  rating: number;
  comment?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: ReviewUser;
  product?: ReviewProduct;
}

export interface ReviewsEnvelope {
  items: CustomerReview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AsyncError {
  status?: number;
  message: string;
}

interface CreateReviewPayload {
  productId: string;
  orderId: number;
  rating: number;
  comment?: string;
}

interface ReviewsState {
  productReviews: Record<string, ReviewsEnvelope>;
  productReviewsLoading: Record<string, boolean>;
  productReviewsError: Record<string, string | null>;
  myReviews: ReviewsEnvelope;
  myReviewsLoading: boolean;
  myReviewsError: string | null;
  createLoading: boolean;
  createError: AsyncError | null;
}

const emptyEnvelope: ReviewsEnvelope = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

const initialState: ReviewsState = {
  productReviews: {},
  productReviewsLoading: {},
  productReviewsError: {},
  myReviews: emptyEnvelope,
  myReviewsLoading: false,
  myReviewsError: null,
  createLoading: false,
  createError: null,
};

export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchProductReviews",
  async (
    params: { productId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const page = params.page ?? 1;
      const limit = params.limit ?? 10;
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const response = await fetch(
        `${base}/storefront/products/${params.productId}/reviews?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: await getErrorMessage(response, "Failed to fetch reviews"),
        });
      }

      const result = await response.json();
      return {
        productId: params.productId,
        data: (result?.data || emptyEnvelope) as ReviewsEnvelope,
      };
    } catch {
      return rejectWithValue({
        message: "Network error occurred",
      });
    }
  },
);

export const fetchMyReviews = createAsyncThunk(
  "reviews/fetchMyReviews",
  async (
    params: { page?: number; limit?: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue({
          status: 401,
          message: "No authentication token found",
        });
      }

      const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const query = new URLSearchParams({
        page: String(params?.page ?? 1),
        limit: String(params?.limit ?? 100),
      });
      const response = await fetch(
        `${base}/storefront/reviews/me?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: await getErrorMessage(
            response,
            "Failed to fetch your reviews",
          ),
        });
      }

      const result = await response.json();
      return (result?.data || emptyEnvelope) as ReviewsEnvelope;
    } catch {
      return rejectWithValue({
        message: "Network error occurred",
      });
    }
  },
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData: CreateReviewPayload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        return rejectWithValue({
          status: 401,
          message: "No authentication token found",
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/storefront/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-domain": getTenantDomain(),
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        },
      );

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: await getErrorMessage(response, "Failed to submit review"),
        });
      }

      const result = await response.json();
      return result?.data as CustomerReview;
    } catch {
      return rejectWithValue({
        message: "Network error occurred",
      });
    }
  },
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state, action) => {
        state.productReviewsLoading[action.meta.arg.productId] = true;
        state.productReviewsError[action.meta.arg.productId] = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        const { productId, data } = action.payload;
        state.productReviewsLoading[productId] = false;

        if (data.page > 1 && state.productReviews[productId]) {
          state.productReviews[productId] = {
            ...data,
            items: [
              ...state.productReviews[productId].items,
              ...(data.items || []),
            ],
          };
        } else {
          state.productReviews[productId] = data;
        }
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        const error = action.payload as AsyncError | undefined;
        state.productReviewsLoading[productId] = false;
        state.productReviewsError[productId] =
          error?.message || action.error.message || "Failed to fetch reviews";
      })
      .addCase(fetchMyReviews.pending, (state) => {
        state.myReviewsLoading = true;
        state.myReviewsError = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviewsLoading = false;
        state.myReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        const error = action.payload as AsyncError | undefined;
        state.myReviewsLoading = false;
        state.myReviewsError =
          error?.message || action.error.message || "Failed to fetch reviews";
      })
      .addCase(createReview.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createReview.rejected, (state, action) => {
        const error = action.payload as AsyncError | undefined;
        state.createLoading = false;
        state.createError = {
          status: error?.status,
          message:
            error?.message || action.error.message || "Failed to submit review",
        };
      });
  },
});

export default reviewsSlice.reducer;
