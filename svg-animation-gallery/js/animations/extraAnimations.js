export class SpinnerAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        this.circles = [];
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
        const radii = [35, 30, 25, 20, 15];

        colors.forEach((color, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '50');
            circle.setAttribute('cy', '50');
            circle.setAttribute('r', radii[i]);
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', color);
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('stroke-linecap', 'round');
            this.svg.appendChild(circle);
            this.circles.push({ element: circle, offset: i * 0.3, radius: radii[i] });
        });

        this.container.appendChild(this.svg);
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

            time += 0.08;

            this.circles.forEach((circle, i) => {
                const progress = (time + circle.offset) % 1;
                const dashLength = circle.radius * Math.PI * 2 * 0.3;
                const dashOffset = -circle.radius * Math.PI * 2 * progress;
                circle.element.setAttribute('stroke-dasharray', `${dashLength} ${circle.radius * Math.PI * 2 - dashLength}`);
                circle.element.setAttribute('stroke-dashoffset', dashOffset);
            });

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

export class PulseAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        this.rings = [];
        const colors = ['#667eea', '#764ba2', '#f093fb'];

        for (let i = 0; i < 3; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '50');
            circle.setAttribute('cy', '50');
            circle.setAttribute('r', '15');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', colors[i]);
            circle.setAttribute('stroke-width', '3');
            circle.style.opacity = '0.8';
            this.svg.appendChild(circle);
            this.rings.push({ element: circle, delay: i * 0.3 });
        }

        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        center.setAttribute('cx', '50');
        center.setAttribute('cy', '50');
        center.setAttribute('r', '15');
        center.setAttribute('fill', 'url(#pulseGradient)');
        this.svg.appendChild(center);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', 'pulseGradient');

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

        this.container.appendChild(this.svg);
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

            time += 0.03;

            this.rings.forEach((ring) => {
                const progress = ((time + ring.delay) % 1);
                const scale = 1 + progress * 1.5;
                const opacity = 0.8 * (1 - progress);
                
                ring.element.setAttribute('r', 15 * scale);
                ring.element.style.opacity = opacity;
            });

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.rings.forEach((ring) => {
            ring.element.setAttribute('r', '15');
            ring.element.style.opacity = '0.8';
        });
    }
}

export class ProgressAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isAnimating = false;
        this.animationId = null;
        this.progress = 0;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 200 100');
        this.svg.setAttribute('width', '160');
        this.svg.setAttribute('height', '80');

        const bgBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgBar.setAttribute('x', '10');
        bgBar.setAttribute('y', '40');
        bgBar.setAttribute('width', '180');
        bgBar.setAttribute('height', '20');
        bgBar.setAttribute('rx', '10');
        bgBar.setAttribute('fill', '#e2e8f0');
        this.svg.appendChild(bgBar);

        this.progressBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.progressBar.setAttribute('x', '10');
        this.progressBar.setAttribute('y', '40');
        this.progressBar.setAttribute('width', '0');
        this.progressBar.setAttribute('height', '20');
        this.progressBar.setAttribute('rx', '10');
        this.progressBar.setAttribute('fill', 'url(#progressGradient)');
        this.svg.appendChild(this.progressBar);

        this.progressText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        this.progressText.setAttribute('x', '100');
        this.progressText.setAttribute('y', '75');
        this.progressText.setAttribute('text-anchor', 'middle');
        this.progressText.setAttribute('fill', '#667eea');
        this.progressText.setAttribute('font-size', '14');
        this.progressText.setAttribute('font-weight', 'bold');
        this.progressText.textContent = '0%';
        this.svg.appendChild(this.progressText);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'progressGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#667eea');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#f093fb');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);

        this.container.appendChild(this.svg);
    }

    toggle() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const startTime = performance.now();
        const startProgress = this.progress;
        const targetProgress = this.progress >= 100 ? 0 : 100;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const duration = 1500;
            let t = Math.min(elapsed / duration, 1);
            
            const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            this.progress = startProgress + (targetProgress - startProgress) * easeT;
            
            this.progressBar.setAttribute('width', (this.progress / 100) * 180);
            this.progressText.textContent = `${Math.round(this.progress)}%`;

            if (t < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                this.animationId = null;
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }
}

export class ParticleExplosion {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isAnimating = false;
        this.particles = [];
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#f5576c'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('cx', '50');
            particle.setAttribute('cy', '50');
            particle.setAttribute('r', '3');
            particle.setAttribute('fill', colors[i % colors.length]);
            particle.style.opacity = '0';
            this.svg.appendChild(particle);
            this.particles.push({
                element: particle,
                angle: (i / 20) * Math.PI * 2,
                speed: 1.5 + Math.random() * 1.5
            });
        }

        const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        center.setAttribute('cx', '50');
        center.setAttribute('cy', '50');
        center.setAttribute('r', '8');
        center.setAttribute('fill', 'url(#particleGradient)');
        this.svg.appendChild(center);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
        gradient.setAttribute('id', 'particleGradient');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ffffff');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#667eea');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);

        this.container.appendChild(this.svg);
    }

    toggle() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let time = 0;
        const duration = 60;

        const animate = () => {
            time++;
            const progress = time / duration;
            const eased = progress < 0.5 ? 8 * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 4) / 2;

            this.particles.forEach((particle) => {
                const distance = eased * 40 * particle.speed;
                const x = 50 + Math.cos(particle.angle) * distance;
                const y = 50 + Math.sin(particle.angle) * distance;
                const opacity = Math.max(0, 1 - eased * 1.2);
                const scale = 1 - eased * 0.5;

                particle.element.setAttribute('cx', x);
                particle.element.setAttribute('cy', y);
                particle.element.setAttribute('r', 3 * scale);
                particle.element.style.opacity = opacity;
            });

            if (time < duration) {
                requestAnimationFrame(animate);
            } else {
                this.particles.forEach((particle) => {
                    particle.element.setAttribute('cx', '50');
                    particle.element.setAttribute('cy', '50');
                    particle.element.setAttribute('r', '3');
                    particle.element.style.opacity = '0';
                });
                this.isAnimating = false;
            }
        };

        animate();
    }
}

export class ToggleSwitch {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOn = false;
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 60');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '60');

        this.track = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        this.track.setAttribute('x', '10');
        this.track.setAttribute('y', '18');
        this.track.setAttribute('width', '80');
        this.track.setAttribute('height', '24');
        this.track.setAttribute('rx', '12');
        this.track.setAttribute('fill', '#cbd5e0');
        this.svg.appendChild(this.track);

        this.knob = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.knob.setAttribute('cx', '28');
        this.knob.setAttribute('cy', '30');
        this.knob.setAttribute('r', '14');
        this.knob.setAttribute('fill', '#ffffff');
        this.knob.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
        this.svg.appendChild(this.knob);

        this.container.appendChild(this.svg);
    }

    toggle() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.isOn = !this.isOn;

        const startTime = performance.now();
        const startX = this.isOn ? 28 : 72;
        const endX = this.isOn ? 72 : 28;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const duration = 300;
            let t = Math.min(elapsed / duration, 1);
            
            const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            
            const x = startX + (endX - startX) * easeT;
            this.knob.setAttribute('cx', x);

            if (this.isOn) {
                const r = Math.round(203 - easeT * 137);
                const g = Math.round(213 - easeT * 141);
                const b = Math.round(224 - easeT * 86);
                this.track.setAttribute('fill', `rgb(${r}, ${g}, ${b})`);
            } else {
                const r = Math.round(66 + easeT * 137);
                const g = Math.round(72 + easeT * 141);
                const b = Math.round(138 + easeT * 86);
                this.track.setAttribute('fill', `rgb(${r}, ${g}, ${b})`);
            }

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };

        requestAnimationFrame(animate);
    }
}
