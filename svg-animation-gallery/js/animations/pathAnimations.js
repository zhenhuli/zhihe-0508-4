export class PathDraw {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isDrawn = false;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 200 150');
        this.svg.setAttribute('width', '180');
        this.svg.setAttribute('height', '135');

        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('d', 'M20,75 Q50,20 100,75 T180,75 L180,120 L20,120 Z');
        this.path.setAttribute('fill', 'none');
        this.path.setAttribute('stroke', 'url(#drawGradient)');
        this.path.setAttribute('stroke-width', '4');
        this.path.setAttribute('stroke-linecap', 'round');
        this.path.setAttribute('stroke-linejoin', 'round');

        const length = this.path.getTotalLength();
        this.path.style.strokeDasharray = length;
        this.path.style.strokeDashoffset = length;
        this.path.style.transition = 'stroke-dashoffset 1s ease-in-out';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'drawGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#667eea');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#764ba2');

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#f093fb');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);
        this.svg.appendChild(this.path);

        this.container.appendChild(this.svg);
    }

    toggle() {
        this.isDrawn = !this.isDrawn;
        const length = this.path.getTotalLength();
        this.path.style.strokeDashoffset = this.isDrawn ? 0 : length;
    }
}

export class PathFollow {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 200 150');
        this.svg.setAttribute('width', '180');
        this.svg.setAttribute('height', '135');

        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('d', 'M20,75 Q50,20 100,75 T180,75');
        this.path.setAttribute('fill', 'none');
        this.path.setAttribute('stroke', '#e2e8f0');
        this.path.setAttribute('stroke-width', '3');
        this.path.setAttribute('stroke-dasharray', '8,4');

        this.follower = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.follower.setAttribute('r', '12');
        this.follower.setAttribute('fill', 'url(#followerGradient)');
        this.follower.style.filter = 'drop-shadow(0 4px 6px rgba(102, 126, 234, 0.4))';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', 'followerGradient');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#f093fb');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#667eea');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);
        this.svg.appendChild(this.path);
        this.svg.appendChild(this.follower);

        this.container.appendChild(this.svg);

        const startPoint = this.path.getPointAtLength(0);
        this.follower.setAttribute('cx', startPoint.x);
        this.follower.setAttribute('cy', startPoint.y);
    }

    toggle() {
        this.isRunning = !this.isRunning;

        if (this.isRunning) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        const length = this.path.getTotalLength();
        let progress = 0;

        const animate = () => {
            if (!this.isRunning) return;

            progress += 0.008;
            if (progress > 1) progress = 0;

            const point = this.path.getPointAtLength(progress * length);
            this.follower.setAttribute('cx', point.x);
            this.follower.setAttribute('cy', point.y);

            const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
            this.follower.setAttribute('r', 12 * scale);

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

export class PathWave {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 200 150');
        this.svg.setAttribute('width', '180');
        this.svg.setAttribute('height', '135');

        this.waves = [];
        const colors = ['#667eea', '#764ba2', '#f093fb'];
        const opacities = [0.8, 0.6, 0.4];

        colors.forEach((color, i) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', color);
            path.setAttribute('stroke-width', '3');
            path.setAttribute('stroke-linecap', 'round');
            path.style.opacity = opacities[i];
            this.svg.appendChild(path);
            this.waves.push({ element: path, offset: i * 0.5 });
        });

        this.container.appendChild(this.svg);
        this.updateWaves(0);
    }

    updateWaves(time) {
        this.waves.forEach((wave, index) => {
            let d = 'M0,' + (75 + index * 15);
            for (let x = 0; x <= 200; x += 5) {
                const y = 75 + index * 15 + Math.sin((x + time * 50) * 0.05 + wave.offset) * 20;
                d += ` L${x},${y}`;
            }
            wave.element.setAttribute('d', d);
        });
    }

    toggle() {
        this.isRunning = !this.isRunning;

        if (this.isRunning) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        let time = 0;

        const animate = () => {
            if (!this.isRunning) return;

            time += 0.05;
            this.updateWaves(time);

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}
