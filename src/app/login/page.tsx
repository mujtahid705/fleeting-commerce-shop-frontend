"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    const data = {
      email: formData.email,
      password: formData.password,
    };
    dispatch(loginUser(data))
      .unwrap()
      .then((res) => {
        toast.success("Login successful!");
        router.push("/");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        toast.error("Login failed. Please try again.");
      });
  };
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center space-x-2 text-stone-500 hover:text-stone-700 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-8 shadow-xl max-w-md mx-auto lg:mx-0 border-0 rounded-3xl">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="text-3xl font-light text-stone-800">
                    Fleeting <span className="font-semibold">Commerce</span>
                  </div>
                </div>
                <h1 className="text-2xl font-light text-stone-800 mb-2">
                  Welcome Back
                </h1>
                <p className="text-stone-500 font-light">
                  Sign in to your account
                </p>
              </motion.div>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 rounded-xl border-stone-200 focus:ring-stone-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="h-12 pr-10"
                      required
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-stone-500 font-light"
                    >
                      Remember me
                    </Label>
                  </div>
                  <motion.a
                    href="#"
                    className="text-sm text-stone-600 hover:text-stone-800 font-medium"
                    whileHover={{ scale: 1.02 }}
                  >
                    Forgot password?
                  </motion.a>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-stone-800 hover:bg-stone-900 text-white rounded-full font-medium transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-stone-500 font-light">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">
                      <motion.span
                        className="text-stone-700 hover:text-stone-900 font-medium cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                      >
                        Sign up
                      </motion.span>
                    </Link>
                  </p>
                </motion.div>
              </motion.form>
            </Card>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-200 rounded-[2.5rem] p-8 h-[500px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100/40 rounded-full blur-2xl"></div>
              <div className="text-center space-y-6 relative z-10">
                <motion.div
                  className="w-48 h-48 mx-auto bg-white/60 rounded-[2rem] flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&h=150&fit=crop"
                    alt="Welcome Back"
                    className="w-40 h-40 object-cover rounded-[1.5rem]"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-3"
                >
                  <h2 className="text-3xl font-light text-stone-800">
                    Welcome <span className="font-semibold">Back!</span>
                  </h2>
                  <p className="text-stone-500 font-light max-w-xs mx-auto">
                    Continue your shopping journey with Fleeting Commerce
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
