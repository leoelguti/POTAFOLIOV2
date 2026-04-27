import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver hook for scroll reveal animations.
 * Adds 'in' class when element enters viewport.
 */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold }
    );

    // Observe the element itself and any children with .rev class
    const revElements = el.querySelectorAll('.rev');
    revElements.forEach((child) => observer.observe(child));
    if (el.classList.contains('rev')) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
