/// <reference types="three" />
import { initScene, getScene, getRenderer, cleanupScene } from "./scene.js";
import { resetAnimationState } from "./animation.js";
import { createSpaceship } from "./spaceship.js";
import { createStars } from "./stars.js";
import { startAnimationLoop, triggerAnimationUpdate, cleanupAnimation } from "./animation.js";
import { inView } from "./inView.js";

let initialized = false;
let observer;
let pageLoadListenerRegistered = false;

// Register the page load listener once when this module is loaded
if (typeof document !== 'undefined') {
  document.addEventListener("astro:page-load", init);
  pageLoadListenerRegistered = true;
}

function cleanup() {
  // Cancel any ongoing animation frames
  cleanupAnimation();

  // Disconnect intersection observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Clean up Three.js resources properly
  cleanupScene();

  // Reset initialized flag
  initialized = false;

  // Remove window properties
  delete window.skipRotationAnimation;
  delete window.prevIsLastSectionFullyVisible;
  delete window.isLastSectionFullyVisible;
}

export function init() {
  // Check if the canvas element exists on this page
  const canvasElement = document.getElementById("space-canvas");
  if (!canvasElement) {
    // Canvas doesn't exist on this page, skip initialization
    // But don't cleanup if we're not initialized (to preserve event listener)
    if (initialized) {
      cleanup();
    }
    return;
  }

  // Clean up any previous initialization
  cleanup();

  if (initialized) return;
  initialized = true;

  // Reset animation state for fresh start
  resetAnimationState();

  initScene("space-canvas");

  const ship = createSpaceship();
  const scene = getScene();
  scene.add(ship);

  const stars = createStars();
  scene.add(stars);

  startAnimationLoop();

  // Intersection Observer for scroll anchors
  const observer = new IntersectionObserver(
    (entries) => {
      // Update the space scene whenever scroll changes
      triggerAnimationUpdate();

      entries.forEach(inView);
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: Array.from({ length: 60 }, (_, i) => i / 60),
    },
  );

  // Observe all scroll anchors
  document.querySelectorAll(".scroll-anchor").forEach((anchor) => {
    observer.observe(anchor);
  });

  // Start animation loop
  startAnimationLoop();
  // Initial animation update
  triggerAnimationUpdate();

  // Set up cleanup for page navigation
  window.addEventListener('astro:before-unload', cleanup);
}
