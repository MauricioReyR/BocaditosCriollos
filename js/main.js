// ===== CONFIGURACIÓN Y VARIABLES GLOBALES =====
const CONFIG = {
    telefono: '573138513658',
    animationDuration: 300,
    scrollOffset: 80,
    carouselInterval: 4000,
    lazyLoadRootMargin: '50px'
};

// Variables del DOM
let navbar, hamburger, navMenu, navLinks;

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍴 Bocaditos Criollos - Iniciando aplicación...');
    
    initializeElements();
    initializeFeatures();
    showWelcomeMessage();
});

// ===== INICIALIZACIÓN DE ELEMENTOS DOM =====
function initializeElements() {
    navbar = document.querySelector('.navbar');
    hamburger = document.getElementById('hamburger');
    navMenu = document.getElementById('nav-menu');
    navLinks = document.querySelectorAll('.nav-link');
}

// ===== INICIALIZACIÓN DE FUNCIONALIDADES =====
function initializeFeatures() {
    initSmoothScroll();
    initMobileMenu();
    initScrollEffects();
    initScrollAnimations();
    initLazyLoading();
    initCardEffects();
    initErrorHandling();
    initAccessibilityFeatures();
    
    // Funcionalidades condicionales
    if (window.innerWidth > 768) {
        initParallaxEffects();
    }
    
    // Eventos optimizados
    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(handleResize, 250));
}

// ===== NAVEGACIÓN SUAVE MEJORADA =====
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si es enlace a otra página, permitir navegación normal
            if (href.includes('.html')) {
                return;
            }
            
            // Si es ancla en la misma página
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    smoothScrollTo(targetSection, CONFIG.scrollOffset);
                    closeMobileMenu();
                    updateActiveLink(this);
                }
            }
        });
    });
}

// ===== SCROLL SUAVE OPTIMIZADO =====
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ===== MENÚ MÓVIL MEJORADO =====
function initMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    if (!navbar) return;
    
    // Efecto navbar al hacer scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));
}

function handleScroll() {
    updateActiveNavOnScroll();
    revealElementsOnScroll();
}

// ===== ACTUALIZACIÓN DE ENLACE ACTIVO =====
function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + CONFIG.scrollOffset + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            correspondingLink?.classList.add('active');
        }
    });
}

// ===== ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const animatedElements = document.querySelectorAll(`
        .combo-card, .info-card, .timeline-item, .footer-section,
        .menu-bebidas-card, .hero-text, .hero-image
    `);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function revealElementsOnScroll() {
    const elements = document.querySelectorAll('.fade-in:not(.visible)');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// ===== LAZY LOADING MEJORADO =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('lazy-loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: CONFIG.lazyLoadRootMargin
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sin IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ===== EFECTOS DE TARJETAS =====
function initCardEffects() {
    const cards = document.querySelectorAll('.combo-card, .info-card, .menu-bebidas-card');
    
    cards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Efecto de clic con ripple
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(212, 175, 55, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// CSS para animación ripple
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// ===== CONTACTAR WHATSAPP MEJORADO =====
function contactarWhatsApp(producto = '', precio = '') {
    let mensaje = '¡Hola! Me interesa conocer más sobre Bocaditos Criollos 🍴';
    
    if (producto) {
        mensaje = `¡Hola! Me interesa el *${producto}*`;
        if (precio) {
            mensaje += ` por ${precio}`;
        }
        mensaje += ' de Bocaditos Criollos 🍴';
    }
    
    const url = `https://wa.me/${CONFIG.telefono}?text=${encodeURIComponent(mensaje)}`;
    
    // Analytics tracking
    trackEvent('whatsapp_contact', {
        producto: producto || 'general',
        precio: precio || 'no_price'
    });
    
    window.open(url, '_blank');
}

// ===== EFECTOS PARALLAX =====
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, 16));
}

// ===== SISTEMA DE NOTIFICACIONES =====
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'success', duration = 4000) {
        const notification = document.createElement('div');
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            background: ${colors[type] || colors.success};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 500;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        notification.textContent = message;
        this.container.appendChild(notification);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remover
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        return notification;
    }
}

const notifications = new NotificationSystem();

// ===== MANEJO DE ERRORES GLOBAL =====
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.error);
        notifications.show('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise rechazada:', e.reason);
        notifications.show('Error de conexión. Verifica tu internet.', 'warning');
        e.preventDefault();
    });
}

// ===== CARACTERÍSTICAS DE ACCESIBILIDAD =====
function initAccessibilityFeatures() {
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Anuncios para lectores de pantalla
    const srAnnouncer = document.createElement('div');
    srAnnouncer.setAttribute('aria-live', 'polite');
    srAnnouncer.setAttribute('aria-atomic', 'true');
    srAnnouncer.className = 'sr-only';
    document.body.appendChild(srAnnouncer);
    
    window.announceToScreenReader = function(message) {
        srAnnouncer.textContent = message;
        setTimeout(() => srAnnouncer.textContent = '', 1000);
    };
}

// ===== UTILIDADES DE RENDIMIENTO =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== SISTEMA DE ANALYTICS BÁSICO =====
function trackEvent(eventName, eventData = {}) {
    // Integración con Google Analytics si está disponible
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            ...eventData,
            timestamp: new Date().toISOString(),
            page_location: window.location.href
        });
    }
    
    // Log para desarrollo
    console.log(`📊 Evento: ${eventName}`, eventData);
}

// ===== GESTIÓN DE COOKIES Y PREFERENCIAS =====
const CookieManager = {
    set: function(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },
    
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    delete: function(name) {
        this.set(name, '', -1);
    }
};

// ===== DETECTOR DE DISPOSITIVO =====
const DeviceDetector = {
    isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: () => /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent),
    isDesktop: () => !DeviceDetector.isMobile() && !DeviceDetector.isTablet(),
    
    getViewportSize: () => ({
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    })
};

// ===== MANEJADOR DE REDIMENSIONAMIENTO =====
function handleResize() {
    const viewport = DeviceDetector.getViewportSize();
    
    // Ajustar comportamiento según tamaño de pantalla
    if (viewport.width <= 768) {
        closeMobileMenu();
    }
    
    // Reajustar elementos que dependen del tamaño
    updateResponsiveElements();
    
    // Notificar cambio de orientación en móviles
    if (DeviceDetector.isMobile()) {
        announceToScreenReader('Orientación de pantalla cambiada');
    }
}

function updateResponsiveElements() {
    const cards = document.querySelectorAll('.combo-card');
    const viewport = DeviceDetector.getViewportSize();
    
    // Ajustar grid de tarjetas según el tamaño de pantalla
    if (viewport.width <= 480) {
        cards.forEach(card => {
            card.style.margin = '0 auto';
            card.style.maxWidth = '100%';
        });
    }
}

// ===== SISTEMA DE COMPARTIR EN REDES SOCIALES =====
function shareOnSocial(platform, text = '', url = '') {
    const currentUrl = url || window.location.href;
    const shareText = text || 'Descubre los mejores bocaditos criollos en Bogotá 🍴';
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    };
    
    if (shareUrls[platform]) {
        const shareWindow = window.open(
            shareUrls[platform], 
            '_blank', 
            'width=600,height=400,scrollbars=yes,resizable=yes'
        );
        
        trackEvent('social_share', { platform, url: currentUrl });
        
        // Verificar si la ventana se cerró (compartido exitoso)
        if (shareWindow) {
            const checkClosed = setInterval(() => {
                if (shareWindow.closed) {
                    clearInterval(checkClosed);
                    notifications.show(`Compartido en ${platform}!`, 'success');
                }
            }, 1000);
        }
    } else {
        notifications.show('Plataforma no soportada', 'error');
    }
}

// ===== SISTEMA DE FAVORITOS LOCAL =====
const FavoritesManager = {
    key: 'bocaditos-favoritos',
    
    getFavorites: function() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch (e) {
            return [];
        }
    },
    
    addFavorite: function(comboId, comboData) {
        const favorites = this.getFavorites();
        if (!favorites.find(fav => fav.id === comboId)) {
            favorites.push({
                id: comboId,
                ...comboData,
                dateAdded: new Date().toISOString()
            });
            localStorage.setItem(this.key, JSON.stringify(favorites));
            notifications.show('Combo añadido a favoritos!', 'success');
            this.updateFavoriteButtons();
        }
    },
    
    removeFavorite: function(comboId) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(fav => fav.id !== comboId);
        localStorage.setItem(this.key, JSON.stringify(favorites));
        notifications.show('Combo removido de favoritos', 'info');
        this.updateFavoriteButtons();
    },
    
    isFavorite: function(comboId) {
        return this.getFavorites().some(fav => fav.id === comboId);
    },
    
    updateFavoriteButtons: function() {
        const cards = document.querySelectorAll('.combo-card');
        cards.forEach((card, index) => {
            const comboId = `combo-${index}`;
            const isFav = this.isFavorite(comboId);
            let favBtn = card.querySelector('.favorite-btn');
            const cardImage = card.querySelector('.card-image');
            if (!cardImage) return; // Solo agregar botón si existe .card-image
            if (!favBtn) {
                favBtn = document.createElement('button');
                favBtn.className = 'favorite-btn';
                favBtn.innerHTML = '<i class="fas fa-heart"></i>';
                favBtn.style.cssText = `
                    position: absolute;
                    top: 1rem;
                    left: 1rem;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                `;
                cardImage.appendChild(favBtn);
                favBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const title = card.querySelector('.card-title').textContent;
                    const price = card.querySelector('.card-price').textContent;
                    if (this.isFavorite(comboId)) {
                        this.removeFavorite(comboId);
                    } else {
                        this.addFavorite(comboId, { title, price });
                    }
                });
            }
            favBtn.style.color = isFav ? '#ef4444' : '#6b7280';
            favBtn.style.transform = isFav ? 'scale(1.1)' : 'scale(1)';
        });
    }
};

// ===== MODO OFFLINE =====
function initOfflineMode() {
    window.addEventListener('online', function() {
        notifications.show('Conexión restablecida', 'success');
        document.body.classList.remove('offline');
        syncOfflineActions();
    });
    
    window.addEventListener('offline', function() {
        notifications.show('Sin conexión a internet. Funcionando en modo offline', 'warning', 6000);
        document.body.classList.add('offline');
    });
    
    // Service Worker para cache offline (si está disponible)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registrado con éxito:', registration.scope);
                })
                .catch(function(registrationError) {
                    console.log('Error al registrar SW:', registrationError);
                });
        });
    }
}

function syncOfflineActions() {
    const offlineActions = JSON.parse(localStorage.getItem('offline-actions') || '[]');
    
    if (offlineActions.length > 0) {
        console.log('Sincronizando acciones offline:', offlineActions);
        
        // Procesar acciones pendientes
        offlineActions.forEach(action => {
            if (action.type === 'whatsapp_contact') {
                // Reabrir WhatsApp si es necesario
                trackEvent('whatsapp_contact_synced', action.data);
            }
        });
        
        localStorage.removeItem('offline-actions');
    }
}

// ===== VALIDACIONES DE FORMULARIO =====
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Ingresa un email válido');
    }
    
    if (!formData.message || formData.message.length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    return errors;
}

// ===== SISTEMA DE CALIFICACIONES =====
const RatingSystem = {
    rate: function(comboId, rating) {
        const ratings = JSON.parse(localStorage.getItem('combo-ratings') || '{}');
        ratings[comboId] = {
            rating: rating,
            date: new Date().toISOString()
        };
        localStorage.setItem('combo-ratings', JSON.stringify(ratings));
        notifications.show(`¡Gracias por tu calificación de ${rating} estrellas!`, 'success');
        trackEvent('combo_rating', { comboId, rating });
    },
    
    getRating: function(comboId) {
        const ratings = JSON.parse(localStorage.getItem('combo-ratings') || '{}');
        return ratings[comboId]?.rating || 0;
    },
    
    addRatingStars: function() {
        const cards = document.querySelectorAll('.combo-card');
        cards.forEach((card, index) => {
            const comboId = `combo-${index}`;
            const currentRating = this.getRating(comboId);
            
            const starsContainer = document.createElement('div');
            starsContainer.className = 'rating-stars';
            starsContainer.style.cssText = `
                display: flex;
                gap: 2px;
                margin-top: 0.5rem;
                justify-content: center;
            `;
            
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.innerHTML = '★';
                star.style.cssText = `
                    cursor: pointer;
                    font-size: 1.2rem;
                    color: ${i <= currentRating ? '#fbbf24' : '#d1d5db'};
                    transition: color 0.2s ease;
                `;
                
                star.addEventListener('click', () => this.rate(comboId, i));
                star.addEventListener('mouseenter', () => this.highlightStars(starsContainer, i));
                star.addEventListener('mouseleave', () => this.highlightStars(starsContainer, currentRating));
                
                starsContainer.appendChild(star);
            }
            
            card.querySelector('.card-content').appendChild(starsContainer);
        });
    },
    
    highlightStars: function(container, rating) {
        const stars = container.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.style.color = index < rating ? '#fbbf24' : '#d1d5db';
        });
    }
};

// ===== CALCULADORA DE PEDIDOS =====
const OrderCalculator = {
    items: [],
    
    addItem: function(name, price) {
        const existingItem = this.items.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: name,
                price: parseFloat(price.replace(/[^\d]/g, '')),
                quantity: 1
            });
        }
        this.updateDisplay();
        notifications.show(`${name} añadido al carrito`, 'success');
    },
    
    removeItem: function(name) {
        this.items = this.items.filter(item => item.name !== name);
        this.updateDisplay();
    },
    
    getTotal: function() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateDisplay: function() {
        let cartButton = document.querySelector('.cart-button');
        if (!cartButton) {
            cartButton = this.createCartButton();
        }
        
        const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
        cartButton.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">${itemCount}</span>
        `;
        
        cartButton.style.display = itemCount > 0 ? 'flex' : 'none';
    },
    
    createCartButton: function() {
        const button = document.createElement('button');
        button.className = 'cart-button';
        button.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 30px;
            background: var(--primary-gold);
            color: white;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: var(--shadow-heavy);
            z-index: 999;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        `;
        
        button.addEventListener('click', () => this.showCart());
        document.body.appendChild(button);
        return button;
    },
    
    showCart: function() {
        if (this.items.length === 0) {
            notifications.show('El carrito está vacío', 'info');
            return;
        }
        
        const cartSummary = this.items.map(item => 
            `${item.quantity}x ${item.name} - ${item.price * item.quantity}`
        ).join('\n');
        
        const total = this.getTotal();
        const message = `Mi pedido:\n${cartSummary}\n\nTotal: ${total}`;
        
        contactarWhatsApp('Pedido personalizado', `${total}`, message);
    }
};

// ===== FUNCIONES EXPORTADAS GLOBALMENTE =====
window.contactarWhatsApp = contactarWhatsApp;
window.shareOnSocial = shareOnSocial;
window.notifications = notifications;
window.FavoritesManager = FavoritesManager;
window.OrderCalculator = OrderCalculator;
window.RatingSystem = RatingSystem;

// ===== INICIALIZACIÓN ADICIONAL PARA PÁGINAS ESPECÍFICAS =====
function initPageSpecificFeatures() {
    // Para página de combos
    if (document.querySelector('.combos-section')) {
        FavoritesManager.updateFavoriteButtons();
        RatingSystem.addRatingStars();
    }
    
    // Para página principal
    if (document.querySelector('.hero')) {
        initHeroEffects();
    }
}

function initHeroEffects() {
    const heroImage = document.querySelector('#hero-slider-img');
    if (heroImage) {
        // El slider ya está manejado por hero-slider.js
        return;
    }
}

// ===== MENSAJE DE BIENVENIDA =====
function showWelcomeMessage() {
    setTimeout(() => {
        console.log(`
🍴 ¡Bienvenido a Bocaditos Criollos! 
✨ Sitio web desarrollado con las mejores prácticas
🚀 Versión optimizada con mejoras en:
   • Navegación mejorada
   • Diseño responsivo
   • Rendimiento optimizado
   • Accesibilidad mejorada
   • Experiencia de usuario premium
        `);
        
        trackEvent('page_loaded', {
            page_title: document.title,
            page_location: window.location.href,
            user_agent: navigator.userAgent,
            viewport: DeviceDetector.getViewportSize()
        });
    }, 1000);
}

// ===== INICIALIZACIÓN FINAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar características adicionales después de la carga principal
    setTimeout(() => {
        initOfflineMode();
        initPageSpecificFeatures();
    }, 100);
    
    // Precargar recursos críticos
    preloadCriticalResources();
});

function preloadCriticalResources() {
    const criticalImages = [
        'images/Logo.jpg',
        'images/Combo_Arepas.jpg',
        'images/Pipian.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}