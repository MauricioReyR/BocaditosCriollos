// ===== HERO SLIDER MEJORADO =====
class HeroSlider {
    constructor() {
        this.images = [
            'images/Arepas_huevo_Trisafica.jpg',
            'images/Combo_Arepas.jpg',
            'images/Combo_valluno.jpg',
            'images/Pipian.jpg',
            'images/Vegetarianas.jpg'
        ];
        
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.intervalId = null;
        this.config = {
            interval: 4000,
            transitionDuration: 500,
            pauseOnHover: true
        };
        
        this.init();
    }
    
    init() {
        this.imageElement = document.querySelector('#hero-slider-img');
        if (!this.imageElement) {
            console.warn('Hero slider: Elemento de imagen no encontrado');
            return;
        }
        
        this.setupPreloading();
        this.setupEventListeners();
        this.startSlider();
        
        console.log('🖼️ Hero slider inicializado con', this.images.length, 'imágenes');
    }
    
    setupPreloading() {
        // Precargar todas las imágenes para transiciones suaves
        this.images.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Imagen precargada: ${src}`);
            };
            img.onerror = () => {
                console.warn(`Error cargando imagen: ${src}`);
                // Remover imagen problemática del array
                this.images = this.images.filter(imgSrc => imgSrc !== src);
            };
            img.src = src;
        });
    }
    
    setupEventListeners() {
        // Pausar en hover si está configurado
        if (this.config.pauseOnHover) {
            this.imageElement.addEventListener('mouseenter', () => this.pause());
            this.imageElement.addEventListener('mouseleave', () => this.resume());
        }
        
        // Pausar cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Control manual con teclado (accesibilidad)
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.hero')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextImage();
                }
            }
        });
        
        // Soporte para gestos táctiles
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.imageElement.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        this.imageElement.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            endY = e.changedTouches[0].screenY;
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: true });
    }
    
    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Solo procesar swipes horizontales significativos
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousImage(); // Swipe right = imagen anterior
            } else {
                this.nextImage(); // Swipe left = siguiente imagen
            }
        }
    }
    
    showImage(index) {
        if (this.isTransitioning || !this.images[index]) {
            return;
        }
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Crear nueva imagen para transición suave
        const newImg = new Image();
        newImg.onload = () => {
            this.transitionToNewImage(newImg.src);
        };
        newImg.onerror = () => {
            console.warn(`Error mostrando imagen: ${this.images[index]}`);
            this.isTransitioning = false;
        };
        newImg.src = this.images[index];
    }
    
    transitionToNewImage(newSrc) {
        if (!this.imageElement) return;
        
        // Aplicar efecto fade
        this.imageElement.style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;
        this.imageElement.style.opacity = '0';
        
        setTimeout(() => {
            this.imageElement.src = newSrc;
            this.imageElement.style.opacity = '1';
            
            // Limpiar transición después de completar
            setTimeout(() => {
                this.imageElement.style.transition = '';
                this.isTransitioning = false;
                
                // Anunciar cambio para lectores de pantalla
                this.announceImageChange();
            }, this.config.transitionDuration);
            
        }, this.config.transitionDuration / 2);
    }
    
    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex);
        
        // Reiniciar timer automático
        this.resetTimer();
    }
    
    previousImage() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex);
        
        // Reiniciar timer automático
        this.resetTimer();
    }
    
    startSlider() {
        this.showImage(0); // Mostrar primera imagen
        this.intervalId = setInterval(() => {
            this.nextImage();
        }, this.config.interval);
    }
    
    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    resume() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.nextImage();
            }, this.config.interval);
        }
    }
    
    resetTimer() {
        this.pause();
        this.resume();
    }
    
    announceImageChange() {
        // Anunciar cambio para accesibilidad
        const imageNumber = this.currentIndex + 1;
        const totalImages = this.images.length;
        
        if (typeof window.announceToScreenReader === 'function') {
            window.announceToScreenReader(`Imagen ${imageNumber} de ${totalImages}`);
        }
    }
    
    // Método público para controles externos
    goToImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.showImage(index);
            this.resetTimer();
        }
    }
    
    // Método para agregar controles de navegación
    addNavigationControls() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        // Crear contenedor de controles
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'hero-slider-controls';
        controlsContainer.style.cssText = `
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            z-index: 10;
        `;
        
        // Botón anterior
        const prevBtn = this.createControlButton('‹', 'Imagen anterior', () => this.previousImage());
        
        // Indicadores de puntos
        const indicators = this.createIndicators();
        
        // Botón siguiente
        const nextBtn = this.createControlButton('›', 'Siguiente imagen', () => this.nextImage());
        
        controlsContainer.appendChild(prevBtn);
        controlsContainer.appendChild(indicators);
        controlsContainer.appendChild(nextBtn);
        
        heroSection.appendChild(controlsContainer);
        
        // Actualizar indicadores cuando cambie la imagen
        this.onImageChange = () => this.updateIndicators();
    }
    
    createControlButton(text, ariaLabel, onClick) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.setAttribute('aria-label', ariaLabel);
        button.style.cssText = `
            background: rgba(255, 255, 255, 0.8);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        button.addEventListener('click', onClick);
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(212, 175, 55, 0.9)';
            button.style.color = 'white';
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.8)';
            button.style.color = 'inherit';
            button.style.transform = 'scale(1)';
        });
        
        return button;
    }
    
    createIndicators() {
        const container = document.createElement('div');
        container.className = 'slider-indicators';
        container.style.cssText = `
            display: flex;
            gap: 0.5rem;
            align-items: center;
        `;
        
        this.images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid rgba(255, 255, 255, 0.8);
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            indicator.addEventListener('click', () => this.goToImage(index));
            
            container.appendChild(indicator);
        });
        
        this.indicators = container.querySelectorAll('button');
        return container;
    }
    
    updateIndicators() {
        if (!this.indicators) return;
        
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.style.background = 'rgba(212, 175, 55, 1)';
                indicator.style.borderColor = 'rgba(212, 175, 55, 1)';
                indicator.style.transform = 'scale(1.2)';
            } else {
                indicator.style.background = 'transparent';
                indicator.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                indicator.style.transform = 'scale(1)';
            }
        });
    }
    
    // Método para destruir el slider (cleanup)
    destroy() {
        this.pause();
        
        // Remover event listeners
        if (this.imageElement) {
            this.imageElement.removeEventListener('mouseenter', () => this.pause());
            this.imageElement.removeEventListener('mouseleave', () => this.resume());
        }
        
        document.removeEventListener('visibilitychange', () => {});
        document.removeEventListener('keydown', () => {});
        
        // Limpiar referencias
        this.imageElement = null;
        this.indicators = null;
        
        console.log('🖼️ Hero slider destruido');
    }
    
    // Configuración dinámica
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Reiniciar con nueva configuración
        this.resetTimer();
    }
    
    // Método para agregar nuevas imágenes dinámicamente
    addImages(newImages) {
        if (Array.isArray(newImages)) {
            this.images.push(...newImages);
            this.setupPreloading(); // Precargar nuevas imágenes
            
            // Recrear indicadores si existen
            if (this.indicators) {
                const controlsContainer = document.querySelector('.hero-slider-controls');
                if (controlsContainer) {
                    controlsContainer.remove();
                    this.addNavigationControls();
                }
            }
        }
    }
    
    // Obtener información del estado actual
    getState() {
        return {
            currentIndex: this.currentIndex,
            totalImages: this.images.length,
            isPlaying: !!this.intervalId,
            isTransitioning: this.isTransitioning
        };
    }
}

// ===== SISTEMA DE SLIDERS MÚLTIPLES =====
class MultiSliderManager {
    constructor() {
        this.sliders = new Map();
        this.init();
    }
    
    init() {
        // Buscar todos los elementos que necesiten slider
        this.initHeroSlider();
        this.initCarouselSliders();
    }
    
    initHeroSlider() {
        const heroImage = document.querySelector('#hero-slider-img');
        if (heroImage) {
            const heroSlider = new HeroSlider();
            
            // Agregar controles si está en la página principal
            if (document.querySelector('.hero')) {
                heroSlider.addNavigationControls();
            }
            
            this.sliders.set('hero', heroSlider);
        }
    }
    
    initCarouselSliders() {
        const carousels = document.querySelectorAll('.card-carousel');
        
        carousels.forEach((carousel, index) => {
            const slider = new CarouselSlider(carousel);
            this.sliders.set(`carousel-${index}`, slider);
        });
    }
    
    getSlider(id) {
        return this.sliders.get(id);
    }
    
    pauseAll() {
        this.sliders.forEach(slider => {
            if (typeof slider.pause === 'function') {
                slider.pause();
            }
        });
    }
    
    resumeAll() {
        this.sliders.forEach(slider => {
            if (typeof slider.resume === 'function') {
                slider.resume();
            }
        });
    }
}

// ===== SLIDER DE CARRUSEL MEJORADO =====
class CarouselSlider {
    constructor(element) {
        this.container = element;
        this.images = Array.from(element.querySelectorAll('.carousel-img'));
        this.currentIndex = 0;
        this.intervalId = null;
        this.config = {
            interval: 3000,
            autoplay: true
        };
        
        this.init();
    }
    
    init() {
        if (this.images.length === 0) return;
        
        this.setupControls();
        if (this.config.autoplay) {
            this.startAutoplay();
        }
        
        // Pausar en hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.resume());
    }
    
    setupControls() {
        const prevBtn = this.container.querySelector('.carousel-btn.prev');
        const nextBtn = this.container.querySelector('.carousel-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }
    }
    
    showImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        // Ocultar imagen actual
        this.images[this.currentIndex].classList.remove('active');
        
        // Mostrar nueva imagen
        this.currentIndex = index;
        this.images[this.currentIndex].classList.add('active');
    }
    
    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex);
        this.resetTimer();
    }
    
    previousImage() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(prevIndex);
        this.resetTimer();
    }
    
    startAutoplay() {
        this.intervalId = setInterval(() => {
            this.nextImage();
        }, this.config.interval);
    }
    
    pause() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    resume() {
        if (!this.intervalId && this.config.autoplay) {
            this.startAutoplay();
        }
    }
    
    resetTimer() {
        this.pause();
        this.resume();
    }
}

// ===== SISTEMA DE LAZY LOADING PARA SLIDERS =====
class SliderLazyLoader {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        this.init();
    }
    
    init() {
        const lazySliderImages = document.querySelectorAll('.carousel-img[data-src], #hero-slider-img[data-src]');
        lazySliderImages.forEach(img => {
            this.observer.observe(img);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
}

// ===== CONTROL DE RENDIMIENTO =====
class SliderPerformanceMonitor {
    constructor() {
        this.metrics = {
            transitionTimes: [],
            loadTimes: [],
            errors: 0
        };
    }
    
    recordTransitionTime(startTime, endTime) {
        const duration = endTime - startTime;
        this.metrics.transitionTimes.push(duration);
        
        // Mantener solo las últimas 10 mediciones
        if (this.metrics.transitionTimes.length > 10) {
            this.metrics.transitionTimes.shift();
        }
    }
    
    recordLoadTime(loadTime) {
        this.metrics.loadTimes.push(loadTime);
        
        if (this.metrics.loadTimes.length > 10) {
            this.metrics.loadTimes.shift();
        }
    }
    
    recordError() {
        this.metrics.errors++;
    }
    
    getAverageTransitionTime() {
        const times = this.metrics.transitionTimes;
        return times.length > 0 ? times.reduce((a, b) => a + b) / times.length : 0;
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            averageTransitionTime: this.getAverageTransitionTime()
        };
    }
}

// ===== INICIALIZACIÓN Y GESTIÓN GLOBAL =====
let sliderManager = null;
let performanceMonitor = null;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Inicializando sistema de sliders...');
    
    // Crear instancias globales
    sliderManager = new MultiSliderManager();
    performanceMonitor = new SliderPerformanceMonitor();
    
    // Inicializar lazy loading para sliders
    if ('IntersectionObserver' in window) {
        new SliderLazyLoader();
    }
    
    // Configurar controles globales
    setupGlobalSliderControls();
    
    console.log('✅ Sistema de sliders inicializado correctamente');
});

function setupGlobalSliderControls() {
    // Control global de reproducción/pausa con espaciador
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            toggleAllSliders();
        }
    });
    
    // Pausar todos los sliders cuando la ventana pierde el foco
    window.addEventListener('blur', () => {
        sliderManager?.pauseAll();
    });
    
    // Reanudar cuando recupera el foco
    window.addEventListener('focus', () => {
        sliderManager?.resumeAll();
    });
}

function toggleAllSliders() {
    if (!sliderManager) return;
    
    const heroSlider = sliderManager.getSlider('hero');
    if (heroSlider) {
        const isPlaying = heroSlider.getState().isPlaying;
        if (isPlaying) {
            sliderManager.pauseAll();
            if (window.notifications) {
                window.notifications.show('Sliders pausados', 'info', 2000);
            }
        } else {
            sliderManager.resumeAll();
            if (window.notifications) {
                window.notifications.show('Sliders reanudados', 'success', 2000);
            }
        }
    }
}

// ===== FUNCIONES EXPORTADAS PARA COMPATIBILIDAD =====
function moveCarousel(btn, direction) {
    const carousel = btn.closest('.card-carousel');
    const sliderIndex = Array.from(document.querySelectorAll('.card-carousel')).indexOf(carousel);
    const slider = sliderManager?.getSlider(`carousel-${sliderIndex}`);
    
    if (slider) {
        if (direction > 0) {
            slider.nextImage();
        } else {
            slider.previousImage();
        }
    }
}

// Exportar funciones para uso global
window.moveCarousel = moveCarousel;
window.toggleAllSliders = toggleAllSliders;
window.sliderManager = sliderManager;

// ===== CLEANUP AL CERRAR LA PÁGINA =====
window.addEventListener('beforeunload', function() {
    if (sliderManager) {
        sliderManager.pauseAll();
    }
    
    if (performanceMonitor) {
        const metrics = performanceMonitor.getMetrics();
        console.log('📊 Métricas de rendimiento de sliders:', metrics);
    }
});