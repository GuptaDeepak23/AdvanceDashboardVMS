import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register all required GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Configure ScrollTrigger defaults
ScrollTrigger.config({
  ignoreMobileResize: true,
});

// Export for use in components
export { gsap, ScrollTrigger, ScrollSmoother }; 