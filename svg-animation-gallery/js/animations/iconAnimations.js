export class MenuIcon {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        const colors = ['#667eea', '#764ba2', '#f093fb'];
        this.lines = [];

        for (let i = 0; i < 3; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '20');
            line.setAttribute('y1', `${30 + i * 20}`);
            line.setAttribute('x2', '80');
            line.setAttribute('y2', `${30 + i * 20}`);
            line.setAttribute('stroke', colors[i]);
            line.setAttribute('stroke-width', '6');
            line.setAttribute('stroke-linecap', 'round');
            line.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            this.svg.appendChild(line);
            this.lines.push(line);
        }

        this.container.appendChild(this.svg);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.lines[0].setAttribute('y1', '50');
            this.lines[0].setAttribute('y2', '50');
            this.lines[0].setAttribute('transform', 'rotate(45, 50, 50)');
            
            this.lines[1].setAttribute('opacity', '0');
            
            this.lines[2].setAttribute('y1', '50');
            this.lines[2].setAttribute('y2', '50');
            this.lines[2].setAttribute('transform', 'rotate(-45, 50, 50)');
        } else {
            this.lines[0].setAttribute('y1', '30');
            this.lines[0].setAttribute('y2', '30');
            this.lines[0].setAttribute('transform', '');
            
            this.lines[1].setAttribute('opacity', '1');
            
            this.lines[2].setAttribute('y1', '70');
            this.lines[2].setAttribute('y2', '70');
            this.lines[2].setAttribute('transform', '');
        }
    }
}

export class HeartIcon {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        this.heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.heart.setAttribute('d', 'M50,85 C20,60 5,40 15,25 C25,10 45,15 50,30 C55,15 75,10 85,25 C95,40 80,60 50,85 Z');
        this.heart.setAttribute('fill', 'url(#heartGradient)');
        this.heart.style.transformOrigin = 'center';
        this.heart.style.transition = 'transform 0.3s ease';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'heartGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#ff6b6b');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#ee5a5a');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);
        this.svg.appendChild(this.heart);

        this.container.appendChild(this.svg);
    }

    toggle() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        let scale = 1;
        let direction = 1;
        let beatCount = 0;

        const animate = () => {
            scale += direction * 0.08;
            
            if (scale >= 1.3) {
                direction = -1;
            } else if (scale <= 1) {
                direction = 1;
                beatCount++;
                if (beatCount >= 2) {
                    this.heart.style.transform = 'scale(1)';
                    this.isAnimating = false;
                    return;
                }
            }

            this.heart.style.transform = `scale(${scale})`;
            requestAnimationFrame(animate);
        };

        animate();
    }
}

export class LoadingIcon {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isLoading = false;
        this.animationId = null;
        this.init();
    }

    init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        this.circles = [];
        const colors = ['#667eea', '#764ba2', '#f093fb', '#667eea'];
        const positions = [
            { cx: 30, cy: 50 },
            { cx: 50, cy: 50 },
            { cx: 70, cy: 50 },
            { cx: 90, cy: 50 }
        ];

        positions.forEach((pos, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.cx);
            circle.setAttribute('cy', pos.cy);
            circle.setAttribute('r', '8');
            circle.setAttribute('fill', colors[i]);
            circle.style.transition = 'all 0.3s ease';
            this.svg.appendChild(circle);
            this.circles.push({ element: circle, baseX: pos.cx - 50, baseY: 0 });
        });

        this.container.appendChild(this.svg);
    }

    toggle() {
        this.isLoading = !this.isLoading;

        if (this.isLoading) {
            this.startAnimation();
        } else {
            this.stopAnimation();
        }
    }

    startAnimation() {
        let time = 0;

        const animate = () => {
            if (!this.isLoading) return;

            time += 0.15;

            this.circles.forEach((circle, i) => {
                const offset = (i * Math.PI) / 2;
                const y = Math.sin(time + offset) * 15;
                circle.element.setAttribute('cy', 50 + y);
                
                const scale = 0.7 + Math.sin(time + offset) * 0.3 + 0.3;
                circle.element.setAttribute('r', 6 + Math.sin(time + offset) * 3);
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

        this.circles.forEach((circle, i) => {
            circle.element.setAttribute('cy', '50');
            circle.element.setAttribute('r', '8');
        });
    }
}
