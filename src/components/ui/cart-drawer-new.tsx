"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateQuantity,
  removeFromCart,
  setCartOpen,
  type CartItem,
} from "@/redux/slices/cartSlice";
import Link from "next/link";
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useDispatch();
  const {
    items: cartItems,
    totalAmount,
    totalItems,
  } = useSelector((state: RootState) => state.cart);
  const updateItemQuantity = (
    id: string,
    size: string | undefined,
    color: string | undefined,
    newQuantity: number
  ) => {
    dispatch(updateQuantity({ id, size, color, quantity: newQuantity }));
  };
  const removeItem = (
    id: string,
    size: string | undefined,
    color: string | undefined
  ) => {
    dispatch(removeFromCart({ id, size, color }));
  };
  const shipping = 5.99;
  const total = totalAmount + (cartItems.length > 0 ? shipping : 0);
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-stone-800 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shopping Cart ({totalItems})
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
                  <h3 className="text-lg font-medium text-stone-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-stone-500 mb-6">
                    Add some products to get started
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-stone-800 hover:bg-stone-900 text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex items-center space-x-3 p-3 bg-stone-50 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm font-medium text-stone-800 hover:text-stone-600 transition-colors block truncate"
                          onClick={onClose}
                        >
                          {item.title}
                        </Link>
                        <div className="text-xs text-stone-500 space-y-1">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <p className="text-sm font-semibold text-stone-800">
                          ৳{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            removeItem(item.id, item.size, item.color)
                          }
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:border-stone-400"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center hover:border-stone-400"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 p-4 bg-stone-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span>৳{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Shipping</span>
                    <span>৳{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-stone-800 pt-2 border-t border-stone-300">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-stone-800 hover:bg-stone-900 text-white"
                    onClick={onClose}
                  >
                    Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
