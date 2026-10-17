"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

const SearchModal = dynamic(() => import("@/components/SearchModal").then(module => module.SearchModal), { ssr: false });

export const NavbarWrapper: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      {isSearchOpen && <SearchModal isOpen onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};
