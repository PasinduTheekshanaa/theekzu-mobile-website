"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { storeConfig, getWhatsAppUrl } from "@/config/store";
import { FORMSPREE_ENDPOINT, contactConfig } from "@/config/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("iPhone Purchase Inquiry");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Email format validation helper
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone or WhatsApp number.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!message.trim()) {
      newErrors.message = "Please write a message.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam check: If honeypot is filled, simulate success silently
    if (honeypot) {
      setStatus("success");
      setStatusMessage("Thank you! Your message has been sent successfully. We’ll get back to you soon.");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject: subject.trim() || "Website Contact Form Inquiry",
          message: message.trim(),
          _source: contactConfig.sourceIdentifier,
          _replyto: email.trim(),
        }),
      });

      if (response.ok) {
        setStatus("success");
        setStatusMessage("Thank you! Your message has been sent successfully. We’ll get back to you soon.");
        // Clear form fields
        setName("");
        setPhone("");
        setEmail("");
        setSubject("iPhone Purchase Inquiry");
        setMessage("");
        setErrors({});
      } else {
        const data = await response.json().catch(() => ({}));
        console.error("Formspree error response:", data);
        setStatus("error");
        setStatusMessage("Sorry, your message could not be sent. Please try again or contact us via WhatsApp.");
      }
    } catch (err) {
      console.error("Formspree network error:", err);
      setStatus("error");
      setStatusMessage("Sorry, your message could not be sent. Please try again or contact us via WhatsApp.");
    }
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `*New Inquiry - Theekzu Mobile*
Name: ${name || "Customer"}
Phone: ${phone || "Not provided"}
Email: ${email || "Not provided"}
Subject: ${subject || "General Inquiry"}
Message: ${message || "Hello, I am interested in your iPhones and services."}`;

    window.open(getWhatsAppUrl(text), "_blank");
  };

  const contactCards = [
    {
      title: "Direct Phone",
      val: "0740245749",
      sub: "Click to call directly",
      href: "tel:0740245749",
      icon: Phone,
      color: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "WhatsApp Chat",
      val: "0740245749",
      sub: "Active: 8:00 AM – 8:00 PM",
      href: "https://wa.me/94740245749",
      icon: MessageCircle,
      color: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Email Support",
      val: "pasindutheekshana21@gmail.com",
      sub: "Quick reply within hours",
      href: "mailto:pasindutheekshana21@gmail.com",
      icon: Mail,
      color: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Store Location",
      val: "Online Store – Sri Lanka",
      sub: "Islandwide delivery to your door",
      href: "https://wa.me/94740245749",
      icon: MapPin,
      color: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
    {
      title: "Business Hours",
      val: "8.00 AM – 8.00 PM",
      sub: "Open Monday – Sunday",
      href: "tel:0740245749",
      icon: Clock,
      color: "text-ink dark:text-ink bg-canvas dark:bg-canvas border-neutral-500/20 dark:border-neutral-500/30",
    },
  ];

  return (
    <div className="container-custom py-6 sm:py-10 space-y-8 sm:space-y-12 transition-colors duration-300">

      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-canvas dark:bg-canvas border border-neutral-500/20 dark:border-neutral-500/30 text-xs font-bold text-ink dark:text-ink tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> Get in Touch
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink dark:text-ink mt-3">
          Contact <span className="text-brand">Theekzu</span> <span className="text-brand">Mobile</span>
        </h1>
        <p className="text-ink dark:text-ink text-xs sm:text-sm mt-1 max-w-xl">
          Have a question about an iPhone model, price, stock availability, trade-in, or delivery? We're here to assist you daily.
        </p>
      </div>

      {/* 5 Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {contactCards.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.title}
              data-ui={c.href.includes("wa.me") ? "whatsapp-link" : undefined}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="glass-card p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] block border border-neutral-200 dark:border-neutral-500/20 hover:border-neutral-500 dark:hover:border-neutral-400/60 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md active:scale-98"
            >
              <div data-brand-color={c.title} className={`w-10 sm:w-11 h-10 sm:h-11 rounded-2xl border flex items-center justify-center mb-3 sm:mb-4 ${c.color}`}>
                <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-ink dark:text-ink mb-1">
                {c.title}
              </h4>
              <p className="text-xs sm:text-sm font-bold text-ink dark:text-ink break-words">{c.val}</p>
              <p className="text-[10px] sm:text-[11px] text-ink dark:text-ink mt-1 font-medium">{c.sub}</p>
            </a>
          );
        })}
      </div>

      {/* Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* Left Information & Brand Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-neutral-200 dark:border-neutral-500/30 space-y-4 sm:space-y-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-200 dark:border-neutral-500/20">
              <div className="w-12 h-12 rounded-2xl p-[1px] bg-canvas    shadow-sm dark:shadow-[0_0_15px_rgba(169,169,169,0.4)]">
                <div className="w-full h-full bg-canvas rounded-[15px] p-1 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Theekzu Mobile Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-ink dark:text-ink">THEEKZU MOBILE</h3>
                <span className="text-xs text-ink dark:text-ink font-semibold">{storeConfig.tagline}</span>
              </div>
            </div>

            <p className="text-sm text-ink dark:text-ink leading-relaxed">
              We respond promptly to all questions regarding device availability, custom storage requests, trade-in valuations, and islandwide courier status.
            </p>

            <div className="space-y-3 pt-2">
              <a data-ui="whatsapp"
                href="https://wa.me/94740245749"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-canvas     text-ink text-xs font-bold shadow-md shadow-neutral-500/20 dark:shadow-[0_0_20px_rgba(145,145,145,0.35)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Live Support</span>
              </a>

              <a data-ui="primary"
                href="tel:0740245749"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink text-xs font-semibold transition-all shadow-xs"
              >
                <Phone data-brand-color="#2563eb" className="w-4 h-4 text-ink dark:text-ink" />
                <span>Call Hotline: 0740245749</span>
              </a>

              <a data-ui="primary"
                href="mailto:pasindutheekshana21@gmail.com"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-full bg-canvas hover:bg-canvas dark:bg-canvas dark:hover:bg-canvas border border-neutral-200 dark:border-neutral-500/20 text-ink dark:text-ink text-xs font-semibold transition-all shadow-xs"
              >
                <Mail data-brand-color="#4f46e5" className="w-4 h-4 text-ink dark:text-ink" />
                <span>Email: pasindutheekshana21@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Form with direct Formspree integration */}
        <div className="lg:col-span-7">
          <div className="glass-card p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-neutral-200 dark:border-neutral-500/20 shadow-sm dark:shadow-none relative overflow-hidden">
            <h3 className="text-lg sm:text-xl font-bold text-ink dark:text-ink mb-1">Send a Direct Message</h3>
            <p className="text-xs text-ink dark:text-ink mb-5 sm:mb-6">
              Fill out the details below to reach our team immediately. Messages are delivered directly to our official inbox.
            </p>

            {/* Success Notification Banner */}
            {status === "success" && (
              <div className="mb-6 p-4 rounded-2xl bg-canvas border border-neutral-500/30 text-ink dark:text-ink flex items-start gap-3 animate-page-enter">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-ink dark:text-ink mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Message Sent Successfully</p>
                  <p className="text-xs text-ink dark:text-ink mt-0.5">{statusMessage}</p>
                </div>
              </div>
            )}

            {/* Error Notification Banner */}
            {status === "error" && (
              <div className="mb-6 p-4 rounded-2xl bg-canvas border border-neutral-500/30 text-ink dark:text-ink flex items-start gap-3 animate-page-enter">
                <AlertCircle className="w-5 h-5 shrink-0 text-ink dark:text-ink mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Submission Failed</p>
                  <p className="text-xs text-ink dark:text-ink mt-0.5">{statusMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
              {/* Anti-Spam Hidden Honeypot Field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Your Name <span className="text-ink">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Kasun Fernando"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full bg-canvas dark:bg-canvas border ${
                      errors.name
                        ? "border-neutral-500 focus:border-neutral-500"
                        : "border-neutral-300 dark:border-neutral-500/20 focus:border-neutral-600 dark:focus:border-neutral-400"
                    } rounded-xl px-4 py-3 text-sm text-ink dark:text-ink focus:outline-none transition-colors`}
                  />
                  {errors.name && (
                    <p className="text-xs text-ink mt-1 font-medium flex items-center gap-1">
                      <span>•</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Phone / WhatsApp <span className="text-ink">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0740245749"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                    className={`w-full bg-canvas dark:bg-canvas border ${
                      errors.phone
                        ? "border-neutral-500 focus:border-neutral-500"
                        : "border-neutral-300 dark:border-neutral-500/20 focus:border-neutral-600 dark:focus:border-neutral-400"
                    } rounded-xl px-4 py-3 text-sm text-ink dark:text-ink focus:outline-none transition-colors`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-ink mt-1 font-medium flex items-center gap-1">
                      <span>•</span> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Email Address <span className="text-ink">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="kasun@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full bg-canvas dark:bg-canvas border ${
                      errors.email
                        ? "border-neutral-500 focus:border-neutral-500"
                        : "border-neutral-300 dark:border-neutral-500/20 focus:border-neutral-600 dark:focus:border-neutral-400"
                    } rounded-xl px-4 py-3 text-sm text-ink dark:text-ink focus:outline-none transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-xs text-ink mt-1 font-medium flex items-center gap-1">
                      <span>•</span> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                    Subject <span className="text-ink font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. iPhone 16 Pro Stock Inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-canvas dark:bg-canvas border border-neutral-300 dark:border-neutral-500/20 rounded-xl px-4 py-3 text-sm text-ink dark:text-ink focus:border-neutral-600 dark:focus:border-neutral-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink dark:text-ink mb-1.5">
                  Message <span className="text-ink">*</span>
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  placeholder="Which iPhone model, storage or accessory are you interested in?"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  className={`w-full bg-canvas dark:bg-canvas border ${
                    errors.message
                      ? "border-neutral-500 focus:border-neutral-500"
                      : "border-neutral-300 dark:border-neutral-500/20 focus:border-neutral-600 dark:focus:border-neutral-400"
                  } rounded-xl px-4 py-3 text-sm text-ink dark:text-ink focus:outline-none transition-colors resize-none`}
                />
                {errors.message && (
                  <p className="text-xs text-ink mt-1 font-medium flex items-center gap-1">
                    <span>•</span> {errors.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* WhatsApp button keeps existing WhatsApp generator */}
                <button data-ui="whatsapp"
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="min-h-[44px] py-3.5 px-4 rounded-full bg-canvas     text-ink text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-neutral-500/20 dark:shadow-[0_0_20px_rgba(145,145,145,0.35)] transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Send via WhatsApp</span>
                </button>

                {/* Main Direct Submit Button connected to Formspree */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`min-h-[44px] py-3.5 px-4 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    status === "submitting"
                      ? "bg-canvas dark:bg-canvas text-ink cursor-not-allowed"
                      : "bg-canvas       text-ink shadow-neutral-600/25 dark:shadow-[0_0_25px_rgba(147,147,147,0.4)] hover:scale-[1.01] active:scale-[0.98]"
                  }`}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-ink shrink-0" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 shrink-0" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
