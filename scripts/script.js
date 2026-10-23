document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DO CABEÇALHO (Ocultar ao Rolar) ---
    const header = document.querySelector('.cabecalho');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Aplica a lógica apenas em telas mobile (onde o menu inferior existe)
        if (window.innerWidth <= 992) {
            if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
                // Rolar para Baixo: Esconde o cabeçalho
                header.classList.add('esconder');
            } else {
                // Rolar para Cima: Mostra o cabeçalho
                header.classList.remove('esconder');
            }
        } else {
            header.classList.remove('esconder');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Evita valores negativos
    }, { passive: true });


    // --- ESTADO ATIVO DO MENU INFERIOR MOBILE ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-mobile__link');

    // Observer para detectar qual seção está na tela
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' }); // Ajuste de margem para ativar o ícone mais perto do centro da tela

    sections.forEach(sec => sectionObserver.observe(sec));


    // --- LÓGICA DO FAB WHATSAPP ---
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

    function loadTrackers() {
        // 1. Google Analytics
        if (!window.gtag) {
            const scriptGA = document.createElement('script');
            scriptGA.async = true;
            scriptGA.src = 'https://www.googletagmanager.com/gtag/js?id=G-B1JC26S4P5';
            document.head.appendChild(scriptGA);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B1JC26S4P5');
        }

        // 2. Metricool Tracker
        if (!window.beTracker) {
            const scriptMC = document.createElement("script");
            scriptMC.type = "text/javascript";
            scriptMC.src = "https://tracker.metricool.com/resources/be.js";
            scriptMC.onload = function() {
                beTracker.t({hash:"928b965e266ba1c26baa6f173c6ea195"});
            };
            document.head.appendChild(scriptMC);
        }
    }

    function hideBanner() {
        if (!banner || banner.classList.contains('hidden')) return;
        banner.classList.remove('show');
        banner.addEventListener('transitionend', function handler() {
            banner.classList.add('hidden');
            banner.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    function checkConsent() {
        try {
            let consent = localStorage.getItem(consentKey);
            
            if (consent === 'granted') {
                loadGoogleAnalytics();
            } else if (consent === null && banner) {
                setTimeout(() => {
                    try { consent = localStorage.getItem(consentKey); } catch(e){}
                    if (consent === null) {
                        banner.classList.remove('hidden');
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => banner.classList.add('show'));
                        });
                    }
                }, 800);
            }
        } catch (e) {
            console.warn('O armazenamento local foi barrado pelas políticas do navegador.');
        }
    }

    if (btnAccept && btnReject && banner) {
        btnAccept.addEventListener('click', () => {
            try { localStorage.setItem(consentKey, 'granted'); } catch(e) {}
            hideBanner();
            loadTrackers();
        });

        btnReject.addEventListener('click', () => {
            try { localStorage.setItem(consentKey, 'denied'); } catch(e) {}
            hideBanner();
        });
    }

    checkConsent();

    const btnRevogar = document.getElementById('revogar-cookies');
    if (btnRevogar) {
        btnRevogar.addEventListener('click', function(e) {
            e.preventDefault();
            try { localStorage.removeItem(consentKey); } catch(e) {}
            location.reload(); 
        });
    }

    // --- CHAMA ATENÇÃO NA ABA DO NAVEGADOR (PISCANTE) ---
    const tituloOriginal = document.title;
    const mensagens = ["🔨 Volte aqui!", "🪓 Seu projeto te espera!"];
    let indexMensagem = 0;
    let temporizadorAba = null;

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            // Inicia o pisca-pisca a cada 1.5s (1500 milissegundos)
            temporizadorAba = setInterval(() => {
                document.title = mensagens[indexMensagem];
                indexMensagem = (indexMensagem + 1) % mensagens.length;
            }, 1500);
        } else {
            // Usuário voltou: para o temporizador e zera o título
            clearInterval(temporizadorAba);
            document.title = tituloOriginal;
            indexMensagem = 0;
        }
    });
    
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