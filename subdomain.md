# Storefront Public API Documentation

This endpoint provides all necessary tenant information for initializing a storefront. It returns tenant details, brand settings, theme configuration, and categories - everything the frontend needs to render the store.

---

## Get Tenant Details by Domain

**This is the main endpoint for storefront initialization.** The frontend should call this endpoint on page load to determine which store to display, what theme to apply, and whose products to show.

**Endpoint:** `GET /api/tenants/storefront?domain=<domain>`

**Authentication:** Not required (Public)

---

### Request

**Query Parameters:**

| Parameter | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| `domain`  | String | Yes      | The tenant's domain (e.g., "mystore.com") |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/tenants/storefront?domain=mystore.com"
```

---

### Response

**Success Response (200 OK):**

```json
{
  "message": "Tenant details retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Awesome Store",
    "domain": "mystore.com",
    "address": "123 Commerce Street, City",
    "brand": {
      "logoUrl": "/uploads/brands/abc123-uuid.png",
      "tagline": "Your trusted commerce partner",
      "description": "We provide the best e-commerce solutions for your business.",
      "theme": 2
    },
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "subCategories": [
          { "id": 1, "name": "Phones" },
          { "id": 2, "name": "Laptops" }
        ]
      },
      {
        "id": 2,
        "name": "Clothing",
        "subCategories": [
          { "id": 3, "name": "Men" },
          { "id": 4, "name": "Women" }
        ]
      }
    ]
  }
}
```

**Response (No brand configured):**

```json
{
  "message": "Tenant details retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Store",
    "domain": "mystore.com",
    "address": null,
    "brand": {
      "logoUrl": null,
      "tagline": null,
      "description": null,
      "theme": 1
    },
    "categories": []
  }
}
```

---

### Error Responses

**Tenant Not Found (404):**

```json
{
  "message": "Tenant not found for this domain",
  "error": "Not Found",
  "statusCode": 404
}
```

**Store Inactive (404):**

```json
{
  "message": "This store is currently unavailable",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Response Fields

| Field                        | Type    | Description                              |
| ---------------------------- | ------- | ---------------------------------------- |
| `id`                         | UUID    | Tenant ID (use for subsequent API calls) |
| `name`                       | String  | Store/Tenant name                        |
| `domain`                     | String  | Store domain                             |
| `address`                    | String  | Store physical address (nullable)        |
| `brand.logoUrl`              | String  | URL path to the store logo (nullable)    |
| `brand.tagline`              | String  | Store tagline/slogan (nullable)          |
| `brand.description`          | String  | Store description (nullable)             |
| `brand.theme`                | Integer | Theme ID (1-100, default: 1)             |
| `categories`                 | Array   | List of active product categories        |
| `categories[].id`            | Integer | Category ID                              |
| `categories[].name`          | String  | Category name                            |
| `categories[].subCategories` | Array   | List of subcategories                    |

---

## Theme System

The `theme` field is an integer that the frontend should interpret to apply the appropriate styling:

| Theme ID | Description                              |
| -------- | ---------------------------------------- |
| 1        | Default theme                            |
| 2-100    | Custom themes (frontend defines styling) |

The backend only stores the theme ID. The frontend is responsible for:

- Mapping theme IDs to actual CSS/styling
- Applying the correct color schemes, layouts, etc.

---

## Frontend Implementation

### Basic Initialization

```javascript
// Call on storefront page load
async function initializeStorefront() {
  const domain = window.location.hostname; // e.g., "mystore.com"

  try {
    const response = await fetch(`/api/tenants/storefront?domain=${domain}`);

    if (!response.ok) {
      throw new Error("Store not found");
    }

    const { data } = await response.json();

    // Store tenant ID for subsequent API calls (products, orders, etc.)
    localStorage.setItem("tenantId", data.id);

    return data;
  } catch (error) {
    // Handle error - show 404 page or redirect
    console.error("Failed to initialize storefront:", error);
    window.location.href = "/store-not-found";
  }
}
```

### Applying Theme

```javascript
function applyTheme(brand) {
  // Apply CSS class based on theme
  document.body.className = ""; // Clear existing themes
  document.body.classList.add(`theme-${brand.theme}`);

  // Or load theme-specific stylesheet
  const themeLink = document.createElement("link");
  themeLink.rel = "stylesheet";
  themeLink.href = `/themes/theme-${brand.theme}.css`;
  document.head.appendChild(themeLink);
}
```

### Setting Logo and Branding

```javascript
function applyBranding(brand, storeName) {
  // Set logo
  const logoElement = document.querySelector(".store-logo img");
  if (brand.logoUrl) {
    logoElement.src = brand.logoUrl;
    logoElement.alt = storeName;
  } else {
    // Use text fallback or default logo
    logoElement.parentElement.innerHTML = `<span class="store-name">${storeName}</span>`;
  }

  // Set tagline
  const taglineElement = document.querySelector(".store-tagline");
  if (brand.tagline && taglineElement) {
    taglineElement.textContent = brand.tagline;
  }

  // Set page title
  document.title = brand.tagline
    ? `${storeName} - ${brand.tagline}`
    : storeName;
}
```

### Building Navigation

```javascript
function buildNavigation(categories) {
  const nav = document.querySelector(".category-nav");

  nav.innerHTML = categories
    .map(
      (category) => `
    <div class="nav-item dropdown">
      <a href="/category/${category.id}">${category.name}</a>
      ${
        category.subCategories.length > 0
          ? `
        <div class="dropdown-menu">
          ${category.subCategories
            .map(
              (sub) => `
            <a href="/category/${category.id}/subcategory/${sub.id}">${sub.name}</a>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}
```

### Complete Example

```javascript
// main.js - Run on page load
document.addEventListener("DOMContentLoaded", async () => {
  const storeData = await initializeStorefront();

  if (storeData) {
    applyTheme(storeData.brand);
    applyBranding(storeData.brand, storeData.name);
    buildNavigation(storeData.categories);

    // Now fetch and display products
    loadProducts(storeData.id);
  }
});

async function loadProducts(tenantId) {
  // Use the tenantId for product API calls
  const response = await fetch(`/api/products/public?tenantId=${tenantId}`);
  const products = await response.json();
  // Render products...
}
```

---

## React/Next.js Example

```jsx
// hooks/useStorefront.js
import { useState, useEffect } from "react";

export function useStorefront() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStore() {
      try {
        const domain = window.location.hostname;
        const res = await fetch(`/api/tenants/storefront?domain=${domain}`);

        if (!res.ok) throw new Error("Store not found");

        const { data } = await res.json();
        setStore(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, []);

  return { store, loading, error };
}

// components/StoreProvider.jsx
import { createContext, useContext } from "react";
import { useStorefront } from "../hooks/useStorefront";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const { store, loading, error } = useStorefront();

  if (loading) return <LoadingSpinner />;
  if (error) return <StoreNotFound />;

  return (
    <StoreContext.Provider value={store}>
      <div className={`theme-${store.brand.theme}`}>{children}</div>
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

// components/Header.jsx
import { useStore } from "./StoreProvider";

export function Header() {
  const store = useStore();

  return (
    <header>
      {store.brand.logoUrl ? (
        <img src={store.brand.logoUrl} alt={store.name} />
      ) : (
        <h1>{store.name}</h1>
      )}
      {store.brand.tagline && <p>{store.brand.tagline}</p>}
    </header>
  );
}
```

---

## Caching Recommendations

For optimal performance, consider caching this endpoint response:

1. **Browser Cache**: Cache for 5-10 minutes
2. **CDN Cache**: Cache at edge for faster global access
3. **Service Worker**: Cache for offline support

```javascript
// Service Worker caching example
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/tenants/storefront")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open("storefront-cache").then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        });
        return cached || fetched;
      })
    );
  }
});
```

---

## Related Endpoints

After initializing the storefront, you'll typically need these endpoints:

| Endpoint                           | Description                 |
| ---------------------------------- | --------------------------- |
| `GET /api/products/all`            | Get products for the tenant |
| `GET /api/categories/all`          | Get detailed category info  |
| `POST /api/orders/create`          | Create customer orders      |
| `POST /api/auth/register/customer` | Customer registration       |
| `POST /api/auth/login`             | Customer login              |
