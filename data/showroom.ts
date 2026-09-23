export interface ShowroomPhoto {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: "Showroom Space" | "Display Counter" | "Device Verification";
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
}

export const showroomPhotos: ShowroomPhoto[] = [
  {
    id: "main-showroom",
    src: "/showroom/showroom-main-apple-flag.jpg",
    title: "Official Theekzu Mobile Showroom Desk",
    subtitle: "Illuminated Apple logo, executive desk setup, displayed iPhone collections, and the Sri Lankan flag",
    category: "Showroom Space",
    alt: "Theekzu Mobile showroom interior featuring illuminated Apple logo, executive desk, national Sri Lankan flag, and arranged iPhone retail boxes",
    width: 1179,
    height: 1463,
    featured: true,
  },
  {
    id: "display-screens",
    src: "/showroom/showroom-display-screens.jpg",
    title: "Live iPhone Display Counter",
    subtitle: "Flagship iPhone models powered on with Dynamic Island and Super Retina XDR displays",
    category: "Display Counter",
    alt: "Five flagship Apple iPhones powered on and displayed alongside retail boxes on a wooden showroom counter against wood-slatted wall",
    width: 954,
    height: 960,
    featured: true,
  },
  {
    id: "display-backs",
    src: "/showroom/showroom-display-backs.jpg",
    title: "Color Finishes & Camera Showcase",
    subtitle: "Curated display showing premium titanium and glass color finishes and camera modules",
    category: "Display Counter",
    alt: "Rear view of five iPhone models showing various color finishes, Apple logo, and camera setups on showroom wooden counter",
    width: 720,
    height: 960,
    featured: true,
  },
  {
    id: "device-inspection",
    src: "/showroom/showroom-device-inspection.jpg",
    title: "Rigorous Device Diagnostics & Battery Verification",
    subtitle: "Comprehensive 4-point verification checking genuine Apple parts, iOS health, and pristine casing",
    category: "Device Verification",
    alt: "Close-up verification screens showing genuine Apple battery health, iOS settings, hardware diagnostics, and immaculate red iPhone condition",
    width: 4084,
    height: 4084,
    featured: false,
  },
  {
    id: "device-pro-silver",
    src: "/showroom/showroom-device-pro-silver.jpg",
    title: "Certified Pro Series Inspection",
    subtitle: "Multi-angle physical condition assessment of pristine Pro series flagship device",
    category: "Device Verification",
    alt: "Triple angle inspection view of a pristine Silver/White Apple iPhone Pro demonstrating flawless rails, back glass, and camera lenses",
    width: 1600,
    height: 1600,
    featured: false,
  },
  {
    id: "device-green",
    src: "/showroom/showroom-device-green.jpg",
    title: "Pristine Device Hand Inspection",
    subtitle: "Hand-held inspection highlighting flawless corners, ports, and original color finish",
    category: "Device Verification",
    alt: "Inspection of a pristine mint green iPhone showing flawless Lightning/USB port, speaker grilles, buttons, and original glass finish",
    width: 1280,
    height: 1280,
    featured: false,
  },
];
