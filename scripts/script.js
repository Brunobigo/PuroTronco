document.addEventListener('DOMContentLoaded', function() {
   var menuToggle = document.getElementById('menu-mobile');
   var nav = document.getElementById('navegacao-principal');
   var navLinks = document.querySelectorAll('.nav__link');

   if (menuToggle && nav) {
     menuToggle.addEventListener('click', function() {
       nav.classList.toggle('active');
       var expanded = nav.classList.contains('active');
       this.setAttribute('aria-expanded', expanded);
     });

     navLinks.forEach(function(link) {
       link.addEventListener('click', function() {
         if (nav.classList.contains('active')) {
           nav.classList.remove('active');
           menuToggle.setAttribute('aria-expanded', 'false');
         }
       });
     });
   }

   // Nova Lógica: Controle de exibição do Botão Flutuante do WhatsApp
   const heroBtn = document.querySelector('.hero__btn');
   const fabWhatsapp = document.getElementById('fab-whatsapp');

   if (heroBtn && fabWhatsapp) {
     const observer = new IntersectionObserver((entries) => {
       // O entries[0] representa o botão do hero monitorado
       if (!entries[0].isIntersecting) {
         // Botão do hero saiu da área visível da tela, adiciona a classe
         fabWhatsapp.classList.add('show');
       } else {
         // Botão do hero está visível, remove a classe
         fabWhatsapp.classList.remove('show');
       }
     }, {
       root: null,   // Monitora com base na viewport principal do navegador
       threshold: 0  // Dispara a ação assim que 1px do botão sair ou entrar na tela
     });

     observer.observe(heroBtn);
   }
});

// Rastreamento Global de Conversões e Engajamento (GA4)
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
        // Valida se o script do Google Analytics foi carregado na página
        if (typeof gtag !== 'function') return;

        const href = this.getAttribute('href');
        if (!href) return;

        // 1. Orçamentos e Contato Direto (WhatsApp)
        if (href.includes('wa.me')) {
            gtag('event', 'generate_lead', {
                'event_category': 'Contato',
                'event_label': 'WhatsApp'
            });
        }
        // 2. Contato por Ligação
        else if (href.startsWith('tel:')) {
            gtag('event', 'generate_lead', {
                'event_category': 'Contato',
                'event_label': 'Ligacao_Telefonica'
            });
        }
        // 3. Contato por E-mail
        else if (href.startsWith('mailto:')) {
            gtag('event', 'generate_lead', {
                'event_category': 'Contato',
                'event_label': 'Envio_Email'
            });
        }
        // 4. Intenção de Visita (Google Maps)
        else if (href.includes('maps.app.goo.gl')) {
            gtag('event', 'view_location', {
                'event_category': 'Visita_Oficina',
                'event_label': 'Google_Maps'
            });
        }
        // 5. Engajamento no Instagram (Fotos da Galeria, Botão e Ícone)
        else if (href.includes('instagram.com')) {
            gtag('event', 'social_engagement', {
                'event_category': 'Redes_Sociais',
                'event_label': 'Instagram'
            });
        }
        // 6. Demais Redes Sociais e Google Empresas
        else if (href.includes('tiktok.com') || href.includes('youtube.com') || 
                 href.includes('pinterest.com') || href.includes('threads.net') || 
                 href.includes('x.com') || href.includes('linkedin.com') || 
                 href.includes('share.google')) {
            
            // Extrai o nome da rede dinamicamente
            let rede = 'Outros';
            if (href.includes('tiktok.com')) rede = 'TikTok';
            if (href.includes('youtube.com')) rede = 'YouTube';
            if (href.includes('pinterest.com')) rede = 'Pinterest';
            if (href.includes('threads.net')) rede = 'Threads';
            if (href.includes('x.com')) rede = 'X_Twitter';
            if (href.includes('linkedin.com')) rede = 'LinkedIn';
            if (href.includes('share.google')) rede = 'Google_Empresas';

            gtag('event', 'social_engagement', {
                'event_category': 'Redes_Sociais',
                'event_label': rede
            });
        }
    });
});