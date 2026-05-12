class ViewController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.views = {
      front: { x: 0, y: 3, z: 8 },
      back: { x: 0, y: 3, z: -8 },
      left: { x: -8, y: 3, z: 0 },
      right: { x: 8, y: 3, z: 0 },
      top: { x: 0, y: 10, z: 0.1 },
      perspective: { x: 5, y: 5, z: 5 }
    };
  }

  switchToView(viewName) {
    const view = this.views[viewName];
    if (view) {
      this.camera.position.set(view.x, view.y, view.z);
      this.controls.target.set(0, 2, 0);
      this.controls.update();
    }
  }
}

export default ViewController;
