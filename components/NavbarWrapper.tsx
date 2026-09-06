"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchModal } from "@/components/SearchModal";

export const NavbarWrapper: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
