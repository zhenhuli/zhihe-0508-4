class FashionOutfitApp {
    constructor() {
        this.wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];
        this.savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
        this.currentOutfit = [];
        this.currentFilter = 'all';
        this.currentSeasonFilter = 'all';
        this.draggedItem = null;
        this.pendingUploads = [];
        
        this.initElements();
        this.bindEvents();
        this.renderWardrobe();
        this.renderSavedOutfits();
    }

    initElements() {
        this.uploadBtn = document.getElementById('uploadBtn');
        this.uploadModal = document.getElementById('uploadModal');
        this.uploadAreaModal = document.getElementById('uploadAreaModal');
        this.fileInputModal = document.getElementById('fileInputModal');
        this.clothingCategoryModal = document.getElementById('clothingCategoryModal');
        this.previewContainer = document.getElementById('previewContainer');
        this.confirmUploadBtn = document.getElementById('confirmUploadBtn');
        this.cancelUploadBtn = document.getElementById('cancelUploadBtn');
        this.closeUploadModal = document.getElementById('closeUploadModal');
        
        this.wardrobeGrid = document.getElementById('wardrobeGrid');
        this.outfitCanvas = document.getElementById('outfitCanvas');
        this.outfitSeason = document.getElementById('outfitSeason');
        this.clearBtn = document.getElementById('clearBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.savedGrid = document.getElementById('savedGrid');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modalBody');
        this.closeModal = document.getElementById('closeModal');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.seasonBtns = document.querySelectorAll('.season-btn');
    }

    bindEvents() {
        this.uploadBtn.addEventListener('click', () => this.openUploadModal());
        this.closeUploadModal.addEventListener('click', () => this.closeUploadModalFn());
        this.cancelUploadBtn.addEventListener('click', () => this.closeUploadModalFn());
        
        this.uploadModal.addEventListener('click', (e) => {
            if (e.target === this.uploadModal) {
                this.closeUploadModalFn();
            }
        });

        this.uploadAreaModal.addEventListener('click', () => this.fileInputModal.click());
        this.fileInputModal.addEventListener('change', (e) => this.handleFileSelect(e));
        
        this.uploadAreaModal.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadAreaModal.style.borderColor = '#764ba2';
        });
        
        this.uploadAreaModal.addEventListener('dragleave', () => {
            this.uploadAreaModal.style.borderColor = '#667eea';
        });
        
        this.uploadAreaModal.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadAreaModal.style.borderColor = '#667eea';
            this.handleFileSelect({ target: { files: e.dataTransfer.files } });
        });

        this.confirmUploadBtn.addEventListener('click', () => this.confirmUpload());

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderWardrobe();
            });
        });

        this.seasonBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.seasonBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSeasonFilter = btn.dataset.season;
                this.renderSavedOutfits();
            });
        });

        this.clearBtn.addEventListener('click', () => this.clearOutfit());
        this.saveBtn.addEventListener('click', () => this.saveOutfit());
        this.closeModal.addEventListener('click', () => this.modal.classList.remove('show'));
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove('show');
            }
        });

        this.outfitCanvas.addEventListener('dragover', (e) => e.preventDefault());
        this.outfitCanvas.addEventListener('drop', (e) => this.handleCanvasDrop(e));
    }

    openUploadModal() {
        this.pendingUploads = [];
        this.previewContainer.innerHTML = '';
        this.uploadModal.classList.add('show');
    }

    closeUploadModalFn() {
        this.uploadModal.classList.remove('show');
        this.pendingUploads = [];
        this.previewContainer.innerHTML = '';
    }

    handleFileSelect(e) {
        const files = e.target.files;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target.result;
                    this.pendingUploads.push(imageData);
                    this.renderPreview();
                };
                reader.readAsDataURL(file);
            }
        });

        this.fileInputModal.value = '';
    }

    renderPreview() {
        this.previewContainer.innerHTML = this.pendingUploads.map((image, index) => `
            <div class="preview-item">
                <img src="${image}" alt="preview">
                <button class="remove-preview" onclick="app.removePreview(${index})">&times;</button>
            </div>
        `).join('');
    }

    removePreview(index) {
        this.pendingUploads.splice(index, 1);
        this.renderPreview();
    }

    confirmUpload() {
        if (this.pendingUploads.length === 0) {
            alert('请先选择图片');
            return;
        }

        const category = this.clothingCategoryModal.value;

        this.pendingUploads.forEach(image => {
            const clothingItem = {
                id: Date.now() + Math.random(),
                image: image,
                category: category,
                uploadedAt: new Date().toISOString()
            };
            this.wardrobe.push(clothingItem);
        });

        this.saveWardrobe();
        this.renderWardrobe();
        this.closeUploadModalFn();
        alert(`成功添加 ${this.pendingUploads.length} 件衣物！`);
    }

    renderWardrobe() {
        const filteredItems = this.currentFilter === 'all' 
            ? this.wardrobe 
            : this.wardrobe.filter(item => item.category === this.currentFilter);

        if (filteredItems.length === 0) {
            this.wardrobeGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>暂无衣物，请上传图片</p>
                </div>
            `;
            return;
        }

        this.wardrobeGrid.innerHTML = filteredItems.map(item => `
            <div class="clothing-item" 
                 draggable="true" 
                 data-id="${item.id}"
                 ondragstart="app.handleDragStart(event)">
                <img src="${item.image}" alt="${item.category}">
                <button class="delete-btn" onclick="app.deleteClothing(${item.id})">&times;</button>
            </div>
        `).join('');
    }

    handleDragStart(e) {
        const itemId = parseFloat(e.target.closest('.clothing-item').dataset.id);
        this.draggedItem = this.wardrobe.find(item => item.id === itemId);
        e.dataTransfer.effectAllowed = 'copy';
    }

    handleCanvasDrop(e) {
        e.preventDefault();
        
        if (!this.draggedItem) return;

        const rect = this.outfitCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left - 75;
        const y = e.clientY - rect.top - 75;

        const outfitItem = {
            ...this.draggedItem,
            instanceId: Date.now() + Math.random(),
            x: Math.max(0, x),
            y: Math.max(0, y)
        };

        this.currentOutfit.push(outfitItem);
        this.renderOutfit();
        this.draggedItem = null;
    }

    renderOutfit() {
        const placeholder = this.outfitCanvas.querySelector('.canvas-placeholder');
        if (placeholder && this.currentOutfit.length > 0) {
            placeholder.remove();
        } else if (this.currentOutfit.length === 0 && !placeholder) {
            this.outfitCanvas.innerHTML = `
                <div class="canvas-placeholder">
                    <p>从左侧衣柜拖拽衣物到这里进行搭配</p>
                </div>
            `;
            return;
        }

        this.outfitCanvas.querySelectorAll('.outfit-item').forEach(el => el.remove());

        this.currentOutfit.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'outfit-item';
            itemEl.style.left = `${item.x}px`;
            itemEl.style.top = `${item.y}px`;
            itemEl.dataset.instanceId = item.instanceId;
            itemEl.innerHTML = `
                <img src="${item.image}" alt="outfit item">
                <button class="remove-item" onclick="app.removeOutfitItem(${item.instanceId})">&times;</button>
            `;

            this.makeDraggable(itemEl, item);
            this.outfitCanvas.appendChild(itemEl);
        });
    }

    makeDraggable(element, item) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            item.x = Math.max(0, initialX + dx);
            item.y = Math.max(0, initialY + dy);
            
            element.style.left = `${item.x}px`;
            element.style.top = `${item.y}px`;
        };

        const handleMouseUp = () => {
            isDragging = false;
            element.style.zIndex = '';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('remove-item')) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = item.x;
            initialY = item.y;
            element.style.zIndex = '100';
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        element.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    }

    removeOutfitItem(instanceId) {
        this.currentOutfit = this.currentOutfit.filter(item => item.instanceId !== instanceId);
        this.renderOutfit();
    }

    clearOutfit() {
        this.currentOutfit = [];
        this.renderOutfit();
    }

    saveOutfit() {
        if (this.currentOutfit.length === 0) {
            alert('请先添加衣物到搭配区域');
            return;
        }

        const outfit = {
            id: Date.now(),
            season: this.outfitSeason.value,
            items: this.currentOutfit.map(item => ({
                id: item.id,
                image: item.image,
                category: item.category,
                x: item.x,
                y: item.y
            })),
            createdAt: new Date().toISOString()
        };

        this.savedOutfits.unshift(outfit);
        this.saveSavedOutfits();
        this.renderSavedOutfits();
        this.clearOutfit();
        alert('搭配保存成功！');
    }

    renderSavedOutfits() {
        let filteredOutfits = this.currentSeasonFilter === 'all'
            ? this.savedOutfits
            : this.savedOutfits.filter(outfit => outfit.season === this.currentSeasonFilter);

        if (filteredOutfits.length === 0) {
            this.savedGrid.innerHTML = `
                <div class="empty-state">
                    <p>暂无保存的搭配</p>
                </div>
            `;
            return;
        }

        const seasonNames = {
            spring: '春季',
            summer: '夏季',
            autumn: '秋季',
            winter: '冬季'
        };

        this.savedGrid.innerHTML = filteredOutfits.map(outfit => `
            <div class="saved-outfit-card ${outfit.season}">
                <span class="season-badge">${seasonNames[outfit.season]}</span>
                <div class="saved-outfit-preview" onclick="app.showOutfitDetail(${outfit.id})">
                    ${outfit.items.slice(0, 6).map(item => `
                        <img src="${item.image}" alt="item">
                    `).join('')}
                </div>
                <div class="card-actions">
                    <button class="load-btn" onclick="app.loadOutfit(${outfit.id}); event.stopPropagation();">加载</button>
                    <button class="delete-outfit-btn" onclick="app.deleteOutfit(${outfit.id}); event.stopPropagation();">删除</button>
                </div>
            </div>
        `).join('');
    }

    showOutfitDetail(outfitId) {
        const outfit = this.savedOutfits.find(o => o.id === outfitId);
        if (!outfit) return;

        const seasonNames = {
            spring: '🌸 春季',
            summer: '☀️ 夏季',
            autumn: '🍂 秋季',
            winter: '❄️ 冬季'
        };

        this.modalBody.innerHTML = `
            <p style="margin-bottom: 20px; color: #666;">季节: ${seasonNames[outfit.season]}</p>
            <div class="modal-outfit-display">
                ${outfit.items.map(item => `
                    <img src="${item.image}" alt="outfit item">
                `).join('')}
            </div>
        `;

        this.modal.classList.add('show');
    }

    loadOutfit(outfitId) {
        const outfit = this.savedOutfits.find(o => o.id === outfitId);
        if (!outfit) return;

        this.outfitSeason.value = outfit.season;
        this.currentOutfit = outfit.items.map(item => ({
            ...item,
            instanceId: Date.now() + Math.random()
        }));
        this.renderOutfit();
    }

    deleteOutfit(outfitId) {
        if (confirm('确定要删除这个搭配吗？')) {
            this.savedOutfits = this.savedOutfits.filter(o => o.id !== outfitId);
            this.saveSavedOutfits();
            this.renderSavedOutfits();
        }
    }

    deleteClothing(clothingId) {
        if (confirm('确定要删除这件衣物吗？')) {
            this.wardrobe = this.wardrobe.filter(item => item.id !== clothingId);
            this.saveWardrobe();
            this.renderWardrobe();
        }
    }

    saveWardrobe() {
        localStorage.setItem('wardrobe', JSON.stringify(this.wardrobe));
    }

    saveSavedOutfits() {
        localStorage.setItem('savedOutfits', JSON.stringify(this.savedOutfits));
    }
}

const app = new FashionOutfitApp();
