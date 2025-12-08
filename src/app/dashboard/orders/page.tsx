"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Search,
  Filter,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  X,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
const handleUnauthorized = (status: number, message?: string) => {
  if (status === 401 || message?.toLowerCase().includes("unauthorized")) {
    console.log("401 Unauthorized in orders page:", { status, message });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userData");
      window.location.href = "/";
    }
  }
};
enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
type OrderItem = {
  id: number;
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
    brand: string;
    images?: { url: string }[];
  };
};
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
type Order = {
  id: number;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  order_items: OrderItem[];
  user: User;
};
export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [newStatus, setNewStatus] = React.useState<OrderStatus>(
    OrderStatus.PENDING
  );
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const parsedToken = JSON.parse(token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        handleUnauthorized(response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const parsedToken = JSON.parse(token);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orders/update/status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${parsedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        handleUnauthorized(response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
      toast.success("Order status updated successfully");
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update order status";
      toast.error(errorMessage);
    } finally {
      setUpdatingStatus(false);
    }
  };
  React.useEffect(() => {
    fetchOrders();
  }, []);
  const filteredOrders = orders.filter((order) => {
    const matchesQuery =
      !query ||
      order.id.toString().includes(query) ||
      order.user.name.toLowerCase().includes(query.toLowerCase()) ||
      order.user.email.toLowerCase().includes(query.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      [OrderStatus.PENDING]: {
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      [OrderStatus.PROCESSING]: {
        className: "bg-blue-100 text-blue-800",
        icon: Package,
      },
      [OrderStatus.SHIPPED]: {
        className: "bg-purple-100 text-purple-800",
        icon: Truck,
      },
      [OrderStatus.DELIVERED]: {
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      [OrderStatus.CANCELLED]: {
        className: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    const variant = variants[status];
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getTotalItems = (orderItems: OrderItem[]) => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Orders Management
          </h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"}
          </Badge>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchOrders} className="mt-2" size="sm">
            Retry
          </Button>
        </Card>
      )}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getTotalItems(order.order_items)} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setIsStatusModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Status
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {query || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No orders have been placed yet"}
              </p>
            </div>
          )}
        </div>
      </Card>
      <AnimatePresence>
        {isDetailModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
            onClick={() => setIsDetailModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details #{selectedOrder.id}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium">
                        {formatDate(selectedOrder.updatedAt)}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {selectedOrder.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedOrder.user.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {selectedOrder.user.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium capitalize">
                        {selectedOrder.user.role}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items ({getTotalItems(selectedOrder.order_items)} items)
                </h3>
                <div className="space-y-4">
                  {selectedOrder.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-medium text-gray-900 hover:text-cyan-700 cursor-pointer transition-colors duration-200"
                          onClick={() => setIsDetailModalOpen(false)}
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          Brand: {item.product.brand}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Quantity:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Unit Price:{" "}
                            <span className="font-medium">
                              {formatCurrency(item.unitPrice)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Subtotal:{" "}
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isStatusModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
            onClick={() => setIsStatusModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Update Order Status</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsStatusModalOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-status">
                    Order #{selectedOrder.id}
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Current status: {getStatusBadge(selectedOrder.status)}
                  </p>
                </div>
                <div>
                  <Label htmlFor="new-status">New Status</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) =>
                      setNewStatus(value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrderStatus.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={OrderStatus.PROCESSING}>
                        Processing
                      </SelectItem>
                      <SelectItem value={OrderStatus.SHIPPED}>
                        Shipped
                      </SelectItem>
                      <SelectItem value={OrderStatus.DELIVERED}>
                        Delivered
                      </SelectItem>
                      <SelectItem value={OrderStatus.CANCELLED}>
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsStatusModalOpen(false)}
                    disabled={updatingStatus}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, newStatus)
                    }
                    disabled={
                      updatingStatus || newStatus === selectedOrder.status
                    }
                  >
                    {updatingStatus ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
