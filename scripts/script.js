document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-mobile');
    const nav = document.getElementById('navegacao-principal');
    const navLinks = document.querySelectorAll('.nav__link');

    // Focus Trap e Acessibilidade (WCAG)
    if (menuToggle && nav) {
        const focusableElements = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        
        menuToggle.addEventListener('click', function() {
            const isActive = nav.classList.toggle('active');
            this.setAttribute('aria-expanded', isActive);
        });

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Prende o foco estritamente no menu quando aberto (Focus Trap)
        document.addEventListener('keydown', function(e) {
            if (!nav.classList.contains('active')) return;

            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            
            // Permite fechamento nativo com a tecla ESC
            if (!isTabPressed) {
                if (e.key === 'Escape') {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                }
                return;
            }

            const focusableContent = nav.querySelectorAll(focusableElements);
            const firstElement = menuToggle;
            const lastElement = focusableContent[focusableContent.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    const heroBtn = document.querySelector('.hero__btn');
    const fabWhatsapp = document.getElementById('fab-whatsapp');

    if (fabWhatsapp) {
        if (heroBtn) {
            const observer = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) {
                    fabWhatsapp.classList.add('show');
                } else {
                    fabWhatsapp.classList.remove('show');
                }
            }, { root: null, threshold: 0 });
            observer.observe(heroBtn);
        } else {
            fabWhatsapp.classList.add('show');
        }
    }
   
    // --- MOTOR DE CONSENTIMENTO LGPD E INJEÇÃO DO GA4 ---
    const banner = document.getElementById('lgpd-banner');
    const btnAccept = document.getElementById('lgpd-accept');
    const btnReject = document.getElementById('lgpd-reject');
    const consentKey = 'purotronco_cookie_consent';

    function loadGoogleAnalytics() {
        if (window.gtag) return;
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-B1JC26S4P5';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-B1JC26S4P5');
    }

    // Sincronismo Exato de UI (Elimina o delay hardcoded do setTimeout)
    function hideBanner() {
        banner.classList.remove('show');
        banner.addEventListener('transitionend', function handler() {
            banner.classList.add('hidden');
            banner.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    function checkConsent() {
        const consent = localStorage.getItem(consentKey);
        if (consent === 'granted') {
            loadGoogleAnalytics();
        } else if (consent === null && banner) {
            banner.classList.remove('hidden');
            // requestAnimationFrame garante que o elemento está renderizado antes de aplicar a transição
            requestAnimationFrame(() => {
                requestAnimationFrame(() => banner.classList.add('show'));
            });
        }
    }

    if (btnAccept && btnReject && banner) {
        btnAccept.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'granted');
            hideBanner();
            loadGoogleAnalytics();
        });

        btnReject.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'denied');
            hideBanner();
        });
    }

    checkConsent();

    const btnRevogar = document.getElementById('revogar-cookies');
    if (btnRevogar) {
        btnRevogar.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem(consentKey);
            location.reload(); 
        });
    }
});

// Rastreamento Global de Conversões via Delegação de Eventos (Otimizado)
const eventContainer = document.querySelector('.wrapper') || document.body;
eventContainer.addEventListener('click', function(e) {
    const target = e.target;
    
    // Filtro O(1): Evita subir o DOM (closest) se o clique foi em parágrafos, espaços ou imagens sem link
    const isAnchor = target.tagName === 'A';
    if (!isAnchor && target.tagName !== 'IMG' && target.tagName !== 'SPAN' && target.tagName !== 'H3') return;

    const link = isAnchor ? target : target.closest('a');
    if (!link || typeof gtag !== 'function') return;

    const href = link.getAttribute('href') || '';
    if (!href) return;

    if (href.includes('wa.me')) {
        gtag('event', 'generate_lead', { 'event_category': 'Contato', 'event_label': 'WhatsApp' });
    } else if (href.startsWith('tel:')) {
        gtag('event', 'generate_lead', { 'event_category': 'Contato', 'event_label': 'Ligacao_Telefonica' });
    } else if (href.startsWith('mailto:')) {
        gtag('event', 'generate_lead', { 'event_category': 'Contato', 'event_label': 'Envio_Email' });
    } else if (href.includes('maps.app.goo.gl')) {
        gtag('event', 'view_location', { 'event_category': 'Visita_Oficina', 'event_label': 'Google_Maps' });
    } else if (href.includes('instagram.com')) {
        gtag('event', 'social_engagement', { 'event_category': 'Redes_Sociais', 'event_label': 'Instagram' });
    } else {
        const redes = ['tiktok.com', 'youtube.com', 'pinterest.com', 'threads.com', 'x.com', 'linkedin.com', 'share.google'];
        const match = redes.find(rede => href.includes(rede));
        if (match) {
            const labelMap = {
                'tiktok.com': 'TikTok', 'youtube.com': 'YouTube', 'pinterest.com': 'Pinterest',
                'threads.com': 'Threads', 'x.com': 'X_Twitter', 'linkedin.com': 'LinkedIn', 'share.google': 'Google_Empresas'
            };
            gtag('event', 'social_engagement', { 'event_category': 'Redes_Sociais', 'event_label': labelMap[match] });
        }
    }
});