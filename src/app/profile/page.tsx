"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchUserOrders,
  setSelectedOrder,
  clearSelectedOrder,
  cancelOrder,
  Order,
} from "@/redux/slices/ordersSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Eye,
  Download,
  Star,
  CreditCard,
  MapPin,
  Clock,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
export default function ProfilePage() {
  const { isLoggedIn, userData } = useSelector(
    (state: RootState) => state.user
  );
  const { orders, selectedOrder, loading, error } = useSelector(
    (state: RootState) => state.orders
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (userData.id) {
      dispatch(fetchUserOrders(userData.id));
    }
  }, [isLoggedIn, userData.id, router, dispatch]);
  const handleViewOrder = (order: Order) => {
    dispatch(setSelectedOrder(order));
  };
  const handleCloseOrderModal = () => {
    dispatch(clearSelectedOrder());
  };
  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success("Order cancelled successfully!");
        if (userData.id) {
          dispatch(fetchUserOrders(userData.id));
        }
      } catch (error) {
        console.error("Failed to cancel order:", error);
        toast.error("Failed to cancel order", {
          description: typeof error === "string" ? error : "Please try again.",
        });
      }
    }
  };
  const getStatusColor = (status: Order["status"] | undefined | null) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatStatus = (status: Order["status"] | undefined | null) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const calculateOrderTotal = (
    orderItems: Order["order_items"] | undefined | null
  ) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return 0;
    }
    try {
      return orderItems.reduce((total, item) => {
        const quantity = Number(item?.quantity) || 0;
        const unitPrice = Number(item?.unitPrice) || 0;
        return total + quantity * unitPrice;
      }, 0);
    } catch (error) {
      console.error("Error calculating order total:", error);
      return 0;
    }
  };
  const getTotalItems = (
    orderItems: Order["order_items"] | undefined | null
  ) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return 0;
    }
    try {
      return orderItems.reduce((total, item) => {
        const quantity = Number(item?.quantity) || 0;
        return total + quantity;
      }, 0);
    } catch (error) {
      console.error("Error calculating total items:", error);
      return 0;
    }
  };
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Access Denied
          </h2>
          <p className="text-stone-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-stone-200 to-amber-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-stone-700" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">
                  {userData.name}
                </h1>
                <div className="space-y-2">
                  <div className="flex items-center text-stone-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {userData.email}
                  </div>
                  <div className="flex items-center text-stone-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {userData.phone || "No phone number provided"}
                  </div>
                  <div className="flex items-center text-stone-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since August 2025
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-100 text-emerald-700 mb-2">
                  {userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)}
                </Badge>
                <div className="text-sm text-stone-500">
                  Total Orders: {orders.length}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center">
              <Package className="w-6 h-6 mr-2 text-stone-700" />
              Order History
            </h2>
            <div className="text-sm text-stone-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </div>
          </div>
          {loading.fetchOrders ? (
            <Card className="p-12 text-center rounded-2xl border border-stone-100">
              <div className="animate-spin w-8 h-8 border-4 border-stone-800 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-stone-500">Loading your orders...</p>
            </Card>
          ) : error.fetchOrders ? (
            <Card className="p-12 text-center rounded-2xl border border-stone-100">
              <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-stone-800 mb-2">
                Error loading orders
              </h3>
              <p className="text-red-500 mb-6">{error.fetchOrders}</p>
              <Button
                onClick={() => dispatch(fetchUserOrders(userData.id))}
                className="bg-stone-800 hover:bg-stone-900"
              >
                Try Again
              </Button>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center rounded-2xl border border-stone-100">
              <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-stone-800 mb-2">
                No orders yet
              </h3>
              <p className="text-stone-500 mb-6">
                Start shopping to see your orders here
              </p>
              <Button
                onClick={() => router.push("/products")}
                className="bg-stone-800 hover:bg-stone-900"
              >
                Start Shopping
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow rounded-2xl border border-stone-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-stone-800">
                            Order #{order.id}
                          </h3>
                          <Badge
                            className={getStatusColor(
                              order.status || "pending"
                            )}
                          >
                            {formatStatus(order.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-stone-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            {getTotalItems(order.order_items)}{" "}
                            {getTotalItems(order.order_items) === 1
                              ? "item"
                              : "items"}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Credit Card
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-stone-700">
                              Products:
                            </span>
                          </div>
                          <div className="flex space-x-3 overflow-x-auto">
                            {order.order_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-2 min-w-0 flex-shrink-0"
                              >
                                <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden">
                                  <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                                    <Package className="w-4 h-4 text-stone-400" />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-stone-800 truncate">
                                    {item.product.title}
                                  </p>
                                  <p className="text-xs text-stone-500">
                                    Qty: {item.quantity} × ৳{item.unitPrice}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-stone-800 mb-3">
                          ৳{calculateOrderTotal(order.order_items).toFixed(2)}
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={loading.cancelOrder}
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              {loading.cancelOrder
                                ? "Cancelling..."
                                : "Cancel Order"}
                            </Button>
                          )}
                          {order.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-100 shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-stone-800">
                  Order Details - #{selectedOrder.id}
                </h3>
                <Button
                  variant="ghost"
                  onClick={handleCloseOrderModal}
                  className="text-stone-500 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="mb-6">
                <Badge
                  className={`${getStatusColor(
                    selectedOrder.status || "pending"
                  )} text-sm px-3 py-1`}
                >
                  {formatStatus(selectedOrder.status)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-2">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-stone-500">Order ID:</span> #
                      {selectedOrder.id}
                    </div>
                    <div>
                      <span className="text-stone-500">Date:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </div>
                    <div>
                      <span className="text-stone-500">Payment Method:</span>{" "}
                      Credit Card
                    </div>
                    <div>
                      <span className="text-stone-500">Customer:</span>{" "}
                      {selectedOrder.user.name} ({selectedOrder.user.email})
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold text-stone-800 mb-4">Products</h4>
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-stone-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-stone-100">
                        <Package className="w-8 h-8 text-stone-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-stone-800">
                          {item.product.title}
                        </h5>
                        <p className="text-sm text-stone-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-stone-500">
                          Brand: {item.product.brand}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-stone-800">
                          ৳{(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-stone-500">
                          ৳{item.unitPrice.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-stone-800">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-stone-800">
                    ৳{calculateOrderTotal(selectedOrder.order_items).toFixed(2)}
                  </span>
                </div>
              </div>
              {selectedOrder.status === "pending" && (
                <div className="border-t border-stone-200 mt-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={loading.cancelOrder}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {loading.cancelOrder
                      ? "Cancelling Order..."
                      : "Cancel Order"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
