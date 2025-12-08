"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/hooks";
import { registerUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration attempt:", formData);
    const data = {
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: `+88${formData.phone}`,
    };
    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        router.push("/login");
        toast.success("Registration successful! Please login to continue.");
      })
      .catch((err) => {
        console.error("Registration failed:", err);
        toast.error("Registration failed. Please try again.");
      });
  };
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 py-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-8 shadow-xl border-0 rounded-3xl bg-white">
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
                  Create Account
                </h1>
                <p className="text-stone-500 font-light">
                  Join our community today
                </p>
              </motion.div>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-stone-600">
                      First Name*
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="h-12 rounded-xl border-stone-200 focus:ring-stone-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-stone-600">
                      Last Name*
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="h-12 rounded-xl border-stone-200 focus:ring-stone-400"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-600">
                      Email*
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="h-12 rounded-xl border-stone-200 focus:ring-stone-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-stone-600">
                      Phone Number*
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="h-12 rounded-xl border-stone-200 focus:ring-stone-400"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-stone-600">
                      Password*
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="h-12 pr-10 rounded-xl border-stone-200 focus:ring-stone-400"
                        required
                      />
                      <motion.button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-stone-600">
                      Confirm Password*
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="h-12 pr-10 rounded-xl border-stone-200 focus:ring-stone-400"
                        required
                      />
                      <motion.button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm text-stone-500 leading-relaxed font-light"
                    >
                      I agree to the{" "}
                      <motion.a
                        href="#"
                        className="text-stone-700 hover:text-stone-900 font-medium"
                        whileHover={{ scale: 1.02 }}
                      >
                        Terms of Service
                      </motion.a>{" "}
                      and{" "}
                      <motion.a
                        href="#"
                        className="text-stone-700 hover:text-stone-900 font-medium"
                        whileHover={{ scale: 1.02 }}
                      >
                        Privacy Policy
                      </motion.a>
                    </Label>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-stone-800 hover:bg-stone-900 text-white rounded-full font-medium transition-all duration-300"
                    disabled={!formData.agreeToTerms}
                  >
                    Create Account
                  </Button>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-stone-500 font-light">
                    Already have an account?{" "}
                    <Link href="/login">
                      <motion.span
                        className="text-stone-700 hover:text-stone-900 font-medium cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                      >
                        Sign in
                      </motion.span>
                    </Link>
                  </p>
                </motion.div>
              </motion.form>
            </Card>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2 sticky top-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-200 rounded-[2.5rem] p-10 h-[600px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100/40 rounded-full blur-2xl"></div>
              <div className="text-center space-y-8 relative z-10">
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
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop"
                    alt="Join Community"
                    className="w-40 h-40 object-cover rounded-[1.5rem]"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-stone-500">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">
                      Welcome
                    </span>
                  </div>
                  <h2 className="text-3xl font-light text-stone-800">
                    Join Our <span className="font-semibold">Community</span>
                  </h2>
                  <p className="text-stone-500 font-light max-w-xs mx-auto">
                    Discover exclusive deals, new arrivals, and personalized
                    recommendations
                  </p>
                </motion.div>
                <motion.div
                  className="grid grid-cols-2 gap-6 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="text-center bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl font-semibold text-stone-800">
                      10k+
                    </div>
                    <div className="text-sm text-stone-500 font-light">
                      Happy Customers
                    </div>
                  </div>
                  <div className="text-center bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl font-semibold text-stone-800">
                      5k+
                    </div>
                    <div className="text-sm text-stone-500 font-light">
                      Products
                    </div>
                  </div>
                  <div className="text-center bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl font-semibold text-stone-800">
                      24/7
                    </div>
                    <div className="text-sm text-stone-500 font-light">
                      Support
                    </div>
                  </div>
                  <div className="text-center bg-white/50 rounded-2xl p-4">
                    <div className="text-2xl font-semibold text-stone-800">
                      Fast
                    </div>
                    <div className="text-sm text-stone-500 font-light">
                      Delivery
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
