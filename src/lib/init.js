/// <reference types="three" />
import { initScene, getScene, getRenderer, cleanupScene } from "./scene.js";
import { resetAnimationState } from "./animation.js";
import { createSpaceship } from "./spaceship.js";
import { createStars } from "./stars.js";
import {
  startAnimationLoop,
  triggerAnimationUpdate,
  cleanupAnimation,
  setAnimationQuality,
  animationQuality,
} from "./animation.js";
import { inView } from "./inView.js";
import { detectPerformanceCapabilities } from "./performance.js";

let initialized = false;
let observer;
let pageLoadListenerRegistered = false;
let isMobileDevice = false;

// Register the page load listener once when this module is loaded
if (typeof document !== "undefined") {
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
  delete window.isMobileDevice;
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
  try {
    cleanup();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }

  if (initialized) return;
  initialized = true;

  // Detect device type and performance capabilities
  detectDeviceCapabilities();

  // Reset animation state for fresh start
  resetAnimationState();

  try {
    initScene("space-canvas");

    const ship = createSpaceship();
    const scene = getScene();
    scene.add(ship);

    const stars = createStars();
    scene.add(stars);
  } catch (error) {
    console.error("Error during scene initialization:", error);
    // Fallback: show a simple gradient background
    const canvas = document.getElementById("space-canvas");
    if (canvas) {
      canvas.style.background =
        "linear-gradient(180deg, #2e3440 0%, #3b4252 50%, #2e3440 100%)";
    }
    return;
  }

  startAnimationLoop();

  // Intersection Observer for scroll anchors with good thresholds
  const observer = new IntersectionObserver(
    (entries) => {
      // Update the space scene whenever scroll changes
      triggerAnimationUpdate();

      entries.forEach(inView);
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: Array.from({ length: 30 }, (_, i) => i / 30), // 30 thresholds for smooth detection
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
  window.addEventListener("astro:before-unload", cleanup);

  // Set up visibility change listener for performance optimization
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

function detectDeviceCapabilities() {
  const { isMobile, recommendedQuality } = detectPerformanceCapabilities();
  isMobileDevice = isMobile;
  window.isMobileDevice = isMobileDevice;

  // Simple: mobile = low quality, desktop = high quality
  setAnimationQuality(recommendedQuality);

  console.log(
    `Device: ${isMobile ? "Mobile" : "Desktop"} - Quality: ${recommendedQuality}`,
  );
}

function handleVisibilityChange() {
  if (document.hidden) {
    // Page is not visible, pause animations to save resources
    cleanupAnimation();
  } else {
    // Page is visible again, resume animations
    if (initialized) {
      startAnimationLoop();
    }
  }
}

function setupScrollThrottling() {
  // Removed dynamic quality changing during scroll
  // Quality is set once at startup for consistent experience
}
