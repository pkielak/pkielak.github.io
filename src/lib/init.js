/// <reference types="three" />
import { initScene, getScene } from "./scene.js";
import { createSpaceship } from "./spaceship.js";
import { createStars } from "./stars.js";
import { startAnimationLoop } from "./animation.js";

export function init() {
  initScene("space-canvas");

  const ship = createSpaceship();
  const scene = getScene();
  scene.add(ship);

  const stars = createStars();
  scene.add(stars);

  startAnimationLoop();
}
