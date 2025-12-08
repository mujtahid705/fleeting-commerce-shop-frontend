"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchAllProducts,
  fetchProductById,
  fetchCategories,
  fetchSubcategories,
  updateProduct,
} from "@/redux/slices/productsSlice";
import { useSelector as useReduxSelector } from "react-redux";
import { toast } from "sonner";
const handleUnauthorized = (status: number, message?: string) => {
  if (status === 401 || message?.toLowerCase().includes("unauthorized")) {
    console.log("401 Unauthorized in products page:", { status, message });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      window.location.href = "/";
    }
  }
};
export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: products,
    loading,
    error,
    categories,
    categoriesLoading,
    categoriesError,
    subcategories,
    subcategoriesLoading,
    updating,
    lastFetched,
  } = useSelector((state: RootState) => state.products);
  const userToken = useReduxSelector((s: RootState) => s.user.userData.token);
  const [query, setQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    number | null
  >(null);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    images: [] as File[],
    categoryId: "",
    subCategoryId: "",
  });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  React.useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategories(selectedCategoryId));
    }
  }, [selectedCategoryId, dispatch]);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  );
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    existingImages: [] as string[],
    newImages: [] as File[],
    categoryId: "",
    subCategoryId: "",
  });
  React.useEffect(() => {
    dispatch(fetchAllProducts());

    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.title, p.slug, p.brand].some((f) => f?.toLowerCase().includes(q))
    );
  }, [products, query]);

  const openEdit = async (id: string) => {
    setIsEditOpen(true);
    setEditingProductId(id);
    setEditLoading(true);
    setEditError(null);
    try {
      const p = await dispatch(fetchProductById(id)).unwrap();
      setEditForm({
        title: p.title || "",
        description: p.description || "",
        price: String(p.price ?? ""),
        stock: String(p.stock ?? ""),
        brand: p.brand || "",
        existingImages: (p.images || []).map(
          (im: { url?: string }) => im?.url || ""
        ),
        newImages: [],
        categoryId: p.categoryId ? String(p.categoryId) : "",
        subCategoryId: p.subCategoryId ? String(p.subCategoryId) : "",
      });
      if (p.categoryId) dispatch(fetchSubcategories(p.categoryId));
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setEditError(errorMessage || "Failed to load product");
      toast.error(errorMessage || "Failed to load product");
    } finally {
      setEditLoading(false);
    }
  };
  const totalEditImages =
    editForm.existingImages.length + editForm.newImages.length;
  const canAddMoreEditImages = totalEditImages < 5;
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-lg font-semibold text-stone-800">Products</div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by title, brand or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsModalOpen(true)} className="bg-stone-800 hover:bg-stone-900">Add Product</Button>
        </div>
      </div>
      <Card className="p-0 overflow-hidden rounded-xl border border-stone-100">
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-stone-500 bg-stone-50">
          <div className="col-span-5 sm:col-span-6">Product</div>
          <div className="col-span-3 sm:col-span-2">Price</div>
          <div className="col-span-2 sm:col-span-2">Stock</div>
          <div className="col-span-2 sm:col-span-2 text-right pr-2">Action</div>
        </div>
        <div>
          {loading ? (
            <div className="p-6 text-sm text-stone-500">Loading products...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-stone-500">No products found.</div>
          ) : (
            filtered.map((p) => {
              const img = p.images?.[0]?.url || "/vercel.svg";
              return (
                <Link href={`/products/${p.id}`} key={p.id} className="block">
                  <div className="grid grid-cols-12 items-center gap-3 px-4 py-3 border-t border-stone-100 hover:bg-stone-50">
                    <div className="col-span-5 sm:col-span-6 flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg border border-stone-100 bg-white">
                        <ImageWithFallback
                          src={img}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-stone-800">
                          {p.title}
                        </div>
                        <div className="text-xs text-stone-500 truncate">
                          {p.brand} • {p.slug}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-stone-800">
                      ৳ {p.price.toLocaleString()}
                    </div>
                    <div
                      className={`col-span-2 sm:col-span-2 ${
                        p.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </div>
                    <div className="col-span-2 sm:col-span-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEdit(String(p.id));
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (
                              !confirm(
                                "Are you sure you want to delete this product?"
                              )
                            ) {
                              return;
                            }
                            try {
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/products/${p.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${userToken}`,
                                  },
                                }
                              );
                              const data = await res.json().catch(() => ({}));
                              if (!res.ok) {
                                handleUnauthorized(res.status, data?.message);
                                throw new Error(
                                  data?.message || "Failed to delete product"
                                );
                              }
                              toast.success(
                                data?.message || "Product deleted successfully"
                              );
                              dispatch(fetchAllProducts());
                            } catch (err: unknown) {
                              const errorMessage =
                                err instanceof Error
                                  ? err.message
                                  : String(err);
                              toast.error(
                                errorMessage || "Failed to delete product"
                              );
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {formError && (
              <div className="mb-3 text-sm text-red-600">{formError}</div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormError(null);
                if (!form.title.trim())
                  return setFormError("Title is required");
                if (!form.description.trim())
                  return setFormError("Description is required");
                const priceNum = Number(form.price);
                const stockNum = Number(form.stock);
                if (Number.isNaN(priceNum) || priceNum <= 0)
                  return setFormError("Price must be a positive number");
                if (!Number.isInteger(stockNum) || stockNum < 0)
                  return setFormError("Stock must be a non-negative integer");
                if (!form.categoryId)
                  return setFormError("Category is required");
                if (!userToken) return setFormError("You must be logged in");
                try {
                  setSubmitting(true);
                  const fd = new FormData();
                  fd.append("title", form.title.trim());
                  fd.append("description", form.description.trim());
                  fd.append("price", String(priceNum));
                  fd.append("stock", String(stockNum));
                  fd.append("brand", form.brand.trim());
                  fd.append("categoryId", String(form.categoryId));
                  if (form.subCategoryId)
                    fd.append("subCategoryId", String(form.subCategoryId));
                  form.images.forEach((file) => fd.append("images", file));
                  const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/products/create`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${userToken}`,
                      },
                      body: fd,
                    }
                  );
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.message || "Failed to create product");
                  }
                  toast.success("Product created successfully");
                  setIsModalOpen(false);
                  setForm({
                    title: "",
                    description: "",
                    price: "",
                    stock: "",
                    brand: "",
                    images: [],
                    categoryId: "",
                    subCategoryId: "",
                  });
                  dispatch(fetchAllProducts());
                } catch (err: unknown) {
                  const errorMessage =
                    err instanceof Error ? err.message : String(err);
                  setFormError(errorMessage || "Failed to create product");
                  toast.error(errorMessage || "Failed to create product");
                } finally {
                  setSubmitting(false);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, title: e.target.value }))
                  }
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                  <Input
                    placeholder="Stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, stock: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Brand"
                    value={form.brand}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, brand: e.target.value }))
                    }
                  />
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                    value={form.categoryId}
                    onChange={(e) => {
                      const newCategoryId = e.target.value;
                      setSelectedCategoryId(Number(newCategoryId));
                      console.log("Selected category:", newCategoryId);
                      setForm((s) => ({
                        ...s,
                        categoryId: newCategoryId,
                        subCategoryId: "",
                      }));
                      if (newCategoryId) {
                        dispatch(fetchSubcategories(newCategoryId));
                      }
                    }}
                  >
                    <option value="" disabled>
                      {categoriesLoading ? "Loading categories..." : "Category"}
                    </option>
                    {categories.length === 0 && !categoriesLoading && (
                      <option disabled>No categories available</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                  value={form.subCategoryId}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, subCategoryId: e.target.value }))
                  }
                  disabled={!form.categoryId || subcategoriesLoading}
                >
                  <option value="" disabled>
                    Subcategory
                  </option>
                  {subcategories
                    .filter((sc) => String(sc.categoryId) === form.categoryId)
                    .map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                </select>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      images: Array.from(e.target.files || []),
                    }))
                  }
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
                {categoriesLoading && (
                  <div className="text-xs text-gray-500">
                    Loading categories...
                  </div>
                )}
                {categoriesError && (
                  <div className="text-xs text-red-600">{categoriesError}</div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {editError && (
              <div className="mb-3 text-sm text-red-600">{editError}</div>
            )}
            {editLoading ? (
              <div className="p-6 text-sm text-gray-500">Loading...</div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, title: e.target.value }))
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    className="w-full min-h-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Price"
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, price: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Stock"
                      type="number"
                      value={editForm.stock}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, stock: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Brand"
                      value={editForm.brand}
                      onChange={(e) =>
                        setEditForm((s) => ({ ...s, brand: e.target.value }))
                      }
                    />
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                      value={editForm.categoryId}
                      onChange={(e) => {
                        const newCategoryId = e.target.value;
                        setEditForm((s) => ({
                          ...s,
                          categoryId: newCategoryId,
                          subCategoryId: "",
                        }));
                        if (newCategoryId) {
                          dispatch(fetchSubcategories(newCategoryId));
                        }
                      }}
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Category"}
                      </option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                    value={editForm.subCategoryId}
                    onChange={(e) =>
                      setEditForm((s) => ({
                        ...s,
                        subCategoryId: e.target.value,
                      }))
                    }
                    disabled={!editForm.categoryId || subcategoriesLoading}
                  >
                    <option value="">Subcategory</option>
                    {subcategories
                      .filter(
                        (sc) => String(sc.categoryId) === editForm.categoryId
                      )
                      .map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name}
                        </option>
                      ))}
                  </select>
                  <div>
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Current Images ({editForm.existingImages.length})
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {editForm.existingImages.map((url, idx) => (
                        <div
                          key={`${url}-${idx}`}
                          className="relative w-20 h-20 rounded-md overflow-hidden border bg-white"
                        >
                          <ImageWithFallback
                            src={url || "/vercel.svg"}
                            alt={`Image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm((s) => ({
                                ...s,
                                existingImages: s.existingImages.filter(
                                  (u, i) => i !== idx
                                ),
                              }))
                            }
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Add Images (max 5)
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={!canAddMoreEditImages}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const remaining = 5 - totalEditImages;
                        const toAdd = files.slice(0, Math.max(0, remaining));
                        setEditForm((s) => ({
                          ...s,
                          newImages: [...s.newImages, ...toAdd],
                        }));
                        e.currentTarget.value = "";
                      }}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 disabled:opacity-60"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {totalEditImages} / 5 selected
                    </div>
                    {editForm.newImages.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {editForm.newImages.map((file, idx) => (
                          <div
                            key={`${file.name}-${idx}`}
                            className="relative w-20 h-20 rounded-md overflow-hidden border bg-white"
                          >
                            <ImageWithFallback
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setEditForm((s) => ({
                                  ...s,
                                  newImages: s.newImages.filter(
                                    (_, i) => i !== idx
                                  ),
                                }))
                              }
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center"
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updating}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!editingProductId) return;
                      try {
                        await dispatch(
                          updateProduct({
                            id: editingProductId,
                            token: userToken,
                            data: {
                              title: editForm.title.trim(),
                              description: editForm.description.trim(),
                              price: Number(editForm.price) || 0,
                              stock: Number(editForm.stock) || 0,
                              brand: editForm.brand.trim(),
                              categoryId: editForm.categoryId || undefined,
                              subCategoryId:
                                editForm.subCategoryId || undefined,
                              existingImages: editForm.existingImages,
                              newImages: editForm.newImages,
                            },
                          })
                        ).unwrap();
                        toast.success("Product updated");
                        setIsEditOpen(false);
                        dispatch(fetchAllProducts());
                      } catch (err: unknown) {
                        const errorMessage =
                          err instanceof Error ? err.message : String(err);
                        toast.error(errorMessage || "Failed to update");
                      }
                    }}
                  >
                    {updating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
