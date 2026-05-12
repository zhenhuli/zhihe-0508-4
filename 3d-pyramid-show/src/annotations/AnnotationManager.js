class AnnotationManager {
  constructor() {
    this.infoPanel = null;
    this.initInfoPanel();
  }

  initInfoPanel() {
    this.infoPanel = document.createElement('div');
    this.infoPanel.className = 'info-panel';
    this.infoPanel.innerHTML = `
      <h3>金字塔分层信息</h3>
      <div class="layer-info">
        <p class="no-selection">请点击金字塔图层查看详情</p>
      </div>
    `;
    document.body.appendChild(this.infoPanel);
  }

  showLayerInfo(layerData) {
    const infoContent = this.infoPanel.querySelector('.layer-info');
    infoContent.innerHTML = `
      <div class="layer-card">
        <h4>${layerData.name}</h4>
        <p class="description">${layerData.description}</p>
        <div class="layer-meta">
          <span class="meta-item">层级: ${layerData.id + 1}/5</span>
        </div>
      </div>
    `;
  }

  resetInfo() {
    const infoContent = this.infoPanel.querySelector('.layer-info');
    infoContent.innerHTML = '<p class="no-selection">请点击金字塔图层查看详情</p>';
  }
}

export default AnnotationManager;
