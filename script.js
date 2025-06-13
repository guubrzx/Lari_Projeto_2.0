document.addEventListener('DOMContentLoaded', () => {
    // Elementos da tela de carregamento
    const loadingScreen = document.getElementById('loading-screen');
    const galaxyCanvas = document.getElementById('galaxy-canvas'); // NOVO
    const galaxyCtx = galaxyCanvas.getContext('2d'); // Contexto do novo canvas
    const blackholeCenter = document.querySelector('.blackhole-center');
    const loadingText = document.querySelector('.loading-text');

    // Elementos do conteúdo principal
    const mainContent = document.getElementById('main-content');
    const mainHeaderH1 = document.querySelector('.main-header h1');
    const mainHeaderSubtitle = document.querySelector('.main-header .subtitle');

    // Elementos do envelope
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.flap');
    const envelopeInnerShadow = document.querySelector('.inner-shadow');
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');

    // Elementos da carta
    const letterContainer = document.getElementById('letter-container');
    const letterContent = document.querySelector('.letter-paper-content');
    const letterBodyElements = document.querySelectorAll('#letter-container .letter-body p, #letter-container .letter-body h2, #letter-container .letter-header p');

    let particleAnimationId; // Para controlar o requestAnimationFrame das partículas da galáxia
    let letterParticleAnimationId; // Para controlar o requestAnimationFrame das partículas da carta

    // --- Partículas para a tela de carregamento (Galaxy Canvas) ---
    let galaxyParticles = [];
    const numGalaxyParticles = 600; // Mais partículas para mais densidade
    const galaxyParticleColors = ['#FFF', '#FFD700', '#ADD8E6', '#9370DB', '#FF69B4', '#A020F0']; // Cores variadas para estrelas e névoa

    function resizeGalaxyCanvas() {
        galaxyCanvas.width = window.innerWidth;
        galaxyCanvas.height = window.innerHeight;
        initGalaxyParticles(); // Recria partículas no redimensionamento
    }

    class GalaxyParticle {
        constructor() {
            this.x = Math.random() * galaxyCanvas.width;
            this.y = Math.random() * galaxyCanvas.height;
            this.size = Math.random() * 2 + 0.5; // Tamanho menor e mais variado
            this.speedX = (Math.random() - 0.5) * 0.2; // Velocidade bem sutil
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.color = galaxyParticleColors[Math.floor(Math.random() * galaxyParticleColors.length)];
            this.opacity = Math.random() * 0.6 + 0.1; // Opacidade variada
            this.initialOpacity = this.opacity;
            this.hue = Math.random() * 360; // Para brilho de cor
            this.life = Math.random() * 100 + 50; // Vida útil para "estrelas cadentes"
            this.maxLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Loop das partículas
            if (this.x < 0 || this.x > galaxyCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > galaxyCanvas.height) this.speedY *= -1;

            this.opacity = this.initialOpacity * (this.life / this.maxLife);
            this.life -= 0.5; // Diminui a vida

            if (this.life < 0) { // Renasce a partícula
                this.x = Math.random() * galaxyCanvas.width;
                this.y = Math.random() * galaxyCanvas.height;
                this.life = this.maxLife;
                this.opacity = this.initialOpacity;
            }

            // Pequena variação aleatória de velocidade para movimento orgânico
            this.speedX += (Math.random() * 0.05) - 0.025;
            this.speedY += (Math.random() * 0.05) - 0.025;
            this.speedX = Math.min(Math.max(this.speedX, -0.3), 0.3);
            this.speedY = Math.min(Math.max(this.speedY, -0.3), 0.3);

            this.hue = (this.hue + 0.5) % 360; // Animação de cor suave
        }

        draw() {
            galaxyCtx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`; // Brilho de cor
            galaxyCtx.shadowBlur = this.size * 2; // Brilho na estrela
            galaxyCtx.shadowColor = `hsla(${this.hue}, 100%, 80%, ${this.opacity * 0.8})`;

            galaxyCtx.beginPath();
            galaxyCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            galaxyCtx.fill();
            galaxyCtx.shadowBlur = 0; // Reset shadow
        }
    }

    function initGalaxyParticles() {
        galaxyParticles = [];
        for (let i = 0; i < numGalaxyParticles; i++) {
            galaxyParticles.push(new GalaxyParticle());
        }
    }

    function animateGalaxyParticles() {
        galaxyCtx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);
        galaxyCtx.globalCompositeOperation = 'lighter'; // Efeito de brilho aditivo
        for (let i = 0; i < galaxyParticles.length; i++) {
            galaxyParticles[i].update();
            galaxyParticles[i].draw();
        }
        galaxyCtx.globalCompositeOperation = 'source-over'; // Reseta
        particleAnimationId = requestAnimationFrame(animateGalaxyParticles);
    }

    // --- Animação da Tela de Carregamento (Mais Rápida e Impactante) ---
    const loadingTl = gsap.timeline({
        defaults: { ease: "power2.out" }, // Easing mais rápido por padrão
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.8, // Fade out rápido
                onComplete: () => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                    animateMainContent();
                    cancelAnimationFrame(particleAnimationId); // Para a animação da galáxia
                }
            });
        }
    });

    loadingTl.set(loadingScreen, { opacity: 1 }) // Garante que está visível ao iniciar
    .add(() => {
        resizeGalaxyCanvas(); // Redimensiona e inicializa o canvas
        animateGalaxyParticles(); // Inicia a animação de partículas
    })
    .from(blackholeCenter, {
        scale: 0,
        opacity: 0,
        duration: 1.2, // Rápido, mas com impacto
        ease: "back.out(2)", // Um "pop" mais forte
        delay: 0.3
    })
    .to(blackholeCenter, {
        scale: 1.2, // Pulsa um pouco mais
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
    }, "-=0.3") // Começa a pulsar antes do texto aparecer
    .from(loadingText.children, { // Anima cada letra do texto
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.8,
        ease: "back.out(1.2)"
    }, "-=0.5") // Texto aparece logo depois do buraco negro
    .to(loadingText, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power1.in",
        delay: 1 // Espera um pouco antes de sumir
    }, "+=0.5")
    .to(blackholeCenter, {
        scale: 0,
        opacity: 0,
        duration: 0.7, // Some rapidamente
        ease: "power2.in"
    }, "-=0.2"); // Buraco negro some junto com o texto

    // Para animar o texto do loading letter by letter
    loadingText.innerHTML = loadingText.textContent.split('').map(char => `<span>${char}</span>`).join('');


    // --- Animação do Conteúdo Principal (Fade-in e Apresentação) ---
    function animateMainContent() {
        gsap.timeline({ defaults: { ease: "power2.out" } }) // Easing mais rápido
            .to(mainContent, { opacity: 1, y: 0, duration: 1.5 }) // Duração mais curta
            .from(mainHeaderH1, { opacity: 0, y: -80, duration: 1.8, ease: "elastic.out(1, 0.4)" }, "<0.4")
            .from(mainHeaderSubtitle, { opacity: 0, y: 40, duration: 1.2, ease: "power1.out" }, "<0.3")
            .from(envelope, {
                scale: 0.3,
                opacity: 0,
                y: 200,
                rotation: 60,
                duration: 1.8,
                ease: "back.out(1.4)"
            }, "-=0.8")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 100, rotation: -30 },
                { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.2, ease: "back.out(1.2)" }, "-=0.6"
            );
    }

    // --- Configuração das Partículas do Fundo da Carta (Canvas) ---
    const letterCanvas = document.getElementById('letter-canvas');
    const letterCtx = letterCanvas.getContext('2d');
    let letterParticles = [];
    const numLetterParticles = 500; // Mais partículas para a carta
    const letterParticleColors = ['#f7aef8', '#ff69b4', '#9b59b6', '#ecf0f1', '#e0b8ff', '#ffd1dc']; // Cores suaves e complementares

    class LetterParticle {
        constructor() {
            this.x = Math.random() * letterCanvas.width;
            this.y = Math.random() * letterCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = letterParticleColors[Math.floor(Math.random() * letterParticleColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > letterCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > letterCanvas.height) this.speedY *= -1;

            // Movimento de "onda" suave
            this.x += Math.sin(Date.now() * 0.001 + this.y * 0.01) * 0.1;
            this.y += Math.cos(Date.now() * 0.001 + this.x * 0.01) * 0.1;

            this.opacity = 0.5 + Math.sin(Date.now() * 0.002 + this.x * 0.005 + this.y * 0.005) * 0.2; // Pulsação sutil
        }

        draw() {
            letterCtx.fillStyle = this.color;
            letterCtx.globalAlpha = this.opacity;
            letterCtx.beginPath();
            letterCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            letterCtx.fill();
            letterCtx.globalAlpha = 1;
        }
    }

    function initLetterParticles() {
        letterParticles = [];
        for (let i = 0; i < numLetterParticles; i++) {
            letterParticles.push(new LetterParticle());
        }
    }

    function animateLetterParticles() {
        letterCtx.clearRect(0, 0, letterCanvas.width, letterCanvas.height);
        letterCtx.globalCompositeOperation = 'lighter'; // Efeito de brilho
        for (let i = 0; i < letterParticles.length; i++) {
            letterParticles[i].update();
            letterParticles[i].draw();
        }
        letterCtx.globalCompositeOperation = 'source-over';
        letterParticleAnimationId = requestAnimationFrame(animateLetterParticles);
    }

    // --- Animação de Abrir Carta (A Grande Revelação) ---
    openEnvelopeBtn.addEventListener('click', () => {
        const openingTl = gsap.timeline({ defaults: { ease: "power2.out" } });

        openingTl.to(openEnvelopeBtn, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.5,
            ease: "power1.in"
        })
        .to(envelopeFlap, {
            rotationX: 180,
            duration: 1.5, // Duração da aba
            ease: "elastic.out(1, 0.5)"
        }, "-=0.3")
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 1
        }, "-=1.2")
        .to(envelope, {
            y: -150, // Menos movimento para cima
            x: 50, // Menos movimento lateral
            scale: 0.7, // Diminui mais
            rotation: 20, // Menos rotação
            opacity: 0,
            duration: 1,
            ease: "power1.in"
        }, "-=0.8")
        .set(letterContainer, {
            display: 'flex',
            zIndex: 200,
            pointerEvents: 'none'
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "100vh", scale: 0.1, rotateX: 60, rotationY: -20, filter: "blur(10px)" }, // Começa de baixo, com rotação e blur
            {
                opacity: 1,
                y: "50%", // Posição final centralizada
                scale: 1,
                rotateX: 0,
                rotationY: 0,
                filter: "blur(0px)",
                duration: 2, // Duração da animação da carta (um pouco mais rápida)
                ease: "elastic.out(1, 0.4)",
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto';
                    // Redimensiona e inicializa as partículas da carta
                    letterCanvas.width = letterContainer.clientWidth;
                    letterCanvas.height = letterContainer.clientHeight;
                    initLetterParticles();
                    if (!letterParticleAnimationId) {
                        animateLetterParticles();
                    }
                    animateLetterText();
                }
            }, "-=1.5") // Carta aparece sobrepondo a saída do envelope
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 30, // Menos movimento
            stagger: 0.02, // Stagger ainda mais rápido e suave
            duration: 0.7, // Mais rápido
            ease: "power1.out",
            delay: 0.5 // Pequeno atraso
        });
    }

    // --- Resizing e Otimização ---
    window.addEventListener('resize', () => {
        resizeGalaxyCanvas(); // Sempre redimensiona o canvas da galáxia
        if (!letterContainer.classList.contains('hidden')) {
            letterCanvas.width = letterContainer.clientWidth;
            letterCanvas.height = letterContainer.clientHeight;
            initLetterParticles(); // Recria as partículas da carta para o novo tamanho
        }
    });

    // Initial setup for the main content to be hidden
    mainContent.classList.add('hidden');

    // Pre-initialization for galaxy canvas (for faster loading)
    // No need to init particles here, they will be initialized on loadingTl.add()
    // and re-initialized on resize. This ensures the canvas exists.
    if (galaxyCanvas) {
        galaxyCanvas.width = window.innerWidth;
        galaxyCanvas.height = window.innerHeight;
    }
});
