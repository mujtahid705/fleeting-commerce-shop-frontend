"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, Lock, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { clearCart } from "@/redux/slices/cartSlice";
import { createOrder } from "@/redux/slices/ordersSlice";
import { initializeAuth } from "@/redux/slices/userSlice";
import Image from "next/image";
import { toast } from "sonner";

interface DeliveryFormData {
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  note: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: cartItems,
    totalAmount,
    totalItems,
  } = useSelector((state: RootState) => state.cart);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<DeliveryFormData>({
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    note: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setIsReady(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isReady) return;

    const hasToken =
      typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

    if (!isLoggedIn && !hasToken) {
      router.push("/login");
      toast.error("Please log in to checkout");
      return;
    }

    if (cartItems.length === 0 && !hasPlacedOrder) {
      router.push("/products");
      toast.error("Your cart is empty", {
        description: "Add some items to your cart before checkout.",
      });
    }
  }, [cartItems.length, hasPlacedOrder, isLoggedIn, isReady, router]);

  const shipping = 5.99;
  const tax = totalAmount * 0.05;
  const total = totalAmount + shipping + tax;

  const handleInputChange = (field: keyof DeliveryFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean =>
    Boolean(
      formData.phone.trim() &&
        formData.address.trim() &&
        formData.city.trim() &&
        formData.state.trim() &&
        formData.zipCode.trim()
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required delivery fields");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        totalAmount: total,
        paymentMethod: "COD" as const,
        deliveryInfo: {
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
          country: formData.country.trim() || "Bangladesh",
          note: formData.note.trim() || undefined,
        },
        order_items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      await dispatch(createOrder(orderData)).unwrap();
      setHasPlacedOrder(true);
      dispatch(clearCart());
      toast.success("Order placed successfully!", {
        description: "Your cash-on-delivery order has been received.",
      });
      router.push("/order-success");
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Order placement failed", {
        description: typeof error === "string" ? error : "Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isReady || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Link href="/products">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-stone-300 text-stone-600 hover:bg-stone-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shopping
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-light text-stone-800">
                Cash on <span className="font-semibold">Delivery</span>
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Confirm your delivery address and pay when the order arrives.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white p-6 shadow-sm sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-stone-800">
                        Delivery Details
                      </h2>
                      <p className="text-sm text-stone-500">
                        We will use your logged-in account for name and email.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+880 1234 567890"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="House, road, area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Dhaka"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Division/State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="Dhaka Division"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="zipCode">Postal Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        placeholder="1000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        placeholder="Bangladesh"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="note">Delivery Note</Label>
                    <textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) =>
                        handleInputChange("note", e.target.value)
                      }
                      placeholder="Optional instructions for the delivery person"
                      className="mt-2 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-stone-800" />
                      <span>Payment method: Cash on Delivery</span>
                    </div>
                    <span className="font-semibold text-stone-800">
                      Pay ৳{total.toFixed(2)} on delivery
                    </span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-stone-800 py-6 text-white hover:bg-stone-900 sm:w-auto sm:px-8"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                        Placing Order...
                      </span>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Place COD Order
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-0 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-light text-stone-800">
                Order <span className="font-semibold">Summary</span>
              </h3>
              <div className="mb-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-3"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-stone-800">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {item.size && `Size: ${item.size}`}{" "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-xs text-stone-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-stone-800">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-stone-100 pt-4">
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Shipping</span>
                  <span>৳{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Tax</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-semibold text-stone-800">
                  <span>Total</span>
                  <span>৳{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>We may call to confirm your delivery address</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-3 w-3" />
                  <span>Pay only when your order arrives</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
