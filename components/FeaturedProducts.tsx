"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollReveal";
export const FeaturedProducts=()=>{
 const {products,isLoading,catalogError}=useProducts();
 const [filter,setFilter]=React.useState('All iPhones');
 const list=React.useMemo(()=>products.filter(p=>p.category==='iphones' && (filter==='All iPhones'||(filter==='Brand new'?p.condition==='Brand New':p.condition!=='Brand New'))).sort((a,b)=>Number(!!b.featured)-Number(!!a.featured)).slice(0,6),[products,filter]);
 return <section id="collection" className="container-custom studio-section">
  <ScrollReveal><div className="studio-section-heading"><div><p className="studio-eyebrow">01 / FIND YOUR MATCH</p><h2>Good taste.<br/><span>Great choices.</span></h2></div><Link className="studio-text-link" href="/iphones">Shop all iPhones <ArrowUpRight size={20}/></Link></div></ScrollReveal>
  <div className="studio-filters" aria-label="Filter featured iPhones">{['All iPhones','Brand new','Pre-owned'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div>
  {(isLoading||catalogError||!list.length)&&<p role="status" className="py-10">{isLoading?'Loading the collection…':catalogError?'We couldn’t load the collection. Please try again.':'More devices are on their way. Browse all iPhones or ask us about availability.'}</p>}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{list.map((p,i)=><ScrollReveal key={p.id} delay={i*45}><ProductCard product={p}/></ScrollReveal>)}</div>
 </section>;
};
