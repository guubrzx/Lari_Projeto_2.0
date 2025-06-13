document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da tela de carregamento ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const loadingTitle = document.querySelector('.loading-title');
    const loadingSubtitle = document.querySelector('.loading-subtitle');

    // Verifica se os elementos essenciais da tela de carregamento existem
    if (!loadingScreen || !loadingOverlay || !loadingTitle || !loadingSubtitle) {
        console.error("Erro: Elementos essenciais da tela de carregamento não encontrados. Verifique o HTML e classes/IDs.");
        // Se a tela de carregamento não puder ser animada, mostre o conteúdo principal
        if (mainContent) {
            loadingScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Tente animar o conteúdo principal se ele existir
            if (mainHeaderH1 && mainHeaderSubtitle && envelope && openEnvelopeBtn) {
                 gsap.timeline({ defaults: { ease: "power2.out" } })
                    .to(mainContent, { opacity: 1, y: 0, duration: 1.2 })
                    .from(mainHeaderH1, { opacity: 0, y: -70, duration: 1.5, ease: "elastic.out(1, 0.4)" }, "<0.3")
                    .from(mainHeaderSubtitle, { opacity: 0, y: 30, duration: 1, ease: "power1.out" }, "<0.2")
                    .from(envelope, { scale: 0.4, opacity: 0, y: 180, rotation: 45, duration: 1.6, ease: "back.out(1.2)" }, "-=0.7")
                    .fromTo(openEnvelopeBtn, { scale: 0, opacity: 0, y: 90, rotation: -20 }, { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.5");
            }
        }
        return; // Sai da função se elementos essenciais não existirem
    }

    // --- Elementos do conteúdo principal ---
    const mainContent = document.getElementById('main-content');
    const mainHeaderH1 = document.querySelector('.main-header h1');
    const mainHeaderSubtitle = document.querySelector('.main-header .subtitle');

    // --- Elementos do envelope ---
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.flap');
    const envelopeInnerShadow = document.querySelector('.inner-shadow');
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');

    // --- Elementos da carta ---
    const letterContainer = document.getElementById('letter-container');
    const letterBodyElements = document.querySelectorAll('#letter-container .letter-body p, #letter-container .letter-body h2, #letter-container .letter-header p, #letter-container .letter-body .signature, #letter-container .letter-body .ps, #letter-container .letter-body .signature-end');

    // --- Animação da Tela de Carregamento (A Revelação) ---

    // Dividir o título em spans para animar letra por letra
    loadingTitle.innerHTML = loadingTitle.textContent.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    const loadingTl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8, // Tempo para a tela de carregamento desaparecer
                onComplete: () => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                    animateMainContent();
                }
            });
        }
    });

    loadingTl.set(loadingScreen, { opacity: 1 })
    .fromTo(loadingTitle.children,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: "back.out(1.5)" }, "start")
    .fromTo(loadingSubtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "start+=0.5")
    .to(loadingOverlay, {
        opacity: 0.6, // Revela o overlay de luz
        scale: 1.5,
        duration: 1.5,
        ease: "power2.inOut"
    }, "start+=0.2")
    .to([loadingTitle.children, loadingSubtitle, loadingOverlay], {
        opacity: 0,
        y: -50,
        stagger: 0.03,
        duration: 0.6,
        ease: "power1.in"
    }, "+=1.0"); // Espera um pouco antes de sumir tudo

    // --- Animação do Conteúdo Principal (Entrada Elegante) ---
    function animateMainContent() {
        gsap.timeline({ defaults: { ease: "power2.out" } })
            .to(mainContent, { opacity: 1, y: 0, duration: 1.2 })
            .from(mainHeaderH1, { opacity: 0, y: -70, duration: 1.5, ease: "elastic.out(1, 0.4)" }, "<0.3")
            .from(mainHeaderSubtitle, { opacity: 0, y: 30, duration: 1, ease: "power1.out" }, "<0.2")
            .from(envelope, {
                scale: 0.4,
                opacity: 0,
                y: 180,
                rotation: 45,
                duration: 1.6,
                ease: "back.out(1.2)"
            }, "-=0.7")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 90, rotation: -20 },
                { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1, ease: "back.out(1.2)" }, "-=0.5"
            );
    }

    // --- Animação de Abrir Carta (A Grande Revelação) ---
    openEnvelopeBtn.addEventListener('click', () => {
        const openingTl = gsap.timeline({ defaults: { ease: "power2.out" } });

        envelope.classList.add('open'); // Adiciona a classe para girar o flap

        openingTl.to(openEnvelopeBtn, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.4,
            ease: "power1.in"
        })
        .to(envelopeFlap, {
            rotationX: 180,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)"
        }, "<")
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 0.8
        }, "-=0.6")
        .to(envelope, {
            y: -100,
            x: 40,
            scale: 0.6,
            rotation: 15,
            opacity: 0,
            duration: 0.8,
            ease: "power1.in"
        }, "-=0.5")
        .set(letterContainer, {
            display: 'flex',
            zIndex: 200,
            pointerEvents: 'none'
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "100vh", scale: 0.1, rotateX: 45, filter: "blur(10px)" },
            {
                opacity: 1,
                y: "50%",
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 1.8,
                ease: "elastic.out(1, 0.4)",
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto';
                    animateLetterText();
                }
            }, "-=1.0")
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 25,
            stagger: 0.015,
            duration: 0.6,
            ease: "power1.out",
            delay: 0.4
        });
    }

    // --- Resizing e Otimização Geral ---
    // Removido resize de canvas pois não estamos usando.
    window.addEventListener('resize', () => {
        // Nada específico para redimensionar aqui no momento,
        // mas é um bom lugar para adicionar se tiver elementos responsivos complexos.
    });

    // Esconde o conteúdo principal ao carregar
    mainContent.classList.add('hidden');
});
