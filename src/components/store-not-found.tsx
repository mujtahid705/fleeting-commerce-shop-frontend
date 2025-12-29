"use client";

import { motion } from "framer-motion";
import { Store, AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreNotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-200">
            <Store className="w-12 h-12 text-slate-500" />
          </div>
        </motion.div>

        {/* Error Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6"
        >
          <AlertCircle className="w-4 h-4" />
          404 - Store Not Found
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
        >
          This store doesn&apos;t exist
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-600 text-lg mb-8 leading-relaxed"
        >
          The store you&apos;re looking for could not be found. Please check the
          URL or contact support if you believe this is an error.
        </motion.p>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
        >
          <h3 className="font-semibold text-slate-700 mb-3">
            Looking for a store?
          </h3>
          <p className="text-slate-500 text-sm">
            Make sure you&apos;re using the correct store URL format:
          </p>
          <div className="mt-3 space-y-2">
            <code className="block bg-slate-50 px-4 py-2 rounded-lg text-sm text-slate-600">
              storename.fleetingcommerce.com
            </code>
            <code className="block bg-slate-50 px-4 py-2 rounded-lg text-sm text-slate-600">
              storename.localhost:3000
            </code>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() =>
              (window.location.href = "https://fleetingcommerce.com")
            }
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700"
          >
            <Home className="w-4 h-4" />
            Visit Fleeting Commerce
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-slate-400 text-sm"
        >
          Powered by{" "}
          <a
            href="https://fleetingcommerce.com"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            Fleeting Commerce
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
