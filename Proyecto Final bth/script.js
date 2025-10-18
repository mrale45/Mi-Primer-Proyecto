// BELFIS - Script JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    setupMobileMenu();
    setupSmoothScroll();
    setupHeaderEffects();
    setupTitleAnimation();
    setupScrollAnimations();
    setupFormValidation();
    console.log('BELFIS Website cargado correctamente');
}

// === Animación del título ===
function setupTitleAnimation() {
    const title = document.getElementById('animatedTitle');
    if (!title) return;
    setTimeout(() => animateTitle(), 500);
}

function animateTitle() {
    const title = document.getElementById('animatedTitle');
    if (!title) return;
    title.innerHTML = 'Recupera tu bienestar con <span class="highlight">BELFIS</span>';
    title.style.opacity = '0';
    title.style.animation = 'fadeInUp 1s ease-out 0.5s forwards';
}

// === Menú móvil ===
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    document.addEventListener('click', event => {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// === Scroll suave ===
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 70;
                const pos = target.offsetTop - headerHeight;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });
}

// === Header effects ===
function setupHeaderEffects() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// === Validación y envío del formulario ===
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const nombre = document.getElementById('from_name').value.trim();
        const email = document.getElementById('from_email').value.trim();
        const mensaje = document.getElementById('message').value.trim();
        
        if (!nombre || !email || !mensaje) {
            showNotification('Por favor, complete todos los campos obligatorios del formulario', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, ingrese un correo electrónico válido', 'error');
            return;
        }
        
        // Mostrar loading en el botón
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Enviar el formulario
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
                form.reset();
            } else {
                throw new Error('Error en el envío');
            }
        })
        .catch(error => {
            showNotification('Ha ocurrido un error al enviar el mensaje. Por favor, intente nuevamente.', 'error');
            console.error('Error:', error);
        })
        .finally(() => {
            // Restaurar botón
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// === Notificaciones ===
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';

    let bg = '#2196F3', icon = 'info-circle';
    if (type === 'success') { bg = '#4CAF50'; icon = 'check-circle'; }
    else if (type === 'error') { bg = '#f44336'; icon = 'exclamation-circle'; }

    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button onclick="closeNotification(this.parentElement.parentElement)" style="background:none;border:none;color:white;cursor:pointer;margin-left:auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    notification.style.cssText = `
        position: fixed; top:100px; right:20px; background:${bg};
        color:white; padding:1rem 1.5rem; border-radius:10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index:10000;
        transform: translateX(100%); transition: transform 0.3s ease;
        max-width:400px; font-family: Arial, sans-serif;
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => closeNotification(notification), 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
}

// === Scroll animations ===
function setupScrollAnimations() {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold:0.1, rootMargin:'0px 0px -50px 0px' });

    document.querySelectorAll('.servicio-card, .nosotros-content, .ubicacion-content, .contacto-content')
        .forEach(el => { el.classList.add('scroll-animation'); observer.observe(el); });
}

// === Export funciones globales ===
window.belfisFunctions = {
    restartAnimation: animateTitle,
    showNotification
};

// Hacer closeNotification disponible globalmente
window.closeNotification = closeNotification;