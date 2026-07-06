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
  const baseSpeed = 0.02; // Base movement speed
  const scrollRange = 500; // Range within which stars are positioned

  // Calculate star movement speed based on scroll
  let starSpeed = baseSpeed * scrollDirection;

  // Add acceleration based on scroll velocity
  if (Math.abs(currentScrollVelocity) > 0.1) {
    starSpeed += Math.abs(currentScrollVelocity) * 0.05 * scrollDirection;
  }

  // Update each star's position
  for (let i = 0; i < starPositions.length; i += 3) {
    // Move stars along Z axis (depth)
    starPositions[i + 2] += starSpeed;

    // Wrap stars around when they go out of bounds
    if (starPositions[i + 2] > scrollRange) {
      starPositions[i + 2] = -scrollRange;
    } else if (starPositions[i + 2] < -scrollRange) {
      starPositions[i + 2] = scrollRange;
    }
  }

  // Mark positions as updated for Three.js
  stars.geometry.attributes.position.needsUpdate = true;
}
