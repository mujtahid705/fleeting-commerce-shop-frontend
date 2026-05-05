"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DropdownMenuContext = React.createContext<{ close: () => void } | null>(
  null
);

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}
export function DropdownMenu({
  children,
  trigger,
  align = "end",
  side = "bottom",
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0",
  };
  const sideClasses = {
    top: "bottom-full mb-1",
    bottom: "top-full mt-1",
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen((current) => !current)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: side === "bottom" ? -10 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: side === "bottom" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 min-w-32 bg-white rounded-md border border-gray-200 shadow-lg overflow-hidden",
              alignmentClasses[align],
              sideClasses[side]
            )}
          >
            <DropdownMenuContext.Provider
              value={{ close: () => setOpen(false) }}
            >
              {children}
            </DropdownMenuContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
export function DropdownMenuItem({
  children,
  onClick,
  className,
  disabled = false,
}: DropdownMenuItemProps) {
  const menu = React.useContext(DropdownMenuContext);

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    menu?.close();
  };

  return (
    <motion.div
      whileHover={!disabled ? { backgroundColor: "#f3f4f6" } : {}}
      onClick={handleClick}
      className={cn(
        "px-4 py-2 text-sm cursor-pointer transition-colors",
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:text-gray-900",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
export function DropdownMenuSeparator() {
  return <div className="h-px bg-gray-200 my-1" />;
}
