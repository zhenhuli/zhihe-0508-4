import * as THREE from 'three';

class Pyramid {
  constructor() {
    this.group = new THREE.Group();
    this.layers = [];
    this.createLayers();
    this.createBase();
  }

  createLayers() {
    const layerData = [
      { size: 4, height: 0.8, y: 0, color: 0xc9a22c, name: '基座层', description: '金字塔的基础结构，承载全部重量' },
      { size: 3.2, height: 0.8, y: 0.8, color: 0xd4af37, name: '下层', description: '主要承重区域，石块最大' },
      { size: 2.4, height: 0.8, y: 1.6, color: 0xe6c84a, name: '中层', description: '过渡区域，石块尺寸逐渐减小' },
      { size: 1.6, height: 0.8, y: 2.4, color: 0xf0d860, name: '上层', description: '接近顶部，装饰性增强' },
      { size: 0.8, height: 0.8, y: 3.2, color: 0xffe66b, name: '顶端', description: '金字塔尖顶，象征权力中心' }
    ];

    layerData.forEach((data, index) => {
      const geometry = new THREE.ConeGeometry(data.size, data.height, 4);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.3,
        roughness: 0.7,
        flatShading: true
      });
      const layer = new THREE.Mesh(geometry, material);
      layer.position.y = data.y + data.height / 2;
      layer.rotation.y = Math.PI / 4;
      layer.castShadow = true;
      layer.receiveShadow = true;
      layer.userData = { 
        id: index,
        name: data.name, 
        description: data.description,
        originalColor: data.color
      };
      this.layers.push(layer);
      this.group.add(layer);
    });
  }

  createBase() {
    const geometry = new THREE.BoxGeometry(5, 0.2, 5);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3d3d3d,
      metalness: 0.5,
      roughness: 0.5
    });
    const base = new THREE.Mesh(geometry, material);
    base.position.y = -0.1;
    base.receiveShadow = true;
    this.group.add(base);
  }

  getGroup() {
    return this.group;
  }

  getLayers() {
    return this.layers;
  }

  highlightLayer(index) {
    this.layers.forEach((layer, i) => {
      if (i === index) {
        layer.material.emissive = new THREE.Color(0xffffff);
        layer.material.emissiveIntensity = 0.2;
      } else {
        layer.material.emissive = new THREE.Color(0x000000);
        layer.material.emissiveIntensity = 0;
      }
    });
  }

  resetHighlight() {
    this.layers.forEach(layer => {
      layer.material.emissive = new THREE.Color(0x000000);
      layer.material.emissiveIntensity = 0;
    });
  }
}

export default Pyramid;
