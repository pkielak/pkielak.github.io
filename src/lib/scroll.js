/// <reference types="three" />
import { getStars } from "./stars";

let lastScrollY = 0;
export let currentScrollVelocity = 0;
export let scrollDirection = 1; // 1 for down, -1 for up

export function trackScrollPosition() {
  const currentScrollY = window.scrollY;
  currentScrollVelocity = currentScrollY - lastScrollY;
  lastScrollY = currentScrollY;

  // Update scroll direction when significant scrolling occurs
  if (Math.abs(currentScrollVelocity) > 0.1) {
    scrollDirection = currentScrollVelocity > 0 ? 1 : -1;
  }
}

export function updateStarParallaxEffect() {
  const stars = getStars();
  const starPositions = stars.geometry.attributes.position.array;

  const scrollRange = 2000; // Must match the distribution range in stars.js

  const baseSpeed = 0.02;
  const velocitySpeed = 0.05;

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
