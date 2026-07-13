/// <reference types="three" />
import * as THREE from "three";

let scene, camera, renderer;

// Add cleanup function for scene resources
export function cleanupScene() {
  if (scene) {
    // Dispose of all children in the scene
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        // Handle materials properly
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      scene.remove(obj);
    }
    scene = null;
  }
  
  camera = null;
  renderer = null;
}

export function initScene(canvasId) {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );

  // Camera is fixed to look at the origin
  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById(canvasId),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  window.addEventListener("resize", onWindowResize);

  return { scene, camera, renderer };
}

export function getScene() {
  return scene;
}

export function getCamera() {
  return camera;
}

export function getRenderer() {
  return renderer;
}

function onWindowResize() {
  if (camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
