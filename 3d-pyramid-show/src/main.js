import './style.css';
import * as THREE from 'three';
import SceneManager from './core/Scene';
import CameraManager from './core/Camera';
import RendererManager from './core/Renderer';
import Pyramid from './objects/Pyramid';
import OrbitControlsManager from './controls/OrbitControls';
import ViewController from './controls/ViewController';
import AnnotationManager from './annotations/AnnotationManager';
import RaycasterManager from './utils/Raycaster';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const canvas = document.querySelector('canvas.webgl');
if (!canvas) {
  const newCanvas = document.createElement('canvas');
  newCanvas.className = 'webgl';
  document.body.appendChild(newCanvas);
}

const sceneManager = new SceneManager();
const cameraManager = new CameraManager(sizes);
const rendererManager = new RendererManager(
  document.querySelector('canvas.webgl'),
  sizes
);
const orbitControlsManager = new OrbitControlsManager(
  cameraManager.getCamera(),
  document.querySelector('canvas.webgl')
);

const pyramid = new Pyramid();
sceneManager.add(pyramid.getGroup());

const viewController = new ViewController(
  cameraManager.getCamera(),
  orbitControlsManager.getControls()
);

const annotationManager = new AnnotationManager();

const raycasterManager = new RaycasterManager(
  cameraManager.getCamera(),
  pyramid.getLayers()
);

raycasterManager.setOnClickCallback((object) => {
  if (object.userData && object.userData.name) {
    pyramid.highlightLayer(object.userData.id);
    annotationManager.showLayerInfo(object.userData);
  }
});

function createViewControls() {
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'view-controls';
  controlsContainer.innerHTML = `
    <h3>视角切换</h3>
    <div class="button-group">
      <button data-view="front">正面</button>
      <button data-view="back">背面</button>
      <button data-view="left">左面</button>
      <button data-view="right">右面</button>
      <button data-view="top">俯视</button>
      <button data-view="perspective">透视</button>
    </div>
  `;
  document.body.appendChild(controlsContainer);

  const buttons = controlsContainer.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      viewController.switchToView(view);
    });
  });
}

createViewControls();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  cameraManager.updateAspectRatio(sizes);
  rendererManager.resize(sizes);
});

document.querySelector('canvas.webgl').addEventListener('click', (event) => {
  raycasterManager.handleClick(event);
});

function animate() {
  requestAnimationFrame(animate);
  orbitControlsManager.update();
  rendererManager.render(
    sceneManager.getScene(),
    cameraManager.getCamera()
  );
}

animate();
