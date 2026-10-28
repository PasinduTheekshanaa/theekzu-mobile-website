import Image from "next/image";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import type { Metadata } from "next";
import { ArrowUpRight, Target, Eye, ShieldCheck, MessageCircle, Users, Smartphone, Zap, Truck, Mail, Phone } from "lucide-react";
import { storeConfig, getWhatsAppUrl } from "@/config/store";

export const metadata: Metadata = {
  title: {
    absolute: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
  },
  description:
    "Meet Pasindu Theekshana, Founder and Owner of Theekzu Mobile. Discover our commitment to quality iPhones, honest advice and personal service across Sri Lanka.",
  keywords: [
    "About Theekzu Mobile",
    "iPhone seller Sri Lanka",
    "Genuine Apple warranty Sri Lanka",
    "Trusted iPhone shop Colombo",
  ],
  alternates: {
    canonical: "https://theekzu.vercel.app/about",
  },
  openGraph: {
    title: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
    description:
      "Meet Pasindu Theekshana, Founder and Owner of Theekzu Mobile. Discover our commitment to quality iPhones, honest advice and personal service across Sri Lanka.",
    url: "https://theekzu.vercel.app/about",
    siteName: "Theekzu Mobile",
    images: [
      {
        url: "/brand-logo.png",
        width: 800,
        height: 800,
        alt: "About Theekzu Mobile Sri Lanka",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Theekzu Mobile | Trusted iPhone Store Sri Lanka",
    description:
      "Sri Lanka's trusted online store for genuine Apple iPhones and accessories.",
    images: ["/brand-logo.png"],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://theekzu.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About Us",
      item: "https://theekzu.vercel.app/about",
    },
  ],
};


const stats = [
  { value: "500+", target: 500, suffix: "+", label: "Happy customers", icon: Users },
  { value: "700+", target: 700, suffix: "+", label: "Devices sold", icon: Smartphone },
  { value: "8AM – 8PM", label: "Fast customer support", icon: Zap },
  { value: "25", target: 25, suffix: "", detail: "Districts", label: "Islandwide online service", icon: Truck },
];

const values = [
  { number: "01", icon: Target, title: "Our Mission", text: "Make premium mobile technology more accessible through quality products, trusted service and a convenient online buying experience." },
  { number: "02", icon: Eye, title: "Our Vision", text: "Become a trusted online destination in Sri Lanka for iPhones and premium mobile products." },
  { number: "03", icon: ShieldCheck, title: "Our Commitment", text: "Quality products, transparent communication and reliable customer support." },
];

export default function AboutPage() {
  return (
    <div className="container-custom py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section aria-labelledby="about-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 min-w-0 space-y-6">
          <span className="inline-flex rounded-full border border-neutral-200 px-3.5 py-1 text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase">Our Story &amp; Heritage</span>
          <h1 id="about-heading" className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight">About Theekzu Mobile</h1>
          <p className="text-sm sm:text-base leading-relaxed">
            Theekzu Mobile is an online mobile business focused on providing quality smartphones, premium Apple devices, accessories and reliable customer service to customers across Sri Lanka.
          </p>
          <p className="text-sm leading-relaxed">
            Founded to establish genuine trust and transparency in Sri Lanka's smartphone market, we eliminate the uncertainty often associated with buying high-end technology. Every brand new device is factory-sealed, and every certified pre-owned phone is rigorously inspected with verified battery health and diagnostic reports.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-neutral-200 p-5 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 mb-4"><Icon className="w-5 h-5" strokeWidth={1.7} /></div>
                <h2 className="text-sm font-bold mb-2">{title}</h2>
                <p className="text-xs leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 min-w-0 rounded-[2rem] sm:rounded-[3rem] border border-neutral-200 p-6 sm:p-9 text-center bg-white shadow-[0_12px_32px_rgba(0,0,0,0.07)]">
          <div className="w-44 h-44 sm:w-60 sm:h-60 mx-auto rounded-3xl p-2 bg-white shadow-md mb-7">
            <Image src="/brand-logo.png" alt="Theekzu Mobile Official Brand" width={240} height={240} priority className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h2 className="text-xl font-black">THEEKZU MOBILE</h2>
          <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em]">{storeConfig.tagline}</p>
          <p className="mt-4 text-xs leading-relaxed max-w-xs mx-auto">Engineered with excellence for Sri Lanka's mobile community.</p>
        </div>
      </section>

      <section aria-label="Theekzu Mobile in numbers" className="rounded-3xl border border-neutral-200 bg-white p-3 sm:p-6 lg:p-10 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.15)]">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, target, suffix, detail, label, icon: Icon }, index) => (
            <div key={label} className={`flex flex-col items-center text-center px-2 sm:px-5 py-6 sm:py-8 min-w-0 ${index % 2 === 1 ? "border-l border-neutral-200" : ""} ${index > 1 ? "border-t lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""} border-neutral-200`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 mb-4 sm:mb-5" strokeWidth={1.8} aria-hidden="true" />
              <dt className="order-last mt-3 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.1em] leading-relaxed max-w-[180px]">{label}</dt>
              <dd className="text-[clamp(1.5rem,3.3vw,3.5rem)] font-black tracking-tight leading-[1.12] tabular-nums">
                {target !== undefined ? <AnimatedCounter target={target} suffix={suffix} duration={1600} /> : value}{detail && <span className="block mt-1 text-lg sm:text-2xl lg:text-3xl font-bold">{detail}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </section>


      <section aria-labelledby="founder-heading" className="border-t border-neutral-200 pt-10 sm:pt-16">
        <div className="mb-8 sm:mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3 text-neutral-500">Behind the brand</p>
          <h2 id="founder-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">Meet our founder.</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-16 lg:gap-y-0 items-center">
        <figure className="min-w-0 w-full max-w-lg mx-auto lg:contents">
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 relative aspect-[4/5] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-neutral-200">
            <Image src="/team/pasindu-theekshana.webp" alt="Pasindu Theekshana, Founder and Owner of Theekzu Mobile" fill sizes="(min-width: 1280px) 440px, (min-width: 1024px) 40vw, (min-width: 640px) 512px, 100vw" className="object-cover object-[50%_35%]" />
          </div>
          <figcaption className="lg:col-span-5 lg:col-start-1 lg:row-start-2 pt-5 px-1">
            <div className="flex justify-between items-center gap-4">
            <div>
              <h2 className="font-bold text-xl sm:text-2xl tracking-tight">Pasindu Theekshana</h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500">Founder &amp; Owner · Theekzu Mobile</p>
            </div>
            <Image src="/brand-logo-small.webp" alt="Theekzu Mobile" width={44} height={44} className="rounded-xl shrink-0" />
            </div>
          <a
            href={`mailto:${storeConfig.email}`}
            className="mt-5 flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-3.5 text-xs sm:text-sm font-semibold shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-offset-4"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-all">{storeConfig.email}</span>
          </a>
          <a
            href={`tel:${storeConfig.phoneRaw}`}
            className="mt-3 flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-3.5 text-xs sm:text-sm font-semibold shadow-sm transition-colors hover:bg-neutral-100 focus-visible:outline-offset-4"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{storeConfig.phone}</span>
          </a>
          </figcaption>
        </figure>
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-center min-w-0 space-y-5">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-500">Founder &amp; Owner</p>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Pasindu Theekshana</h3>
            <p className="text-lg sm:text-xl font-medium leading-relaxed">A real person. A clear commitment.</p>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600">Pasindu Theekshana is the Founder &amp; Owner of Theekzu Mobile, an online mobile business serving customers across Sri Lanka.</p>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600">The business focuses on quality smartphones, premium Apple devices and accessories, with clear communication and reliable customer service at the heart of the experience.</p>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600">From choosing a model to checking its condition and arranging your order, our approach is simple: explain the details, answer your questions and help you choose with confidence.</p>
            <a
              href="https://pasindutheekshana.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              data-ui="primary"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-black px-6 py-3.5 min-h-12 text-sm font-semibold shadow-md transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 motion-reduce:transform-none"
            >
              who is pasindu theekshana...?
              <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
              <span className="sr-only"> (opens portfolio in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-contact-heading" className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div className="max-w-xl"><p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-3">{storeConfig.tagline}</p><h2 id="about-contact-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">Let’s find your next iPhone.</h2><p className="text-sm text-neutral-600 mt-3 leading-relaxed">Questions about a device? We’re here to help, {storeConfig.businessHours} daily.</p></div>
        <a href={getWhatsAppUrl("Hello Theekzu Mobile, I would like help choosing my next iPhone.")} target="_blank" rel="noopener noreferrer" data-ui="whatsapp" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 min-h-12 text-sm font-semibold shrink-0"><MessageCircle className="w-5 h-5" /> Let’s talk on WhatsApp</a>
      </section>
    </div>
  );
}
