"use client";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
    alert("Thank you for your message! We'll get back to you soon.");
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      details: "support@fleetingcommerce.com",
      action: "mailto:support@fleetingcommerce.com",
      gradient: "from-rose-50 to-pink-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 5pm",
      details: "+880 1700-000000",
      action: "tel:+8801700000000",
      gradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      details: "123 Commerce Street, Dhaka",
      action: "#",
      gradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "We're here to help",
      details: "Mon-Fri: 8AM-5PM",
      action: "#",
      gradient: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      available: true,
    },
    {
      icon: Headphones,
      title: "Phone Support",
      description: "Call us for immediate help",
      available: true,
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      available: true,
    },
    {
      icon: Globe,
      title: "Help Center",
      description: "Browse our knowledge base",
      available: true,
    },
  ];
  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Twitter, name: "Twitter", url: "#" },
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" },
  ];
  const faqs = [
    {
      question: "What are your shipping options?",
      answer:
        "We offer standard delivery (3-5 business days) and express delivery (1-2 business days) across Bangladesh.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 7 days of delivery. Items must be in original condition with tags attached.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order using the tracking number sent to your email or by logging into your account.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to selected countries. Shipping costs and delivery times vary by destination.",
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
              Get In Touch
            </motion.p>
            <h1 className="text-4xl md:text-6xl font-light text-stone-800 mb-6">
              Contact <span className="font-semibold">Us</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-3xl mx-auto leading-relaxed font-light">
              We&apos;re here to help! Reach out to us for any questions,
              support, or feedback. Our team is ready to assist you with your
              shopping experience.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 text-center border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full bg-gradient-to-br ${info.gradient} rounded-2xl`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${info.iconBg} rounded-xl mb-4`}>
                    <info.icon className={`w-6 h-6 ${info.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-stone-500 mb-3 text-sm font-light">
                    {info.description}
                  </p>
                  <p className="text-stone-700 font-medium">{info.details}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-0 shadow-sm rounded-3xl bg-white">
                <h2 className="text-2xl font-light text-stone-800 mb-2">
                  Send us a <span className="font-semibold">Message</span>
                </h2>
                <p className="text-stone-500 font-light mb-8">
                  Fill out the form and we&apos;ll get back to you shortly
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-stone-600">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-2 rounded-xl border-stone-200 focus:ring-stone-400"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-stone-600">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 rounded-xl border-stone-200 focus:ring-stone-400"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-stone-600">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-2 rounded-xl border-stone-200 focus:ring-stone-400"
                      placeholder="What is this about?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-stone-600">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="mt-2 w-full px-4 py-3 border border-stone-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent text-stone-800"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-800 hover:bg-stone-900 text-white rounded-full py-6 font-medium transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-light text-stone-800 mb-6">
                  Other Ways to <span className="font-semibold">Reach Us</span>
                </h2>
                <div className="space-y-4">
                  {supportOptions.map((option) => (
                    <Card
                      key={option.title}
                      className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-stone-100 rounded-xl">
                          <option.icon className="w-5 h-5 text-stone-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-stone-800">
                            {option.title}
                          </h3>
                          <p className="text-stone-500 text-sm font-light">
                            {option.description}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            Available
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-light text-stone-800 mb-4">
                  Follow <span className="font-semibold">Us</span>
                </h3>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-stone-600" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-3">
              Common Questions
            </p>
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Frequently Asked <span className="font-semibold">Questions</span>
            </h2>
            <p className="text-stone-500 font-light">
              Quick answers to common questions. Can&apos;t find what
              you&apos;re looking for? Contact us directly.
            </p>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-0 shadow-sm rounded-2xl bg-gradient-to-br from-stone-50 to-white">
                  <h3 className="text-lg font-medium text-stone-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-stone-500 font-light">{faq.answer}</p>
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
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-light text-stone-800 mb-4">
              Find <span className="font-semibold">Us</span>
            </h2>
            <p className="text-stone-500 font-light">
              Visit our office or find us on the map
            </p>
          </motion.div>
          <Card className="overflow-hidden border-0 shadow-sm rounded-3xl">
            <div className="bg-gradient-to-br from-stone-100 to-amber-50/50 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-stone-500" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  Our Location
                </h3>
                <p className="text-stone-500 font-light mb-6">
                  123 Commerce Street, Dhaka, Bangladesh
                </p>
                <Button className="bg-stone-800 hover:bg-stone-900 text-white rounded-full px-8">
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
