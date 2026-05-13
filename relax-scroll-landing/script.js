document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const sectionBgs = document.querySelectorAll('.section-bg');
    const sectionContents = document.querySelectorAll('.section-content');
    
    let currentSectionIndex = -1;
    let ticking = false;
    
    function updateParallax(scrollY, sectionBg, speed) {
        const layers = sectionBg.querySelectorAll('[class*="bg-"]');
        layers.forEach((layer, index) => {
            const layerSpeed = speed * (0.3 + index * 0.1);
            layer.style.transform = `translateY(${scrollY * layerSpeed}px)`;
        });
    }
    
    function handleScroll() {
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        let maxCenterDistance = -Infinity;
        let newCurrentIndex = -1;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionCenter = sectionTop + section.offsetHeight / 2;
            const viewportCenter = scrollY + windowHeight / 2;
            
            const distanceToCenter = Math.abs(sectionCenter - viewportCenter);
            const centerDistance = -distanceToCenter;
            
            if (sectionTop <= scrollY + windowHeight && sectionBottom >= scrollY) {
                if (centerDistance > maxCenterDistance) {
                    maxCenterDistance = centerDistance;
                    newCurrentIndex = index;
                }
            }
            
            const content = sectionContents[index];
            const sectionBg = sectionBgs[index];
            
            const visibleStart = sectionTop - windowHeight * 0.3;
            const visibleEnd = sectionBottom - windowHeight * 0.7;
            
            const enterProgress = Math.max(0, Math.min(1, (scrollY - visibleStart) / (windowHeight * 0.5)));
            const exitProgress = Math.max(0, Math.min(1, (scrollY - visibleEnd) / (windowHeight * 0.5)));
            const overallProgress = enterProgress * (1 - exitProgress);
            
            if (content) {
                const opacity = overallProgress;
                const translateY = 60 * (1 - overallProgress);
                content.style.opacity = opacity;
                content.style.transform = `translateY(${translateY}px)`;
            }
            
            if (sectionBg) {
                const bgProgress = Math.max(0, Math.min(1, 1 - Math.abs(sectionCenter - viewportCenter) / (windowHeight * 0.8)));
                sectionBg.style.opacity = bgProgress;
                sectionBg.style.zIndex = Math.round(bgProgress * 10);
                
                if (bgProgress > 0.1) {
                    const parallaxOffset = (scrollY - sectionTop) * 0.1;
                    updateParallax(parallaxOffset, sectionBg, 0.5);
                }
            }
        });
        
        if (newCurrentIndex !== currentSectionIndex && newCurrentIndex !== -1) {
            currentSectionIndex = newCurrentIndex;
        }
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    handleScroll();
    
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    window.addEventListener('resize', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
});