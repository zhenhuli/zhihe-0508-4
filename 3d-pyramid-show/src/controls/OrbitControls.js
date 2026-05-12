import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class OrbitControlsManager {
  constructor(camera, canvas) {
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
  }

  update() {
    this.controls.update();
  }

  reset() {
    this.controls.reset();
  }

  getControls() {
    return this.controls;
  }
}

export default OrbitControlsManager;
