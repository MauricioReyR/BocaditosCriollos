// ===== VARIABLES GLOBALES =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// ===== NAVEGACIÓN SUAVE =====
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                // Actualizar enlace activo
                updateActiveLink(this);
            }
        });
    });
}

// ===== ACTUALIZAR ENLACE ACTIVO =====
function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// ===== NAVBAR AL HACER SCROLL =====
// showDailyPromo eliminado

// ===== ANIMACIONES AL HACER SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const animatedElements = document.querySelectorAll(
        '.combo-card, .info-card, .timeline-item, .footer-section'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== CONTACTAR WHATSAPP =====
function contactarWhatsApp(producto = '') {
    const telefono = '573138513658';
    let mensaje = '¡Hola! Me interesa conocer más sobre Bocaditos Criollos 🍴';
    
    if (producto) {
        mensaje = `¡Hola! Me interesa el ${producto} de Bocaditos Criollos 🍴`;
    }
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// ===== LAZY LOADING PARA IMÁGENES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== CONTADOR DE VISITAS (LOCAL) =====
function initVisitCounter() {
    let visits = localStorage.getItem('bocaditos-visits') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('bocaditos-visits', visits);
    
    console.log(`¡Bienvenido a Bocaditos Criollos! Visita número: ${visits}`);
}

// ===== LOADING SPINNER =====
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 248, 220, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 5px solid #D4AF37;
                border-top: 5px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(spinner);
    
    // Remover spinner después de 2 segundos
    setTimeout(() => {
        spinner.remove();
    }, 2000);
}

// ===== EFECTOS DE HOVER EN TARJETAS =====
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.combo-card, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== VALIDACIÓN DE FORMULARIOS =====
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

// ===== NOTIFICACIONES TOAST =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animación de entrada
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== PRELOADER =====
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.getElementById('loading-spinner');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 300);
        }
    });
}

// ===== ANIMACIÓN DE NÚMEROS CONTADOR =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// ===== PARALLAX SUAVE =====
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// ===== DETECCIÓN DE DISPOSITIVO MÓVIL =====
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// ===== MANEJO DE ERRORES GLOBAL =====
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.error);
        // En producción, aquí enviarías el error a un servicio de logging
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise rechazada:', e.reason);
        e.preventDefault();
    });
}

// ===== MODO OFFLINE =====
function initOfflineMode() {
    window.addEventListener('online', function() {
        showToast('Conexión restablecida', 'success');
        document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', function() {
        showToast('Sin conexión a internet', 'warning');
        document.body.classList.add('offline');
    });
}

// ===== COMPARTIR EN REDES SOCIALES =====
function shareOnSocial(platform, text = '', url = '') {
    const currentUrl = url || window.location.href;
    const shareText = text || 'Descubre los mejores bocaditos criollos en Bogotá 🍴';
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ===== ANÁLITICAS BÁSICAS =====
function trackEvent(eventName, eventData = {}) {
    // Aquí puedes integrar con Google Analytics, Facebook Pixel, etc.
    console.log(`Evento: ${eventName}`, eventData);
    
    // Ejemplo de integración con Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// ===== COOKIES Y PREFERENCIAS =====
function setCookie(name, value, days = 30) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// ===== INICIALIZAR TODO AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍴 Bocaditos Criollos - Sitio Web Cargado');
    
    // Mostrar spinner de carga
    showLoadingSpinner();
    
    // Inicializar funcionalidades
    initSmoothScroll();
    handleNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initLazyLoading();
    initCardHoverEffects();
    initErrorHandling();
    initOfflineMode();
    
    // Funcionalidades opcionales
    if (window.innerWidth > 768) {
        initParallax();
    }
    
    // Contador de visitas
    initVisitCounter();
    
    // Optimizar eventos de scroll
    const throttledScroll = throttle(updateActiveNavOnScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    
    // Tracking inicial
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Mensaje de bienvenida después de la carga
    setTimeout(() => {
        console.log('✨ ¡Bienvenido a Bocaditos Criollos! - Sitio desarrollado con amor para preservar la tradición culinaria colombiana');
    }, 2500);
});

// ===== FUNCIONES ESPECÍFICAS DEL NEGOCIO =====

// Función para mostrar información nutricional
function showNutritionalInfo(producto) {
    const nutritionalData = {
        'Combo Empanadas Tradicionales': {
            calorias: 650,
            proteinas: '25g',
            carbohidratos: '45g',
            grasas: '35g'
        },
        'Combo Fritos Mixtos': {
            calorias: 820,
            proteinas: '18g',
            carbohidratos: '65g',
            grasas: '45g'
        }
        // Agregar más productos aquí
    };
    
    const info = nutritionalData[producto];
    if (info) {
        alert(`Información Nutricional - ${producto}:\nCalorías: ${info.calorias}\nProteínas: ${info.proteinas}\nCarbohidratos: ${info.carbohidratos}\nGrasas: ${info.grasas}`);
    }
}

// Función para calcular tiempo de entrega estimado
function calculateDeliveryTime(ubicacion = 'centro') {
    const deliveryTimes = {
        'centro': '20-30 minutos',
        'norte': '30-45 minutos',
        'sur': '25-35 minutos',
        'oriente': '35-45 minutos',
        'occidente': '30-40 minutos'
    };
    
    return deliveryTimes[ubicacion] || '30-45 minutos';
}

// Función para mostrar promociones del día
function showDailyPromo() {
    const today = new Date().getDay();
    const promos = {
        0: '🎉 Domingo Familiar: 20% de descuento en combos familiares',
        1: '🌟 Lunes de Empanadas: 2x1 en empanadas tradicionales',
        2: '🔥 Martes de Fritos: Combo fritos mixtos con bebida gratis',
        3: '💫 Miércoles Ejecutivo: Descuento especial en combos ejecutivos',
        4: '🎊 Jueves Tradicional: Ingrediente extra gratis en cualquier combo',
        5: '🎈 Viernes de Antojo: Postre incluido en todos los combos',
        6: '🎁 Sábado Especial: Descuento por compras superiores a $40.000'
    };
    
    const promoText = promos[today] || '🍴 ¡Siempre tenemos algo especial para ti!';
    
    // Crear notificación de promoción
    const promoDiv = document.createElement('div');
    promoDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        max-width: 300px;
        z-index: 1001;
        font-weight: 500;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.5s ease;
    `;
    
    promoDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>${promoText}</div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
        </div>
    `;
    
    document.body.appendChild(promoDiv);
    
    // Auto remover después de 8 segundos
    setTimeout(() => {
        if (promoDiv.parentNode) {
            promoDiv.remove();
        }
    }, 8000);
}

// ===== FUNCIONES AUXILIARES =====

// Formatear números de teléfono
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Generar ID único
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.contactarWhatsApp = contactarWhatsApp;
window.showNutritionalInfo = showNutritionalInfo;
window.shareOnSocial = shareOnSocial;
window.calculateDeliveryTime = calculateDeliveryTime;

// ===== INICIALIZAR PROMOCIÓN DEL DÍA =====
// showDailyPromo eliminado

// ===== ESTILOS CSS ADICIONALES INYECTADOS =====
const additionalStyles = `
    <style>
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .offline {
            filter: grayscale(0.3);
        }
        
        .offline::before {
            content: "Sin conexión";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff4444;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 10001;
            font-weight: bold;
        }
        
        .lazy {
            filter: blur(5px);
            transition: filter 0.3s;
        }
        
        .lazy-loaded {
            filter: blur(0);
        }
        
        .toast {
            font-family: 'Open Sans', sans-serif;
        }
        
        /* Mejoras de accesibilidad */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Focus visible para navegación con teclado */
        .nav-link:focus-visible,
        .btn-primary:focus-visible,
        .btn-secondary:focus-visible {
            outline: 3px solid #D4AF37;
            outline-offset: 2px;
        }
        
        /* Alto contraste para mejor legibilidad */
        @media (prefers-contrast: high) {
            :root {
                --text-dark: #000000;
                --text-light: #333333;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ===== CONTROL DE TARJETAS DE COMBOS (HOME Y SECCIÓN) =====
function getMaxCombosToShow() {
    if (window.innerWidth < 768) return 1; // móviles
    if (window.innerWidth < 1200) return 2; // tablets
    return 3; // escritorio
}
function mostrarCombosHome() {
    var combosGrid = document.querySelector('.combos-grid');
    if (combosGrid) {
        var cards = combosGrid.querySelectorAll('.combo-card');
        var activeCards = combosGrid.querySelectorAll('.combo-card.active');
        var max = getMaxCombosToShow();
        // Ocultar todas por defecto
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = 'none';
        }
        // Mostrar solo las activas, hasta el máximo permitido
        for (let i = 0; i < activeCards.length && i < max; i++) {
            activeCards[i].style.display = '';
        }
    }
}
function mostrarTodosCombos() {
    var combosGrid = document.querySelector('.combos-grid');
    if (combosGrid) {
        var cards = combosGrid.querySelectorAll('.combo-card');
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.display = '';
        }
    }
}
// Mostrar solo combos activos en el home al cargar y al redimensionar
function activarHomeCombos() {
    mostrarCombosHome();
    // Si el hash es #combos, mostrar todos
    if (window.location.hash === '#combos') {
        mostrarTodosCombos();
    }
}
document.addEventListener('DOMContentLoaded', activarHomeCombos);
window.addEventListener('resize', activarHomeCombos);
// Mostrar todos los combos al hacer clic en el menú 'Nuestros Combos' o navegar a #combos
window.addEventListener('hashchange', function() {
    if (window.location.hash === '#combos') {
        mostrarTodosCombos();
    } else {
        mostrarCombosHome();
    }
});
// Forzar mostrar todos los combos al hacer clic en el menú 'Nuestros Combos'
document.addEventListener('DOMContentLoaded', function() {
    var navCombos = document.querySelector('.nav-link[href="#combos"]');
    if (navCombos) {
        navCombos.addEventListener('click', function() {
            setTimeout(mostrarTodosCombos, 400); // Espera a que el scroll termine
        });
    }
});