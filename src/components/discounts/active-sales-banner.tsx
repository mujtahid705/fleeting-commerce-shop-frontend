"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";

type ActiveSale = {
  id: string;
  title: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  endsAt?: string | null;
};

const getTenantDomain = () => {
  if (typeof window === "undefined") return "";
  return window.location.hostname.split(".")[0];
};

const formatSaleValue = (sale: ActiveSale) => {
  if (sale.discountType === "PERCENTAGE") return `${Math.round(sale.value)}%`;
  return `৳${Number(sale.value).toLocaleString()}`;
};

export function ActiveSalesBanner() {
  const [sale, setSale] = useState<ActiveSale | null>(null);

  useEffect(() => {
    let active = true;

    const fetchActiveSales = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
        const response = await fetch(
          `${base}/storefront/discounts/active-sales`,
          {
            cache: "no-store",
            headers: {
              "x-tenant-domain": getTenantDomain(),
            },
          }
        );
        if (!response.ok) return;

        const result = await response.json();
        const sales = (result?.data ?? result ?? []) as ActiveSale[];
        if (active) setSale(sales[0] ?? null);
      } catch {
        if (active) setSale(null);
      }
    };

    fetchActiveSales();

    return () => {
      active = false;
    };
  }, []);

  if (!sale) return null;

  const endsAt = sale.endsAt
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(new Date(sale.endsAt))
    : null;

  return (
    <div className="border-b border-red-200 bg-red-50 text-red-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Tag className="h-4 w-4 shrink-0" />
          <p className="truncate">
            <span className="font-semibold">{sale.title}</span>
            {sale.description ? `: ${sale.description}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 font-semibold">
          <span>{formatSaleValue(sale)} off</span>
          {endsAt && <span className="text-red-700">Ends {endsAt}</span>}
        </div>
      </div>
    </div>
  );
}
