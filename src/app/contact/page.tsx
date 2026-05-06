"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Facebook,
  Globe,
  Headphones,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchTenantBrandSettings } from "@/redux/slices/tenantSlice";
import type { ContactPageCustomization } from "@/redux/slices/tenantSlice";

type FormFieldName = "name" | "email" | "subject" | "message";
type ContactInfoItems = NonNullable<
  NonNullable<ContactPageCustomization["contactInfo"]>["items"]
>;
type SupportOptionItems = NonNullable<
  NonNullable<ContactPageCustomization["supportOptions"]>["items"]
>;
type SocialLinkItems = NonNullable<
  NonNullable<ContactPageCustomization["socialLinks"]>["items"]
>;
type FaqItems = NonNullable<NonNullable<ContactPageCustomization["faq"]>["items"]>;

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
  clock: Clock,
  send: Send,
  "message-circle": MessageCircle,
  headphones: Headphones,
  globe: Globe,
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  "help-circle": HelpCircle,
};

const DEFAULT_CONTACT_INFO: ContactInfoItems = [
  {
    icon: "mail",
    title: "Email Us",
    description: "Send us an email anytime",
    details: "support@fleetingcommerce.com",
    actionUrl: "mailto:support@fleetingcommerce.com",
  },
  {
    icon: "phone",
    title: "Call Us",
    description: "Mon-Fri from 8am to 5pm",
    details: "+880 1700-000000",
    actionUrl: "tel:+8801700000000",
  },
  {
    icon: "map-pin",
    title: "Visit Us",
    description: "Come say hello at our office",
    details: "123 Commerce Street, Dhaka",
  },
  {
    icon: "clock",
    title: "Business Hours",
    description: "We are here to help",
    details: "Mon-Fri: 8AM-5PM",
  },
];

const DEFAULT_SUPPORT_OPTIONS: SupportOptionItems = [
  {
    icon: "message-circle",
    title: "Live Chat",
    description: "Chat with our support team",
    isAvailable: true,
  },
  {
    icon: "headphones",
    title: "Phone Support",
    description: "Call us for immediate help",
    isAvailable: true,
  },
  {
    icon: "mail",
    title: "Email Support",
    description: "Send us a detailed message",
    isAvailable: true,
  },
  {
    icon: "globe",
    title: "Help Center",
    description: "Browse our knowledge base",
    isAvailable: true,
  },
];

const DEFAULT_FAQS: FaqItems = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer standard delivery and express delivery in supported areas.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within the return window. Items must be in original condition with tags attached.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order using the tracking number sent to your email or by logging into your account.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Shipping availability, costs, and delivery times vary by destination.",
  },
];

const DEFAULT_FIELDS: Record<
  FormFieldName,
  {
    isEnabled: boolean;
    isRequired: boolean;
    label: string;
    placeholder: string;
  }
> = {
  name: {
    isEnabled: true,
    isRequired: true,
    label: "Full Name",
    placeholder: "Your full name",
  },
  email: {
    isEnabled: true,
    isRequired: true,
    label: "Email Address",
    placeholder: "your.email@example.com",
  },
  subject: {
    isEnabled: true,
    isRequired: true,
    label: "Subject",
    placeholder: "What is this about?",
  },
  message: {
    isEnabled: true,
    isRequired: true,
    label: "Message",
    placeholder: "Tell us more about your inquiry...",
  },
};

function getIcon(icon?: string, fallback: LucideIcon = HelpCircle) {
  return icon ? ICONS[icon] || fallback : fallback;
}

function enabled(value?: boolean) {
  return value !== false;
}

function validText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { tenant } = useAppSelector((state) => state.tenant);
  const contactPage = tenant?.brand?.contactPage;
  const pageEnabled = contactPage?.isEnabled !== false;
  const footer = tenant?.brand?.footer;
  const storeName = tenant?.name || "Store";

  const [formData, setFormData] = useState<Record<FormFieldName, string>>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroTitle = contactPage?.hero?.title || `Contact ${storeName}`;
  const heroDescription =
    contactPage?.hero?.description ||
    tenant?.brand?.description ||
    "We are here to help. Reach out to us for any questions, support, or feedback.";

  const fallbackContactInfo: ContactInfoItems = footer
    ? [
        ...(footer.email
          ? [
              {
                icon: "mail",
                title: "Email Us",
                description: "Send us an email anytime",
                details: footer.email,
                actionUrl: `mailto:${footer.email}`,
              },
            ]
          : []),
        ...(footer.phone
          ? [
              {
                icon: "phone",
                title: "Call Us",
                description: "Reach our support team",
                details: footer.phone,
                actionUrl: `tel:${footer.phone.replace(/\s+/g, "")}`,
              },
            ]
          : []),
        ...(footer.address || tenant?.address
          ? [
              {
                icon: "map-pin",
                title: "Visit Us",
                description: "Come say hello at our office",
                details: footer.address || tenant?.address || "",
              },
            ]
          : []),
      ]
    : DEFAULT_CONTACT_INFO;

  const contactInfo = (
    contactPage?.contactInfo?.items ?? fallbackContactInfo
  ).filter((info) => validText(info?.title) && validText(info?.details));
  const form = contactPage?.form;
  const formFields = {
    name: { ...DEFAULT_FIELDS.name, ...form?.fields?.name },
    email: { ...DEFAULT_FIELDS.email, ...form?.fields?.email },
    subject: { ...DEFAULT_FIELDS.subject, ...form?.fields?.subject },
    message: { ...DEFAULT_FIELDS.message, ...form?.fields?.message },
  };
  const supportOptions = (
    contactPage?.supportOptions?.items ?? DEFAULT_SUPPORT_OPTIONS
  ).filter((option) => validText(option?.title));
  const footerSocialLinks: SocialLinkItems = footer?.socialLinks
    ? Object.entries(footer.socialLinks)
        .map(([platform, url]) => ({
          platform,
          label: platform,
          url,
        }))
        .filter((social) => validText(social.url))
    : [];
  const socialItems = (
    contactPage?.socialLinks?.items ?? footerSocialLinks
  ).filter((social) => validText(social?.url) && social?.url !== "#");
  const faqs = (contactPage?.faq?.items ?? DEFAULT_FAQS).filter(
    (faq) => validText(faq?.question) && validText(faq?.answer)
  );
  const location = contactPage?.location;
  const locationAddress =
    location?.address || footer?.address || tenant?.address || "";

  const showContactInfo =
    pageEnabled &&
    enabled(contactPage?.contactInfo?.isEnabled) &&
    contactInfo.length > 0;
  const showForm = pageEnabled && enabled(form?.isEnabled);
  const showSupportOptions =
    pageEnabled &&
    enabled(contactPage?.supportOptions?.isEnabled) &&
    supportOptions.length > 0;
  const showSocialLinks =
    pageEnabled &&
    enabled(contactPage?.socialLinks?.isEnabled) &&
    socialItems.length > 0;
  const showFaq =
    pageEnabled && enabled(contactPage?.faq?.isEnabled) && faqs.length > 0;
  const showLocation =
    pageEnabled &&
    enabled(location?.isEnabled) &&
    (validText(locationAddress) ||
      validText(location?.mapEmbedUrl) ||
      validText(location?.mapImage));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
    alert(form?.successMessage || "Thank you for your message.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(fetchTenantBrandSettings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 py-24">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.p
              className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {contactPage?.hero?.eyebrow || "Get In Touch"}
            </motion.p>
            <h1 className="mb-6 text-4xl font-light text-stone-800 md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-stone-500">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {showContactInfo ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => {
                const Icon = getIcon(info?.icon, Mail);
                const card = (
                  <Card className="h-full rounded-2xl border-0 bg-gradient-to-br from-stone-50 to-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                      <Icon className="h-6 w-6 text-stone-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-stone-800">
                      {info?.title}
                    </h3>
                    {info?.description ? (
                      <p className="mb-3 text-sm font-light text-stone-500">
                        {info.description}
                      </p>
                    ) : null}
                    <p className="font-medium text-stone-700">
                      {info?.details}
                    </p>
                  </Card>
                );

                return (
                  <motion.div
                    key={`${info?.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {info?.actionUrl ? (
                      <a href={info.actionUrl} className="block h-full">
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {(showForm || showSupportOptions || showSocialLinks) && pageEnabled ? (
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {showForm ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-3xl border-0 bg-white p-8 shadow-sm">
                    <h2 className="mb-2 text-2xl font-light text-stone-800">
                      {form?.title || "Send us a Message"}
                    </h2>
                    {form?.description ? (
                      <p className="mb-8 font-light text-stone-500">
                        {form.description}
                      </p>
                    ) : null}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormInput
                          name="name"
                          type="text"
                          config={formFields.name}
                          value={formData.name}
                          onChange={handleChange}
                        />
                        <FormInput
                          name="email"
                          type="email"
                          config={formFields.email}
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <FormInput
                        name="subject"
                        type="text"
                        config={formFields.subject}
                        value={formData.subject}
                        onChange={handleChange}
                      />
                      {formFields.message.isEnabled !== false ? (
                        <div>
                          <Label htmlFor="message" className="text-stone-600">
                            {formFields.message.label}
                          </Label>
                          <textarea
                            id="message"
                            name="message"
                            required={formFields.message.isRequired}
                            value={formData.message}
                            onChange={handleChange}
                            rows={6}
                            className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-stone-400"
                            placeholder={formFields.message.placeholder}
                          />
                        </div>
                      ) : null}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-full bg-stone-800 py-6 font-medium text-white transition-all duration-300 hover:bg-stone-900"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {form?.submitButtonText || "Send Message"}
                          </>
                        )}
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              ) : null}

              {(showSupportOptions || showSocialLinks) ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  {showSupportOptions ? (
                    <div>
                      <h2 className="mb-6 text-xl font-light text-stone-800">
                        {contactPage?.supportOptions?.title ||
                          "Other Ways to Reach Us"}
                      </h2>
                      <div className="space-y-4">
                        {supportOptions.map((option, index) => {
                          const Icon = getIcon(option?.icon, Headphones);
                          const supportCard = (
                            <Card className="rounded-2xl border-0 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                              <div className="flex items-center space-x-4">
                                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100">
                                  <Icon className="h-5 w-5 text-stone-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-stone-800">
                                    {option?.title}
                                  </h3>
                                  {option?.description ? (
                                    <p className="text-sm font-light text-stone-500">
                                      {option.description}
                                    </p>
                                  ) : null}
                                </div>
                                {option?.isAvailable ? (
                                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    Available
                                  </span>
                                ) : null}
                              </div>
                            </Card>
                          );

                          return option?.actionUrl ? (
                            <a
                              key={`${option.title}-${index}`}
                              href={option.actionUrl}
                              className="block"
                            >
                              {supportCard}
                            </a>
                          ) : (
                            <div key={`${option?.title}-${index}`}>
                              {supportCard}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {showSocialLinks ? (
                    <div>
                      <h3 className="mb-4 text-lg font-light text-stone-800">
                        {contactPage?.socialLinks?.title || "Follow Us"}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {socialItems.map((social, index) => {
                          const Icon = getIcon(social?.platform, Globe);
                          return (
                            <motion.a
                              key={`${social?.platform}-${index}`}
                              href={social?.url}
                              aria-label={social?.label || social?.platform}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 transition-colors hover:bg-stone-200"
                            >
                              <Icon className="h-5 w-5 text-stone-600" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {showFaq ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow={contactPage?.faq?.eyebrow || "Common Questions"}
              title={contactPage?.faq?.title || "Frequently Asked Questions"}
              description={
                contactPage?.faq?.description ||
                "Quick answers to common questions. Contact us directly if you need more help."
              }
            />
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={`${faq?.question}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-2xl border-0 bg-gradient-to-br from-stone-50 to-white p-6 shadow-sm">
                    <h3 className="mb-3 text-lg font-medium text-stone-800">
                      {faq?.question}
                    </h3>
                    <p className="font-light text-stone-500">{faq?.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showLocation ? (
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              title={location?.title || "Find Us"}
              description={
                location?.description || "Visit our office or find us on the map."
              }
            />
            <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
              {location?.mapEmbedUrl ? (
                <iframe
                  src={location.mapEmbedUrl}
                  title={location?.title || "Store location"}
                  className="h-96 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : location?.mapImage ? (
                <div className="relative h-96">
                  <ImageWithFallback
                    src={location.mapImage}
                    alt={location?.addressLabel || "Store location"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <LocationCard
                  addressLabel={location?.addressLabel || "Our Location"}
                  address={locationAddress}
                  buttonText={location?.buttonText}
                  directionsUrl={location?.directionsUrl}
                />
              )}
            </Card>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function FormInput({
  name,
  type,
  config,
  value,
  onChange,
}: {
  name: FormFieldName;
  type: string;
  config: {
    isEnabled?: boolean;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
  };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  if (config.isEnabled === false) {
    return null;
  }

  return (
    <div>
      <Label htmlFor={name} className="text-stone-600">
        {config.label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={config.isRequired}
        value={value}
        onChange={onChange}
        className="mt-2 rounded-xl border-stone-200 focus:ring-stone-400"
        placeholder={config.placeholder}
      />
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mb-4 text-3xl font-light text-stone-800">{title}</h2>
      {description ? (
        <p className="font-light text-stone-500">{description}</p>
      ) : null}
    </motion.div>
  );
}

function LocationCard({
  addressLabel,
  address,
  buttonText,
  directionsUrl,
}: {
  addressLabel: string;
  address: string;
  buttonText?: string;
  directionsUrl?: string | null;
}) {
  const showButton = validText(buttonText) && validText(directionsUrl);

  return (
    <div className="flex h-96 items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50/50">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
          <MapPin className="h-8 w-8 text-stone-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-stone-800">
          {addressLabel}
        </h3>
        <p className="mb-6 font-light text-stone-500">{address}</p>
        {showButton ? (
          <Button
            asChild
            className="rounded-full bg-stone-800 px-8 text-white hover:bg-stone-900"
          >
            <a href={directionsUrl || "#"}>{buttonText}</a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
