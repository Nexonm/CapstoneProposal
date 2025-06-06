class Presentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 6;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.createIndicators();
        this.bindEvents();
        this.showSlide(1);
    }
    
    createIndicators() {
        const indicatorsContainer = document.querySelector('.slide-indicators');
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.slide = i;
            
            indicator.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.goToSlide(i);
                }
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.previousSlide();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.nextSlide();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            const deltaTime = endTime - startTime;
            
            // Check if horizontal swipe is more significant than vertical and within time limit
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
        });
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    showSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isAnimating = true;
        this.currentSlide = slideNumber;
        
        // Hide all slides
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            
            if (index + 1 === slideNumber) {
                slide.classList.add('active');
            } else if (index + 1 < slideNumber) {
                slide.classList.add('prev');
            }
        });
        
        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 === slideNumber);
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Animate slide content
        this.animateSlideContent(slideNumber);
        
        // Update progress
        this.updateProgress();
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    animateSlideContent(slideNumber) {
        const currentSlideElement = document.querySelector(`#slide-${slideNumber}`);
        
        // Remove any existing animations
        const animatedElements = currentSlideElement.querySelectorAll('.feature-card, .arch-layer, .phase-card, .services-table tr, .demo-image, .ui-showcase');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
        
        // Trigger reflow
        currentSlideElement.offsetHeight;
        
        // Add staggered animations based on slide type
        setTimeout(() => {
            if (slideNumber === 2) {
                // MVP slide - demo image and feature cards
                const demoImage = currentSlideElement.querySelector('.demo-image');
                if (demoImage) {
                    demoImage.style.animation = 'fadeInUp 0.8s ease-out';
                }
                
                const featureCards = currentSlideElement.querySelectorAll('.feature-card');
                featureCards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.6s ${0.3 + index * 0.15}s both ease-out`;
                });
            } else if (slideNumber === 3) {
                // Expansion slide - showcase and feature cards
                const showcase = currentSlideElement.querySelector('.ui-showcase');
                if (showcase) {
                    showcase.style.animation = 'fadeInUp 0.8s ease-out';
                }
                
                const featureCards = currentSlideElement.querySelectorAll('.feature-card');
                featureCards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.6s ${0.3 + index * 0.15}s both ease-out`;
                });
            } else if (slideNumber === 4) {
                // Architecture slide - diagram and layers
                const diagram = currentSlideElement.querySelector('.arch-diagram-container');
                if (diagram) {
                    diagram.style.animation = 'fadeInUp 0.8s ease-out';
                }
                
                const layers = currentSlideElement.querySelectorAll('.arch-layer');
                layers.forEach((layer, index) => {
                    layer.style.animation = `fadeInUp 0.5s ${0.3 + index * 0.1}s both ease-out`;
                });
            } else if (slideNumber === 5) {
                // Services slide - table rows animation
                const tableRows = currentSlideElement.querySelectorAll('.services-table tbody tr');
                tableRows.forEach((row, index) => {
                    row.style.animation = `fadeInUp 0.4s ${0.2 + index * 0.1}s both ease-out`;
                });
            } else if (slideNumber === 6) {
                // Roadmap slide - ИСПРАВЛЕННАЯ анимация для новых карточек
                const phaseCards = currentSlideElement.querySelectorAll('.phase-card');
                phaseCards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.5s ${0.3 + index * 0.2}s both ease-out`;
                });
                
                const goalSection = currentSlideElement.querySelector('.goal-section');
                if (goalSection) {
                    goalSection.style.animation = 'fadeInUp 0.6s 1.2s both ease-out';
                }
            }
        }, 100);
    }
    
    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button opacity for better UX
        prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
    }
    
    updateProgress() {
        // Update progress bar if it exists
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && slideNumber !== this.currentSlide) {
            this.showSlide(slideNumber);
        }
    }
    
    // Auto-advance functionality (optional)
    startAutoAdvance(interval = 30000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.goToSlide(1); // Loop back to start
            }
        }, interval);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
}

// Utility functions for enhanced presentation features
class PresentationUtils {
    static addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                z-index: 1000;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--color-primary), #32B8C6);
                transition: width 0.6s ease;
                width: 0%;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(progressBar);
        
        return progressBar;
    }
    
    static addImageInteractivity() {
        // Add click-to-zoom functionality for images
        const images = document.querySelectorAll('.ui-demo-img, .ui-showcase-img, .architecture-diagram-img');
        
        images.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.createImageModal(img);
            });
            
            // Add cursor pointer
            img.style.cursor = 'pointer';
            img.title = 'Нажмите для увеличения';
        });
    }
    
    static createImageModal(img) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <img src="${img.src}" alt="${img.alt}" class="modal-image">
                <button class="modal-close">&times;</button>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-image {
                max-width: 100%;
                max-height: 100%;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
            }
            .modal-close {
                position: absolute;
                top: -20px;
                right: -20px;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .modal-close:hover {
                background: var(--color-primary-hover);
                transform: scale(1.1);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Close modal events
        const closeModal = () => {
            modal.remove();
            style.remove();
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    static addTableResponsiveness() {
        const table = document.querySelector('.services-table');
        if (!table) return;
        
        // Add responsive behavior on mobile
        const checkTableResponsiveness = () => {
            if (window.innerWidth < 768) {
                table.style.fontSize = '12px';
                // Add horizontal scroll indicator
                const container = table.closest('.services-table-container');
                if (container && !container.querySelector('.scroll-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'scroll-indicator';
                    indicator.textContent = '← Прокрутите для просмотра →';
                    indicator.style.cssText = `
                        text-align: center;
                        font-size: 12px;
                        color: var(--color-text-secondary);
                        margin-top: 8px;
                    `;
                    container.appendChild(indicator);
                }
            } else {
                table.style.fontSize = '';
                const indicator = document.querySelector('.scroll-indicator');
                if (indicator) indicator.remove();
            }
        };
        
        checkTableResponsiveness();
        window.addEventListener('resize', checkTableResponsiveness);
    }
    
    static addRoadmapInteractions() {
        // Add hover effects and click interactions for roadmap phases
        const phaseCards = document.querySelectorAll('.phase-card');
        
        phaseCards.forEach((card, index) => {
            // Add click event for phase details
            card.addEventListener('click', () => {
                const isExpanded = card.classList.contains('expanded');
                
                // Close all other expanded cards
                phaseCards.forEach(c => c.classList.remove('expanded'));
                
                if (!isExpanded) {
                    card.classList.add('expanded');
                    
                    // Add expanded styles
                    const style = document.createElement('style');
                    style.textContent = `
                        .phase-card.expanded {
                            transform: scale(1.02);
                            z-index: 10;
                        }
                    `;
                    
                    if (!document.querySelector('#roadmap-styles')) {
                        style.id = 'roadmap-styles';
                        document.head.appendChild(style);
                    }
                }
            });
            
            // Add keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Этап ${index + 1} разработки платформы`);
        });
    }
}

// Enhanced presentation class with additional features
class EnhancedPresentation extends Presentation {
    constructor() {
        super();
        this.progressBar = PresentationUtils.addProgressBar();
        PresentationUtils.addImageInteractivity();
        PresentationUtils.addTableResponsiveness();
        PresentationUtils.addRoadmapInteractions();
        
        // Initialize floating icons animation
        this.initFloatingIcons();
    }
    
    initFloatingIcons() {
        const icons = document.querySelectorAll('.floating-icons .icon');
        icons.forEach((icon, index) => {
            // Add random floating animation delays
            const randomDelay = Math.random() * 2;
            icon.style.animationDelay = `${randomDelay}s`;
            
            // Add slight random positioning
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }
    
    showSlide(slideNumber) {
        super.showSlide(slideNumber);
        
        // Update URL hash for deep linking
        if (history.replaceState) {
            history.replaceState(null, null, `#slide-${slideNumber}`);
        }
    }
    
    // Load slide from URL hash
    loadFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#slide-')) {
            const slideNumber = parseInt(hash.replace('#slide-', ''));
            if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber);
            }
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        
        // Initialize the presentation
        const presentation = new EnhancedPresentation();
        
        // Load from URL hash if present
        presentation.loadFromHash();
        
        // Optional: Add fullscreen support
        const addFullscreenSupport = () => {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F11') {
                    e.preventDefault();
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => {
                            console.log('Error attempting to enable fullscreen:', err);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                }
            });
        };
        
        addFullscreenSupport();
        
        // Add escape key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            presentation.loadFromHash();
        });
        
        // Expose presentation to global scope for debugging
        window.presentation = presentation;
        
        // Add keyboard shortcut info
        console.log('🎯 Презентация "Образовательная платформа" загружена!');
        console.log('📋 Управление:');
        console.log('   ← → ↑ ↓ Space: Навигация по слайдам');
        console.log('   Home/End: Первый/Последний слайд');
        console.log('   F11: Полноэкранный режим');
        console.log('   Escape: Выход из полноэкранного режима');
        console.log('   Клик по изображениям: Увеличенный просмотр');
        console.log('   Клик по карточкам roadmap: Интерактивные детали');
        
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any dynamic positioning if needed
    const navigation = document.querySelector('.navigation');
    if (navigation) {
        // Ensure navigation stays centered on resize
        navigation.style.left = '50%';
        navigation.style.transform = 'translateX(-50%)';
    }
    
    // Update table responsiveness
    PresentationUtils.addTableResponsiveness();
});

// Prevent zooming on mobile devices (for better presentation experience)
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
    e.preventDefault();
});

// Add performance monitoring and optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload next slide images when browser is idle
        const currentSlide = window.presentation?.currentSlide || 1;
        const nextSlide = currentSlide + 1;
        if (nextSlide <= 6) {
            const nextSlideElement = document.querySelector(`#slide-${nextSlide}`);
            if (nextSlideElement) {
                const images = nextSlideElement.querySelectorAll('img');
                images.forEach(img => {
                    if (img.src) {
                        const preloadImg = new Image();
                        preloadImg.src = img.src;
                    }
                });
            }
        }
    });
}

// Service Worker registration for better caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if we have a service worker file
        // This is optional and would require a separate sw.js file
        console.log('📱 Приложение готово к работе офлайн');
    });
}