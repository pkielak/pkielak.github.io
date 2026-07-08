/// <reference types="three" />
import * as THREE from "three";

let ship;

export function createSpaceship() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.75);
  shape.lineTo(-0.6, -0.75);
  shape.lineTo(0.6, -0.75);
  shape.lineTo(0, 0.75);

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: false,
    bevelThickness: 0,
    bevelSize: 0,
    bevelSegments: 0,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3be8c,
    emissive: 0x2e3440,
    metalness: 0.8,
    roughness: 0.2,
  });
  const hullMesh = new THREE.Mesh(geometry, hullMaterial);

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
}

export function getSpaceship() {
  return ship;
}
