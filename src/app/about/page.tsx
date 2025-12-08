"use client";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Users,
  Award,
  Truck,
  Shield,
  Heart,
  Star,
  Globe,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Products Sold", value: "100,000+", icon: ShoppingBag },
    { label: "Years in Business", value: "5+", icon: Award },
    { label: "Countries Served", value: "10+", icon: Globe },
  ];
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.",
      gradient: "from-rose-50 to-pink-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description:
        "Every product goes through rigorous quality checks to ensure you receive only the best.",
      gradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick and reliable delivery service to get your orders to you as soon as possible.",
      gradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our business, from products to customer service.",
      gradient: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];
  const team = [
    {
      name: "Muhammad Mujtahid",
      role: "Founder & CEO",
      description:
        "Passionate about bringing quality products to customers worldwide.",
      image: "/team/ceo.jpg",
    },
    {
      name: "Sumaita Shanin",
      role: "Head of Operations",
      description:
        "Ensures smooth operations and exceptional customer experience.",
      image: "/team/operations.jpg",
    },
    {
      name: "Abtahi Tajwar",
      role: "Technology Lead",
      description:
        "Drives innovation and technological advancement in our platform.",
      image: "/team/tech.jpg",
    },
  ];
  const milestones = [
    {
      year: "2020",
      title: "Fleeting Commerce Founded",
      description:
        "Started with a vision to revolutionize online shopping in Bangladesh.",
    },
    {
      year: "2021",
      title: "10,000 Customers",
      description:
        "Reached our first major milestone of serving 10,000 happy customers.",
    },
    {
      year: "2022",
      title: "Regional Expansion",
      description:
        "Expanded our delivery network to cover all major cities in Bangladesh.",
    },
    {
      year: "2023",
      title: "Mobile App Launch",
      description:
        "Launched our mobile application for better customer experience.",
    },
    {
      year: "2024",
      title: "International Shipping",
      description:
        "Started international shipping to serve customers globally.",
    },
    {
      year: "2025",
      title: "50,000+ Customers",
      description: "Celebrating over 50,000 satisfied customers and growing.",
    },
  ];
  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative py-24 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.p
              className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Our Story
            </motion.p>
            <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-6">
              About <span className="font-semibold">Fleeting Commerce</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-3xl mx-auto leading-relaxed font-light">
              Your trusted partner for quality products and exceptional shopping
              experience. We&apos;re committed to bringing you the best products
              at the best prices, delivered right to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-stone-600" />
                </div>
                <div className="text-3xl font-semibold text-stone-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-stone-500 font-light">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
                How It Started
              </p>
              <h2 className="text-3xl font-light text-stone-800 mb-6">
                Our <span className="font-semibold">Story</span>
              </h2>
              <p className="text-stone-500 mb-6 leading-relaxed font-light">
                Fleeting Commerce was born from a simple idea: to make quality
                products accessible to everyone. Founded in 2020, we started as
                a small team with a big dream of revolutionizing the online
                shopping experience in Bangladesh.
              </p>
              <p className="text-stone-500 mb-6 leading-relaxed font-light">
                Today, we&apos;re proud to serve over 50,000 customers across
                the country and beyond, offering a curated selection of products
                ranging from electronics and fashion to home essentials and
                more. Our commitment to quality, affordability, and customer
                satisfaction remains unwavering.
              </p>
              <p className="text-stone-500 leading-relaxed font-light">
                We believe that shopping should be convenient, enjoyable, and
                trustworthy. That&apos;s why we work tirelessly to ensure every
                interaction with Fleeting Commerce exceeds your expectations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-stone-100 to-amber-50 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-stone-600" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  Quality First
                </h3>
                <p className="text-stone-500 font-light">
                  Every product is carefully selected and quality-tested before
                  reaching our customers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              What We Believe
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Our <span className="font-semibold">Values</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto font-light">
              These core values guide everything we do and shape our commitment
              to our customers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  className={`p-6 h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${value.gradient} rounded-2xl`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${value.iconBg} rounded-xl mb-4`}
                  >
                    <value.icon className={`w-6 h-6 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-stone-500 font-light">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              Milestones
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Our <span className="font-semibold">Journey</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto font-light">
              From humble beginnings to serving thousands of customers,
              here&apos;s our story.
            </p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-stone-200"></div>
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } mb-8`}
              >
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <Card className="p-6 border-0 shadow-sm rounded-2xl bg-white">
                    <Badge className="bg-stone-100 text-stone-700 mb-3 font-medium">
                      {milestone.year}
                    </Badge>
                    <h3 className="text-lg font-semibold text-stone-800 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-stone-500 font-light">
                      {milestone.description}
                    </p>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-stone-400 rounded-full border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              The People
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Meet Our <span className="font-semibold">Team</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto font-light">
              The passionate people behind Fleeting Commerce who work tirelessly
              to serve you better.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <div className="w-24 h-24 bg-gradient-to-br from-stone-100 to-amber-50 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-12 h-12 text-stone-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-stone-600 font-medium mb-3 text-sm">
                    {member.role}
                  </p>
                  <p className="text-stone-500 font-light">
                    {member.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-800 rounded-2xl mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-light text-stone-800 mb-6">
              Our <span className="font-semibold">Mission</span>
            </h2>
            <p className="text-lg text-stone-500 max-w-4xl mx-auto leading-relaxed font-light">
              To provide an exceptional online shopping experience that connects
              people with quality products they love, while building lasting
              relationships based on trust, reliability, and outstanding
              customer service.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
