/// <reference types="three" />
import * as THREE from "three";

let stars;

export function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 5000;
  const posArray = new Float32Array(starCount * 3);
  const originalPositions = new Float32Array(starCount * 3);

  const scrollRange = 2000; // Large range to ensure even distribution
  const distributionRadius = 90;

  for (let i = 0; i < starCount; i++) {
    // Random spherical coordinates for natural distribution
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.cbrt(Math.random()) * distributionRadius;

    posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    // Even distribution along entire Z axis
    posArray[i * 3 + 2] = (Math.random() - 0.5) * scrollRange * 2;

    originalPositions[i * 3] = posArray[i * 3];
    originalPositions[i * 3 + 1] = posArray[i * 3 + 1];
    originalPositions[i * 3 + 2] = posArray[i * 3 + 2];
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
  starGeometry.userData.originalPositions = originalPositions;

  const starMaterial = new THREE.PointsMaterial({
    size: 0.4,
    color: 0xa3be8c,
  });

  stars = new THREE.Points(starGeometry, starMaterial);
  return stars;
}

export function getStars() {
  return stars;
}
