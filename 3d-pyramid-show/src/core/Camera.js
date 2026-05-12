import * as THREE from 'three';

class CameraManager {
  constructor(sizes) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 3, 8);
  }

  updateAspectRatio(sizes) {
    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();
  }

  getCamera() {
    return this.camera;
  }

  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }
}

export default CameraManager;
