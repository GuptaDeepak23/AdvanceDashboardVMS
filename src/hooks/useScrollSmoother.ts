import { useEffect, useRef } from 'react';
import { gsap, ScrollSmoother } from '../gsap-init';

export const useScrollSmoother = (enabled: boolean = true) => {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('useScrollSmoother effect running, enabled:', enabled);
    // Only initialize if enabled
    if (!enabled) {
      console.log('ScrollSmoother disabled, returning early');
      return;
    }

    let ctx: gsap.Context;

    const initScrollSmoother = () => {
      console.log('Initializing ScrollSmoother...');
      if (!containerRef.current) {
        console.warn('Container ref not available');
        return;
      }

      const contentElement = containerRef.current.querySelector('.smooth-content') as HTMLElement;
      if (!contentElement) {
        console.warn('Smooth content element not found');
        return;
      }

      console.log('Container and content elements found, proceeding with ScrollSmoother initialization...');

      try {
        // Create a GSAP context for proper cleanup
        ctx = gsap.context(() => {
          // Ensure the container is visible
          gsap.set(containerRef.current, { visibility: "visible" });
          
          // Initialize ScrollSmoother with professional settings
          smootherRef.current = ScrollSmoother.create({
            wrapper: containerRef.current!,
            content: contentElement,
            smooth: 1.5,
            effects: true,
            normalizeScroll: true,
            smoothTouch: 0.1,
            ignoreMobileResize: true,
            ease: "power2.out",
          });

          console.log('GSAP ScrollSmoother initialized successfully');
        }, containerRef.current);

      } catch (error) {
        console.error('Error initializing ScrollSmoother:', error);
        // Fallback: make container visible even if ScrollSmoother fails
        gsap.set(containerRef.current, { visibility: "visible" });
      }
    };

    // Initialize after DOM is ready and GSAP is loaded
    const timer = setTimeout(initScrollSmoother, 300);

    return () => {
      clearTimeout(timer);
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
      if (ctx) {
        ctx.revert();
      }
    };
  }, [enabled]);

  return { containerRef, smootherRef };
}; 