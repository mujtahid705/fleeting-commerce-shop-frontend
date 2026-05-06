"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Globe,
  Heart,
  Leaf,
  MapPin,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchTenantBrandSettings } from "@/redux/slices/tenantSlice";
import type {
  AboutPageMilestones,
  AboutPageStatItem,
  AboutPageTeam,
  AboutPageValues,
} from "@/redux/slices/tenantSlice";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  "shopping-bag": ShoppingBag,
  award: Award,
  truck: Truck,
  shield: Shield,
  heart: Heart,
  star: Star,
  globe: Globe,
  target: Target,
  "map-pin": MapPin,
  sparkles: Sparkles,
  leaf: Leaf,
};

const DEFAULT_STATS: AboutPageStatItem[] = [
  { label: "Happy Customers", value: "50,000+", icon: "users" },
  { label: "Products Sold", value: "100,000+", icon: "shopping-bag" },
  { label: "Years in Business", value: "5+", icon: "award" },
  { label: "Countries Served", value: "10+", icon: "globe" },
];

const DEFAULT_VALUES: NonNullable<AboutPageValues["items"]> = [
  {
    icon: "heart",
    title: "Customer First",
    description:
      "We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.",
  },
  {
    icon: "shield",
    title: "Quality Assured",
    description:
      "Every product goes through rigorous quality checks to ensure you receive only the best.",
  },
  {
    icon: "truck",
    title: "Fast Delivery",
    description:
      "Quick and reliable delivery service to get your orders to you as soon as possible.",
  },
  {
    icon: "star",
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of our business, from products to customer service.",
  },
];

const DEFAULT_TEAM: NonNullable<AboutPageTeam["members"]> = [
  {
    name: "Muhammad Mujtahid",
    role: "Founder & CEO",
    description:
      "Passionate about bringing quality products to customers worldwide.",
  },
  {
    name: "Sumaita Shanin",
    role: "Head of Operations",
    description: "Ensures smooth operations and exceptional customer experience.",
  },
  {
    name: "Abtahi Tajwar",
    role: "Technology Lead",
    description:
      "Drives innovation and technological advancement in our platform.",
  },
];

const DEFAULT_MILESTONES: NonNullable<AboutPageMilestones["items"]> = [
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
    description: "Started international shipping to serve customers globally.",
  },
  {
    year: "2025",
    title: "50,000+ Customers",
    description: "Celebrating over 50,000 satisfied customers and growing.",
  },
];

function getIcon(icon?: string, fallback: LucideIcon = Star) {
  return icon ? ICONS[icon] || fallback : fallback;
}

function enabled(value?: boolean) {
  return value !== false;
}

function validText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function renderTitle(title: string, highlightText?: string) {
  if (!highlightText || !title.includes(highlightText)) {
    return title;
  }

  const [before, after] = title.split(highlightText);
  return (
    <>
      {before}
      <span className="font-semibold">{highlightText}</span>
      {after}
    </>
  );
}

export default function AboutPage() {
  const dispatch = useAppDispatch();
  const { tenant } = useAppSelector((state) => state.tenant);
  const aboutPage = tenant?.brand?.aboutPage;
  const hasDynamicAbout = Boolean(aboutPage);
  const pageEnabled = aboutPage?.isEnabled !== false;
  const storeName = tenant?.name || "Store";
  const hero = aboutPage?.hero;

  const heroTitle = hero?.title || `About ${storeName}`;
  const heroDescription =
    hero?.description ||
    tenant?.brand?.description ||
    "Your trusted partner for quality products and exceptional shopping experience. We are committed to bringing you the best products at the best prices.";

  const statsSource = aboutPage?.stats?.items ?? DEFAULT_STATS;
  const stats = statsSource.filter(
    (stat) => validText(stat.label) && validText(stat.value)
  );

  const story = aboutPage?.story;
  const storyParagraphs =
    story?.paragraphs?.filter(validText) ??
    [
      "Fleeting Commerce was born from a simple idea: to make quality products accessible to everyone.",
      "Today, we are proud to serve customers across the country and beyond, offering a curated selection of products across everyday needs.",
      "We believe that shopping should be convenient, enjoyable, and trustworthy.",
    ];

  const valueItems = (aboutPage?.values?.items ?? DEFAULT_VALUES).filter(
    (item) => validText(item.title) && validText(item.description)
  );
  const milestoneItems = (
    aboutPage?.milestones?.items ?? DEFAULT_MILESTONES
  ).filter(
    (item) =>
      validText(item.year) && validText(item.title) && validText(item.description)
  );
  const teamMembers = (aboutPage?.team?.members ?? DEFAULT_TEAM).filter(
    (member) => validText(member.name) && validText(member.role)
  );

  const showStats =
    pageEnabled && enabled(aboutPage?.stats?.isEnabled) && stats.length > 0;
  const showStory =
    pageEnabled &&
    enabled(story?.isEnabled) &&
    (storyParagraphs.length > 0 || story?.image);
  const showValues =
    pageEnabled &&
    enabled(aboutPage?.values?.isEnabled) &&
    valueItems.length > 0;
  const showMilestones =
    pageEnabled &&
    enabled(aboutPage?.milestones?.isEnabled) &&
    milestoneItems.length > 0;
  const showTeam =
    pageEnabled &&
    enabled(aboutPage?.team?.isEnabled) &&
    teamMembers.length > 0 &&
    (!hasDynamicAbout || Boolean(aboutPage?.team));
  const showMission =
    pageEnabled &&
    enabled(aboutPage?.mission?.isEnabled) &&
    validText(
      aboutPage?.mission?.description ||
        "To provide an exceptional online shopping experience."
    );

  useEffect(() => {
    dispatch(fetchTenantBrandSettings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 py-24">
        {hero?.backgroundImage ? (
          <>
            <ImageWithFallback
              src={hero.backgroundImage}
              alt={heroTitle}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/80" />
          </>
        ) : (
          <>
            <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
            <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
          </>
        )}
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
              {hero?.eyebrow || "Our Story"}
            </motion.p>
            <h1 className="mb-6 text-4xl font-light text-stone-800 md:text-6xl">
              {renderTitle(heroTitle, hero?.highlightText || storeName)}
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-light leading-relaxed text-stone-500">
              {heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {showStats ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = getIcon(stat.icon, Users);
                return (
                  <motion.div
                    key={`${stat.label}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
                      <Icon className="h-8 w-8 text-stone-600" />
                    </div>
                    <div className="mb-2 text-3xl font-semibold text-stone-800">
                      {stat.value}
                    </div>
                    <div className="font-light text-stone-500">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {showStory ? (
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                  {story?.eyebrow || "How It Started"}
                </p>
                <h2 className="mb-6 text-3xl font-light text-stone-800">
                  {story?.title || "Our Story"}
                </h2>
                {storyParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-6 font-light leading-relaxed text-stone-500 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {story?.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm">
                    <ImageWithFallback
                      src={story.image}
                      alt={story?.title || "About story"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-3xl bg-gradient-to-br from-stone-100 to-amber-50 p-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                      {(() => {
                        const Icon = getIcon(
                          story?.featuredCard?.icon,
                          ShoppingBag
                        );
                        return <Icon className="h-10 w-10 text-stone-600" />;
                      })()}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-stone-800">
                      {story?.featuredCard?.title || "Quality First"}
                    </h3>
                    <p className="font-light text-stone-500">
                      {story?.featuredCard?.description ||
                        "Every product is carefully selected before reaching our customers."}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      ) : null}

      {showValues ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow={aboutPage?.values?.eyebrow || "What We Believe"}
              title={aboutPage?.values?.title || "Our Values"}
              description={
                aboutPage?.values?.description ||
                "These core values guide everything we do and shape our commitment to our customers."
              }
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {valueItems.map((value, index) => {
                const Icon = getIcon(value.icon, Heart);
                return (
                  <motion.div
                    key={`${value.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full rounded-2xl border-0 bg-gradient-to-br from-stone-50 to-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100">
                        <Icon className="h-6 w-6 text-stone-600" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-stone-800">
                        {value.title}
                      </h3>
                      <p className="font-light text-stone-500">
                        {value.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {showMilestones ? (
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow={aboutPage?.milestones?.eyebrow || "Milestones"}
              title={aboutPage?.milestones?.title || "Our Journey"}
              description={
                aboutPage?.milestones?.description ||
                "From humble beginnings to serving thousands of customers, here is our story."
              }
            />
            <div className="relative">
              <div className="absolute left-4 h-full w-0.5 bg-stone-200 md:left-1/2 md:-translate-x-px" />
              {milestoneItems.map((milestone, index) => (
                <motion.div
                  key={`${milestone.year}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative mb-8 flex items-center pl-12 md:pl-0 ${
                    index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:text-left"
                    }`}
                  >
                    <Card className="rounded-2xl border-0 bg-white p-6 shadow-sm">
                      <Badge className="mb-3 bg-stone-100 font-medium text-stone-700">
                        {milestone.year}
                      </Badge>
                      <h3 className="mb-2 text-lg font-semibold text-stone-800">
                        {milestone.title}
                      </h3>
                      <p className="font-light text-stone-500">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                  <div className="absolute left-4 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-stone-400 md:left-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showTeam ? (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow={aboutPage?.team?.eyebrow || "The People"}
              title={aboutPage?.team?.title || "Meet Our Team"}
              description={
                aboutPage?.team?.description ||
                "The passionate people behind the store who work tirelessly to serve you better."
              }
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="rounded-2xl border-0 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg">
                    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-stone-100 to-amber-50">
                      {member.image ? (
                        <ImageWithFallback
                          src={member.image}
                          alt={member.name || "Team member"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Users className="h-12 w-12 text-stone-500" />
                      )}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-stone-800">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-stone-600">
                      {member.role}
                    </p>
                    {member.description ? (
                      <p className="font-light text-stone-500">
                        {member.description}
                      </p>
                    ) : null}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showMission ? (
        <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50/50 to-stone-100 py-24">
          <div className="absolute right-20 top-10 h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl" />
          <div className="absolute bottom-10 left-10 h-80 w-80 rounded-full bg-purple-100/20 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800">
                {(() => {
                  const Icon = getIcon(aboutPage?.mission?.icon, Target);
                  return <Icon className="h-8 w-8 text-white" />;
                })()}
              </div>
              <h2 className="mb-6 text-3xl font-light text-stone-800">
                {aboutPage?.mission?.title || "Our Mission"}
              </h2>
              <p className="mx-auto max-w-4xl text-lg font-light leading-relaxed text-stone-500">
                {aboutPage?.mission?.description ||
                  "To provide an exceptional online shopping experience that connects people with quality products they love."}
              </p>
            </motion.div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-16 text-center"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mb-4 text-3xl font-light text-stone-800">{title}</h2>
      {description ? (
        <p className="mx-auto max-w-2xl font-light text-stone-500">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
