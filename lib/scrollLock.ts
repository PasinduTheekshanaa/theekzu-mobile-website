// Every overlay owns a release function; only the last release restores scrolling.
let locks = 0;
let restore: (() => void) | undefined;

export function acquireScrollLock() {
  if (locks === 0) {
    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    restore = () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
    };
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      restore?.();
      restore = undefined;
    }
  };
}
