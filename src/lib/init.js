/// <reference types="three" />
import { initScene, getScene } from "./scene.js";
import { createSpaceship } from "./spaceship.js";
import { createStars } from "./stars.js";
import { startAnimationLoop, triggerAnimationUpdate } from "./animation.js";
import { inView } from "./inView.js";

export function init() {
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
      threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    },
  );

  // Observe all scroll anchors
  document.querySelectorAll(".scroll-anchor").forEach((anchor) => {
    observer.observe(anchor);
  });

  // Initial check on load
  window.addEventListener("load", () => {
    document.querySelectorAll(".scroll-anchor").forEach((anchor) => {
      observer.observe(anchor);
    });
    // Start animation loop
    startAnimationLoop();
    // Initial animation update
    triggerAnimationUpdate();
  });
}
