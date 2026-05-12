import * as THREE from 'three';

class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.initLights();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.5, 100);
    pointLight.position.set(-5, 5, -5);
    this.scene.add(pointLight);
  }

  add(object) {
    this.scene.add(object);
  }

  getScene() {
    return this.scene;
  }
}

export default SceneManager;
