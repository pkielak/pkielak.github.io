/// <reference types="three" />
import { initScene, getScene } from "./scene";
import { createSpaceship } from "./spaceship";
import { createStars } from "./stars";
import { startAnimationLoop } from "./animation";

export function init() {
  // Initialize scene
  initScene("space-canvas");

  // Create spaceship
  const ship = createSpaceship();
  const scene = getScene();
  scene.add(ship);

  // Create stars
  const stars = createStars();
  scene.add(stars);

  // Start animation loop
  startAnimationLoop();
}
