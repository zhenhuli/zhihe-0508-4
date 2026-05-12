import * as THREE from 'three';

class RaycasterManager {
  constructor(camera, objects) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.objects = objects;
    this.onClickCallback = null;
  }

  setOnClickCallback(callback) {
    this.onClickCallback = callback;
  }

  handleClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects);

    if (intersects.length > 0 && this.onClickCallback) {
      this.onClickCallback(intersects[0].object);
    }
  }

  updateObjects(objects) {
    this.objects = objects;
  }
}

export default RaycasterManager;
