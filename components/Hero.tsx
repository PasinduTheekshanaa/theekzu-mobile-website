"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { storeConfig } from "@/config/store";
export const Hero = () => {
  const { products, getProductPrimaryImage } = useProducts();
  const phone = products.find(p => p.slug === "iphone-16-pro-max") || products.find(p => p.category === "iphones");
  const photo = phone ? getProductPrimaryImage(phone) : undefined;
  return <section className="studio-hero">
    <div className="container-custom">
      <div className="studio-hero-top"><span>THEEKZU MOBILE / SRI LANKA</span><span>Your next chapter starts here <ArrowUpRight size={14}/></span></div>
      <div className="studio-hero-grid">
        <div className="studio-hero-copy">
          <p className="studio-eyebrow studio-enter"><span className="studio-dot"/> A LITTLE UPGRADE. A BIG DIFFERENCE.</p>
          <h1 className="studio-enter studio-delay-1">Your world.<br/>An iPhone<br/><em>ahead.</em><span className="sr-only"> Theekzu Mobile — iPhone Store Sri Lanka</span></h1>
          <p className="studio-intro studio-enter studio-delay-2">Find the iPhone that feels like you. Brand new or carefully checked pre-owned, with personal support from Theekzu Mobile.</p>
          <div className="studio-actions studio-enter studio-delay-3"><Link href="/iphones" className="studio-button">Find your iPhone <ArrowUpRight size={19}/></Link><a href={`https://wa.me/${storeConfig.whatsappNumber}`} target="_blank" rel="noreferrer" className="studio-text-link">Let’s talk <MessageCircle size={17}/></a></div>
          <div className="studio-hero-note studio-enter studio-delay-3"><span><ShieldCheck size={16}/> Quality checked</span><span><Truck size={17}/> Islandwide delivery</span></div>
        </div>
        <div className="studio-product-stage studio-enter studio-delay-2">
          <span className="studio-stage-word" aria-hidden="true">iPhone.</span>
          <div className="studio-orbit" aria-hidden="true"/>
          <div className="studio-phone-float">{photo ? <Image src={photo} alt={phone?.name || "iPhone at Theekzu Mobile"} fill priority sizes="(max-width: 767px) 85vw, 48vw" className="object-contain"/> : <div className="studio-phone-fallback">Your next iPhone<br/><span>Discover the collection</span></div>}</div>
          <div className="studio-stage-label"><span className="studio-label-dot"/> DESIGNED TO DO MORE.</div>
          {phone && <Link href={`/product/${phone.slug}`} className="studio-product-caption"><div><span className="studio-eyebrow">IN THE SPOTLIGHT</span><h2>{phone.name}</h2><p>From {formatCurrency(phone.price)} <span>· {phone.stock}</span></p></div><span className="studio-circle"><ArrowUpRight size={22}/></span></Link>}
        </div>
      </div>
      <div className="studio-bottomline"><span>GOOD DESIGN. GREAT DEVICES. YOUR NEXT UPGRADE.</span><a href="#collection">Explore the collection <ArrowRight size={15}/></a></div>
    </div>
  </section>;
};
