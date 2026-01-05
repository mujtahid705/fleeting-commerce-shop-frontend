"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import {
  fetchAllProducts,
  fetchProductById,
  type Product,
} from "@/redux/slices/productsSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  toggleFavorite,
  selectIsInFavorites,
} from "@/redux/slices/favoritesSlice";
import type { RootState } from "@/redux/store";
import { ProductCard } from "@/components/products/product-card";
import { toast } from "sonner";
export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const {
    currentItem: product,
    currentLoading: loading,
    currentError: error,
  } = useSelector((s: RootState) => s.products);
  const { items: relatedItems, loading: relatedLoading } = useSelector(
    (s: RootState) => s.products
  );

  // Check if product is in favorites
  const isInFavorites = useSelector((state: RootState) =>
    product ? selectIsInFavorites(state, product.id) : false
  );

  // Fetch product by id via thunk
  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(String(id)));
  }, [dispatch, id]);

  // After product loads, fetch related products by category/subCategory
  useEffect(() => {
    if (!product) return;
    const cat = product.categoryId;
    const sub = product.subCategoryId;
    if (cat || sub) {
      dispatch(
        fetchAllProducts({
          category: cat ?? "",
          subCategory: sub ?? "",
        })
      );
    }
  }, [dispatch, product]);

  const stockQuantity = product?.inventory?.quantity ?? product?.stock ?? 0;

  // Handler for adding to cart
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      dispatch(
        addToCart({
          productData: {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            stock: stockQuantity,
            brand: product.brand,
            images: product.images,
            description: product.description,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
          },
          quantity,
        })
      );

      // Show success toast notification
      toast.success(`${product.title} added to cart!`, {
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart", {
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handler for toggling favorites
  const handleToggleFavorite = () => {
    if (!product) return;

    const isCurrentlyFavorite = isInFavorites;

    dispatch(
      toggleFavorite({
        productData: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          stock: stockQuantity,
          brand: product.brand,
          images: product.images,
          description: product.description,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
        },
        rating: 4.5,
      })
    );

    // Show toast notification based on action
    if (isCurrentlyFavorite) {
      toast.success(`${product.title} removed from favorites`, {
        duration: 3000,
      });
    } else {
      toast.success(`${product.title} added to favorites!`, {
        duration: 3000,
      });
    }
  };

  // Derive related products from store, filter out the current product id if present
  const relatedProducts = useMemo(() => {
    if (!product) return [] as Product[];
    const pid = String(product.id);
    return (relatedItems || []).filter((p) => String(p.id) !== pid).slice(0, 6);
  }, [product, relatedItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600">
        Loading product...
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-red-600">
        {error || "Product not found"}
      </div>
    );
  }

  const productImages: string[] = product.images.length
    ? product.images.map((im: { url?: string; imageUrl?: string } | string) => {
        if (typeof im === "string") return im;
        // Handle both 'url' and 'imageUrl' properties
        const imageUrl = im?.imageUrl || im?.url;
        return imageUrl || "/vercel.svg";
      })
    : ["/vercel.svg"];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={productImages[selectedImage]}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-stone-800"
                      : "border-stone-200"
                  }`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-stone-800 mb-2">
                {product.title}
              </h1>
              <p className="text-sm text-stone-600 mb-4">
                {product.category?.name} / {product.subCategory?.name}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-stone-800">
                  ৳ {product.price.toLocaleString()}
                </span>
                <Badge
                  className={
                    stockQuantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {stockQuantity > 0
                    ? `${stockQuantity} in stock`
                    : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <motion.button
                    className="w-10 h-10 border border-stone-300 rounded-lg flex items-center justify-center hover:border-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-16 text-center font-medium">
                    {quantity}
                  </span>
                  <motion.button
                    className="w-10 h-10 border border-stone-300 rounded-lg flex items-center justify-center hover:border-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= stockQuantity}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || stockQuantity === 0}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Adding...
                    </>
                  ) : stockQuantity === 0 ? (
                    "Out of Stock"
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-12 h-12 ${
                    isInFavorites ? "bg-red-50 border-red-200 text-red-500" : ""
                  }`}
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={`w-5 h-5 ${isInFavorites ? "fill-current" : ""}`}
                  />
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-t border-stone-200">
              {[
                { icon: Truck, text: "Free Delivery" },
                { icon: Shield, text: "Secure Payment" },
                { icon: RotateCcw, text: "Easy Return" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className="w-6 h-6 mx-auto mb-2 text-stone-700" />
                  <span className="text-sm text-stone-600">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-stone-100 rounded-xl p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                Product Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Brand</span>
                  <span>{product.brand || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Category</span>
                  <span>{product.category?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Subcategory</span>
                  <span>{product.subCategory?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Availability</span>
                  <span
                    className={
                      stockQuantity > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stockQuantity > 0
                      ? `${stockQuantity} units`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description section */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl p-6 border border-stone-100">
            <h3 className="font-semibold text-stone-800 mb-4">Description</h3>
            <p className="text-sm text-stone-700 whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </motion.section>

        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts.slice(0, 5).map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <ProductCard
                  index={index}
                  product={{
                    id: String(r.id),
                    name: r.title,
                    price: Number(r.price) || 0,
                    originalPrice: Number(r.price) || 0,
                    rating: 4.5,
                    reviews: 0,
                    image:
                      r.images?.[0]?.imageUrl ||
                      r.images?.[0]?.url ||
                      "/vercel.svg",
                  }}
                />
              </motion.div>
            ))}
            {relatedLoading && (
              <div className="col-span-full text-center text-sm text-stone-500">
                Loading related products...
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
