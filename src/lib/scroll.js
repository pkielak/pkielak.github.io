/// <reference types="three" />
import { getStars } from "./stars";

// Scroll state tracking
let lastScrollY = 0;
export let currentScrollVelocity = 0; // Current scroll velocity for star acceleration
export let scrollDirection = 1; // 1 for down, -1 for up

/**
 * Updates the scroll state by tracking scroll position and velocity
 */
export function trackScrollPosition() {
  const currentScrollY = window.scrollY;
  currentScrollVelocity = currentScrollY - lastScrollY;
  lastScrollY = currentScrollY;

  // Update scroll direction when significant scrolling occurs
  if (Math.abs(currentScrollVelocity) > 0.1) {
    scrollDirection = currentScrollVelocity > 0 ? 1 : -1;
  }
}

/**
 * Updates star positions based on scroll velocity and direction
 * Creates a parallax effect where stars move at different speeds
 */
export function updateStarParallaxEffect() {
  const stars = getStars();
  const starPositions = stars.geometry.attributes.position.array;

  // Configuration for parallax effect
  const scrollRange = 2000; // Must match the distribution range in stars.js

  // Move all stars together based on scroll velocity
  // Stars move toward viewer when scrolling down (positive velocity)
  // Stars move away when scrolling up (negative velocity)
  // Plus slow constant drift in the current scroll direction
  const baseSpeed = 0.02; // Slow constant movement speed
  const velocitySpeed = 0.05; // Speed multiplier for scroll velocity

  for (let i = 0; i < starPositions.length; i += 3) {
    // Base movement + velocity-based movement
    starPositions[i + 2] +=
      baseSpeed * scrollDirection + currentScrollVelocity * velocitySpeed;

    // Wrap stars when they go out of bounds
    if (starPositions[i + 2] > scrollRange) {
      starPositions[i + 2] = -scrollRange;
    } else if (starPositions[i + 2] < -scrollRange) {
      starPositions[i + 2] = scrollRange;
    }
  }

  stars.geometry.attributes.position.needsUpdate = true;
}
