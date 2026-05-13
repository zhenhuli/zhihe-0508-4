class MorphAnimation {
    constructor(containerId, shapes) {
        this.container = document.getElementById(containerId);
        this.shapes = shapes;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.animationId = null;
        this.duration = 800;
    }

    createSVG(gradientId, colors) {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 100 100');
        this.svg.setAttribute('width', '100');
        this.svg.setAttribute('height', '100');

        this.shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.shape.setAttribute('fill', `url(#${gradientId})`);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        colors.forEach((color, i) => {
            const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop.setAttribute('offset', `${(i / (colors.length - 1)) * 100}%`);
            stop.setAttribute('stop-color', color);
            gradient.appendChild(stop);
        });

        defs.appendChild(gradient);
        this.svg.appendChild(defs);
        this.svg.appendChild(this.shape);
        this.container.appendChild(this.svg);

        this.shape.setAttribute('d', this.shapes[0]);
    }

    parsePath(d) {
        const commands = d.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
        const points = [];
        
        commands.forEach(cmd => {
            const type = cmd[0];
            const nums = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
            
            if (type === 'M' || type === 'L') {
                for (let i = 0; i < nums.length; i += 2) {
                    points.push({ x: nums[i], y: nums[i + 1] });
                }
            } else if (type === 'C') {
                for (let i = 0; i < nums.length; i += 6) {
                    points.push({ x: nums[i + 4], y: nums[i + 5] });
                }
            }
        });
        
        return points;
    }

    normalizePoints(points, targetCount) {
        const result = [];
        const totalLength = this.getPointsLength(points);
        
        for (let i = 0; i < targetCount; i++) {
            const ratio = i / (targetCount - 1);
            const point = this.getPointAtLength(points, totalLength * ratio);
            result.push(point);
        }
        
        return result;
    }

    getPointsLength(points) {
        let length = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    getPointAtLength(points, targetLength) {
        let currentLength = 0;
        
        for (let i = 0; i < points.length - 1; i++) {
            const dx = points[i + 1].x - points[i].x;
            const dy = points[i + 1].y - points[i].y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            
            if (currentLength + segmentLength >= targetLength) {
                const ratio = (targetLength - currentLength) / segmentLength;
                return {
                    x: points[i].x + dx * ratio,
                    y: points[i].y + dy * ratio
                };
            }
            currentLength += segmentLength;
        }
        
        return points[points.length - 1];
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    interpolatePoints(points1, points2, t) {
        return points1.map((p1, i) => ({
            x: p1.x + (points2[i].x - p1.x) * t,
            y: p1.y + (points2[i].y - p1.y) * t
        }));
    }

    pointsToPath(points) {
        if (points.length === 0) return '';
        
        let d = `M${points[0].x},${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            d += ` L${points[i].x},${points[i].y}`;
        }
        
        d += ' Z';
        return d;
    }

    morphTo(targetIndex) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const startTime = performance.now();
        const fromPoints = this.parsePath(this.shapes[this.currentIndex]);
        const toPoints = this.parsePath(this.shapes[targetIndex]);
        
        const pointCount = Math.max(fromPoints.length, toPoints.length, 30);
        const normalizedFrom = this.normalizePoints(fromPoints, pointCount);
        const normalizedTo = this.normalizePoints(toPoints, pointCount);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / this.duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            
            const interpolated = this.interpolatePoints(normalizedFrom, normalizedTo, easedProgress);
            this.shape.setAttribute('d', this.pointsToPath(interpolated));
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.currentIndex = targetIndex;
                this.isAnimating = false;
                this.animationId = null;
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }
}

export class CircleSquare {
    constructor(containerId) {
        this.shapes = [
            'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
            'M50,10 L65,20 L80,35 L90,50 L80,65 L65,80 L50,90 L35,80 L20,65 L10,50 L20,35 L35,20 Z'
        ];
        this.morph = new MorphAnimation(containerId, this.shapes);
        this.morph.createSVG('morphGradient1', ['#667eea', '#764ba2']);
        this.isCircle = true;
    }

    toggle() {
        this.isCircle = !this.isCircle;
        this.morph.morphTo(this.isCircle ? 0 : 1);
    }
}

export class StarHeart {
    constructor(containerId) {
        this.shapes = [
            'M50,10 L61,40 L95,40 L68,60 L79,90 L50,72 L21,90 L32,60 L5,40 L39,40 Z',
            'M50,85 C20,60 5,40 15,25 C25,10 45,15 50,30 C55,15 75,10 85,25 C95,40 80,60 50,85 Z'
        ];
        this.morph = new MorphAnimation(containerId, this.shapes);
        this.morph.createSVG('morphGradient2', ['#f093fb', '#f5576c']);
        this.isStar = true;
    }

    toggle() {
        this.isStar = !this.isStar;
        this.morph.morphTo(this.isStar ? 0 : 1);
    }
}

export class MultiMorph {
    constructor(containerId) {
        this.shapes = [
            'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z',
            'M50,10 L61,40 L95,40 L68,60 L79,90 L50,72 L21,90 L32,60 L5,40 L39,40 Z',
            'M50,85 C20,60 5,40 15,25 C25,10 45,15 50,30 C55,15 75,10 85,25 C95,40 80,60 50,85 Z',
            'M50,10 L90,50 L50,90 L10,50 Z',
            'M20,20 L80,20 L80,80 L20,80 Z'
        ];
        this.morph = new MorphAnimation(containerId, this.shapes);
        this.morph.createSVG('morphGradient3', ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe']);
        this.currentIndex = 0;
    }

    toggle() {
        const nextIndex = (this.currentIndex + 1) % this.shapes.length;
        this.morph.morphTo(nextIndex);
        this.currentIndex = nextIndex;
    }
}
