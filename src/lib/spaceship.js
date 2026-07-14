/// <reference types="three" />
import * as THREE from "three";

let ship;

export function createSpaceship() {
  const isMobile = typeof window !== 'undefined' && window.isMobileDevice;
  
  try {
  
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.75);
  shape.lineTo(-0.6, -0.75);
  shape.lineTo(0.6, -0.75);
  shape.lineTo(0, 0.75);

  const extrudeSettings = {
    depth: isMobile ? 0.2 : 0.4, // Simpler geometry on mobile
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 0,
    bevelSegments: 0,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3be8c,
    emissive: 0x2e3440,
    metalness: isMobile ? 0.5 : 0.8, // Less reflective on mobile
    roughness: isMobile ? 0.4 : 0.2, // Rougher surface on mobile
  });
  const hullMesh = new THREE.Mesh(geometry, hullMaterial);

  // Create wireframe (always included for visual quality)
  const edgesGeometry = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xa3be8c,
    linewidth: 2,
  });
  const wireframeMesh = new THREE.LineSegments(edgesGeometry, edgeMaterial);

  ship = new THREE.Group();
  ship.add(hullMesh);
  ship.add(wireframeMesh);

  ship.rotation.y = Math.PI;
  ship.rotation.x = -Math.PI / 2 + 0.26;

  return ship;
  } catch (error) {
    console.error('Error creating spaceship:', error);
    // Fallback: create a simple cube as spaceship
    const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
    const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xa3be8c });
    const fallbackShip = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
    fallbackShip.rotation.y = Math.PI;
    fallbackShip.rotation.x = -Math.PI / 2 + 0.26;
    return fallbackShip;
  }
}

export function getSpaceship() {
  return ship;
}
