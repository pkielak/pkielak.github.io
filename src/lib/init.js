/// <reference types="three" />
import { initScene, getScene } from "./scene";
import { createSpaceship } from "./spaceship";
import { createStars } from "./stars";
import { startAnimationLoop } from "./animation";

export function init() {
  initScene("space-canvas");

  const ship = createSpaceship();
  const scene = getScene();
  scene.add(ship);

  const stars = createStars();
  scene.add(stars);

  startAnimationLoop();
}
