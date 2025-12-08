"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowLeft,
  Download,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(() =>
    Math.random().toString(36).substr(2, 9).toUpperCase()
  );
  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-stone-800 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-stone-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>
          <Card className="p-6 mb-8 text-left rounded-2xl border border-stone-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-stone-800">
                Order Details
              </h2>
              <span className="text-sm font-mono bg-stone-100 px-3 py-1 rounded">
                #{orderNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-stone-800 mb-3">
                  Order Information
                </h3>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="font-mono">#{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>Credit Card</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-stone-800 mb-3">
                  Delivery Information
                </h3>
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span>
                      {new Date(
                        Date.now() + 5 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Method:</span>
                    <span>Standard Shipping</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tracking:</span>
                    <span className="text-emerald-600">Available Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6 mb-8 rounded-2xl border border-stone-100">
            <h3 className="text-lg font-semibold text-stone-800 mb-6">
              Order Status
            </h3>
            <div className="flex items-center justify-between">
              {[
                {
                  icon: CheckCircle,
                  label: "Order Confirmed",
                  status: "completed",
                  time: "Just now",
                },
                {
                  icon: Package,
                  label: "Processing",
                  status: "current",
                  time: "Within 24 hours",
                },
                {
                  icon: Truck,
                  label: "Shipped",
                  status: "pending",
                  time: "2-3 days",
                },
                {
                  icon: Home,
                  label: "Delivered",
                  status: "pending",
                  time: "5-7 days",
                },
              ].map(({ icon: Icon, label, status, time }, index) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      status === "completed"
                        ? "bg-emerald-500 text-white"
                        : status === "current"
                        ? "bg-stone-800 text-white"
                        : "bg-stone-200 text-stone-400"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      status === "completed" || status === "current"
                        ? "text-stone-800"
                        : "text-stone-400"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-stone-500 mt-1">{time}</span>
                  {index < 3 && (
                    <div
                      className={`absolute h-1 w-16 mt-6 ${
                        status === "completed"
                          ? "bg-emerald-500"
                          : "bg-stone-200"
                      }`}
                      style={{ left: `${index * 25 + 12.5}%`, width: "25%" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <Mail className="w-5 h-5" />
              <span className="text-sm">
                A confirmation email has been sent to your email address
              </span>
            </div>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Button
              className="w-full sm:w-auto bg-stone-800 hover:bg-stone-900"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-stone-800 mb-4">
              Need Help?
            </h3>
            <p className="text-stone-600 mb-4">
              If you have any questions about your order, please don&apos;t
              hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
              <Link href="/track-order">
                <Button variant="outline" size="sm">
                  Track Your Order
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
