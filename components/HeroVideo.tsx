export function HeroVideo() {
  return <video
    className="absolute inset-0 h-full w-full object-cover transform-gpu brightness-100 contrast-120 saturate-115 dark:brightness-110 dark:contrast-110 dark:saturate-110 motion-reduce:hidden"
    src="/theekzu-hero.mp4"
    poster="/hero-poster.webp"
    autoPlay muted loop playsInline preload="auto"
    aria-label="Theekzu Mobile brand video"
  />;
}
