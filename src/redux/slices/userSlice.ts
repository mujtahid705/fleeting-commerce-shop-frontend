import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Storage utilities
const isClient = () => typeof window !== "undefined";

const setStorageItem = (key: string, value: any) => {
  if (isClient()) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key} in localStorage:`, error);
    }
  }
};

const getStorageItem = (key: string) => {
  if (isClient()) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }
  return null;
};

const removeStorageItem = (key: string) => {
  if (isClient()) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

const clearAuthStorage = () => {
  removeStorageItem("token");
  removeStorageItem("role");
  removeStorageItem("userData");
};

const handleUnauthorized = (status: number, message?: string) => {
  if (status === 401 || message?.toLowerCase().includes("unauthorized")) {
    console.log("401 Unauthorized in userSlice:", { status, message });
    clearAuthStorage();
    if (isClient()) {
      window.location.href = "/";
    }
  }
};

// Auth API calls
const getTenantDomain = () => {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts[0];
};

export const loginUser = createAsyncThunk(
  "loginUser",
  async (userData: { email: string; password: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-domain": getTenantDomain(),
        },
        body: JSON.stringify(userData),
      }
    );
    return response.json();
  }
);

export const registerUser = createAsyncThunk(
  "registerUser",
  async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/storefront/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-domain": getTenantDomain(),
        },
        body: JSON.stringify(userData),
      }
    );
    return response.json();
  }
);

// State interface
interface UserState {
  loading: {
    login: boolean;
    register: boolean;
  };
  error: {
    login: string | null;
    register: string | null;
  };
  userData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    token: string;
    role: "CUSTOMER";
  };
  isLoggedIn: boolean;
}

const initialState: UserState = {
  loading: {
    login: false,
    register: false,
  },
  error: {
    login: null,
    register: null,
  },
  userData: {
    id: "",
    name: "",
    email: "",
    phone: "",
    token: "",
    role: "CUSTOMER",
  },
  isLoggedIn: false,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload && action.payload.id) {
        const userData = action.payload;
        state.userData = {
          id: userData.id || state.userData.id,
          name: userData.name || state.userData.name,
          email: userData.email || state.userData.email,
          phone: userData.phone || state.userData.phone,
          token: userData.token || state.userData.token,
          role: userData.role || state.userData.role,
        };
        if (state.isLoggedIn) {
          const storageUserData = {
            id: state.userData.id,
            name: state.userData.name,
            email: state.userData.email,
            phone: state.userData.phone,
            role: state.userData.role,
          };
          setStorageItem("userData", storageUserData);
          setStorageItem("role", state.userData.role);
          if (userData.token) {
            setStorageItem("token", userData.token);
          }
        }
        console.log("User data manually updated:", state.userData);
      }
    },
    initializeAuth: (state) => {
      const token = getStorageItem("token");
      const userData = getStorageItem("userData");
      const role = getStorageItem("role");
      if (token && userData && userData.id && userData.email) {
        try {
          state.isLoggedIn = true;
          state.userData = {
            id: userData.id || "",
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            token: token,
            role: (userData.role || role || "CUSTOMER") as "CUSTOMER",
          };
          state.error.login = null;
          state.error.register = null;
          console.log("User session restored from localStorage:", {
            id: state.userData.id,
            name: state.userData.name,
            email: state.userData.email,
            role: state.userData.role,
            isLoggedIn: state.isLoggedIn,
          });
        } catch (error) {
          console.error("Error restoring user session:", error);
          clearAuthStorage();
          state.isLoggedIn = false;
        }
      } else {
        clearAuthStorage();
        state.isLoggedIn = false;
        console.log("No valid stored auth data found - user needs to login");
      }
    },
    logout: (state) => {
      state.userData = {
        id: "",
        name: "",
        email: "",
        phone: "",
        token: "",
        role: "CUSTOMER",
      };
      state.isLoggedIn = false;
      clearAuthStorage();
      console.log("User logged out, localStorage cleared");
      state.error.login = null;
      state.error.register = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading.login = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        console.log("Login RESPONSE:", action.payload);
        if (!action.payload.user || !action.payload.token) {
          state.error.login = "Invalid login response from server";
          return;
        }
        const user = action.payload.user;
        const token = action.payload.token;
        if (!user.id || !user.email || !user.name) {
          state.error.login = "Incomplete user data received from server";
          return;
        }
        const userData = {
          id: user.id || "",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "CUSTOMER",
        };
        setStorageItem("token", token);
        setStorageItem("userData", userData);
        setStorageItem("role", userData.role);
        console.log("User data stored in localStorage:", {
          ...userData,
          token: "[HIDDEN]",
        });
        state.userData = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          token: token,
          role: userData.role as "CUSTOMER",
        };
        state.isLoggedIn = true;
        state.error.login = null;
        console.log("Redux state updated successfully. User logged in:", {
          id: state.userData.id,
          name: state.userData.name,
          email: state.userData.email,
          role: state.userData.role,
          isLoggedIn: state.isLoggedIn,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.error.message || "Login failed";
        console.error("Login failed:", action.payload);
      });
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading.register = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error.register = action.error.message || "Registration failed";
        console.error("Registration failed:", action.payload);
      });
  },
});

export const { setUser, initializeAuth, logout } = userSlice.actions;
export default userSlice.reducer;
