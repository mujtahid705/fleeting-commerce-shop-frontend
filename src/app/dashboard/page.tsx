"use client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
export default function DashboardHome() {
  const stats = [
    { label: "Total Orders", value: 128, change: "+12%" },
    { label: "Total Users", value: 452, change: "+5%" },
    { label: "Products", value: 34, change: "+2%" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 rounded-xl border border-stone-100">
              <div className="text-sm text-stone-500">{s.label}</div>
              <div className="text-2xl font-semibold text-stone-800">
                {s.value}
              </div>
              <div className="text-xs text-emerald-600">{s.change}</div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card className="p-4 rounded-xl border border-stone-100">
        <div className="font-semibold text-stone-800 mb-2">Recent Activity</div>
        <div className="text-sm text-stone-500">No recent activity yet.</div>
      </Card>
    </div>
  );
}
