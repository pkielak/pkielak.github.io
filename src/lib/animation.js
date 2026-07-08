import { getSpaceship } from "./spaceship";
import * as THREE from "three";
import {
  trackScrollPosition,
  updateStarParallaxEffect,
  currentScrollVelocity,
  scrollDirection,
} from "./scroll";
import { getRenderer, getCamera, getScene } from "./scene";

let targetShipX = 0;
let currentShipX = 0;
let currentShipRotationZ = 0;
let targetShipRotationZ = 0;
let rotationAnimationStartTime = 0;
let isRotating = false;
let animationStartRotation = 0;
let animationFrameId = null;
const smoothFactor = 0.2;
const rotationSmoothFactor = 0.02;
const rotationAnimationDuration = 500;

function handleShipRotation(time, scrollDirection) {
  // Rotate around Z-axis: 0 for normal, Math.PI for 180 degree spin when scrolling up
  const targetRotation = scrollDirection === -1 ? Math.PI : 0;
  targetShipRotationZ = targetRotation;

  // Check if we should skip animation (coming from last section)
  if (window.skipRotationAnimation) {
    currentShipRotationZ = targetRotation;
    window.skipRotationAnimation = false;
    isRotating = false;
    ship.rotation.z = currentShipRotationZ;
    return;
  }

  // Check if we need to start a new rotation animation
  // Trigger when scroll direction changes and we're not already animating
  if (Math.abs(currentShipRotationZ - targetRotation) > 0.1 && !isRotating) {
    // Start new rotation animation
    rotationAnimationStartTime = time * 1000;
    animationStartRotation = currentShipRotationZ;
    isRotating = true;
  }

  if (isRotating) {
    const elapsedTime = time * 1000 - rotationAnimationStartTime;
    const progress = Math.min(elapsedTime / rotationAnimationDuration, 1);

    // Use ease-in-out for smoother animation
    const easedProgress =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    const rotationDiff = targetShipRotationZ - animationStartRotation;

    // Directly interpolate based on eased progress for smooth animation
    currentShipRotationZ =
      animationStartRotation + rotationDiff * easedProgress;

    if (progress >= 1) {
      isRotating = false;
      currentShipRotationZ = targetShipRotationZ;
    }
  } else {
    // Regular smooth following when not in active rotation animation
    currentShipRotationZ +=
      (targetShipRotationZ - currentShipRotationZ) * rotationSmoothFactor;
  }

  ship.rotation.z = currentShipRotationZ;
}

export function triggerAnimationUpdate() {
  // Update target position for smooth ship movement
  const time = Date.now() * 0.001;
  targetShipX = Math.sin(time) * 1.2;

  // Ensure animation loop is running
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(animationLoop);
  }
}

export function startAnimationLoop() {
  const time = Date.now() * 0.001;
  targetShipX = Math.sin(time) * 1.2;
  currentShipX = targetShipX;
  animationFrameId = requestAnimationFrame(animationLoop);
}

let ship;

function animationLoop() {
  const time = Date.now() * 0.001;
  ship = getSpaceship();

  trackScrollPosition();
  updateStarParallaxEffect();

  // Track previous last section state
  const prevIsLastSectionFullyVisible =
    window.prevIsLastSectionFullyVisible || false;
  window.prevIsLastSectionFullyVisible = window.isLastSectionFullyVisible;

  // Track if we should skip rotation animation
  window.skipRotationAnimation = prevIsLastSectionFullyVisible;

  // Scale down the ship when the last section is fully in view
  if (window.isLastSectionFullyVisible === true) {
    ship.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
  } else {
    // Scale back up when not in the last section
    ship.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
  }

  // Smoothly interpolate current position toward target using linear interpolation
  // Higher smoothFactor = faster response, lower = smoother
  const delta = targetShipX - currentShipX;
  currentShipX += delta * smoothFactor;

  // Add a tiny bit of easing for extra smoothness
  if (Math.abs(delta) < 0.001) {
    currentShipX = targetShipX;
  }
  const scene = getScene();
  const camera = getCamera();
  const renderer = getRenderer();

  // --- SHIP MOVEMENTS ---
  // Base continuous smooth movement along a path
  const baseX = Math.sin(time) * 1.5;
  const baseY = Math.cos(time * 0.7) * 0.5;
  const baseZ = Math.sin(time * 0.5) * 0.3;

  // Add scroll-based movement
  const scrollX = currentScrollVelocity * 0.001 * scrollDirection;
  const scrollY = currentScrollVelocity * 0.0005 * scrollDirection;

  const targetX = baseX + scrollX;
  const targetY = baseY + scrollY;
  const targetZ = baseZ;

  // Smoothly interpolate current position toward target
  const deltaX = targetX - ship.position.x;
  const deltaY = targetY - ship.position.y;
  const deltaZ = targetZ - ship.position.z;

  ship.position.x += deltaX * smoothFactor;
  ship.position.y += deltaY * smoothFactor;
  ship.position.z += deltaZ * smoothFactor;

  // Update rotation based on position (preserve existing Z rotation behavior)
  const positionBasedZRotation = -Math.atan2(ship.position.x, 1) * 0.25;
  // Add scroll-based Z rotation to the position-based rotation
  ship.rotation.z = positionBasedZRotation + currentShipRotationZ;

  handleShipRotation(time, scrollDirection);

  renderer.render(scene, camera);

  animationFrameId = requestAnimationFrame(animationLoop);
}
