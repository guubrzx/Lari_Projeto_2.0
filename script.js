document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da tela de carregamento ---
    const loadingScreen = document.getElementById('loading-screen');
    const starCanvas = document.getElementById('star-canvas');
    const starCtx = starCanvas.getContext('2d');
    const loadingTitle = document.querySelector('.loading-title');
    const loadingSubtitle = document.querySelector('.loading-subtitle');

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
    const letterParticlesCanvas = document.getElementById('letter-particles-canvas');
    const letterParticlesCtx = letterParticlesCanvas.getContext('2d');
    const letterBodyElements = document.querySelectorAll('#letter-container .letter-body p, #letter-container .letter-body h2, #letter-container .letter-header p, #letter-container .letter-body .signature, #letter-container .letter-body .ps, #letter-container .letter-body .signature-end');

    let starAnimationId;
    let letterParticleAnimationId;

    // --- Partículas para a Tela de Carregamento (Star Canvas) ---
    let stars = [];
    const numStars = 800;
    const starColors = ['#F8F8F8', '#E0E0FF', '#FFFACD', '#FFDDC1', '#DDA0DD'];

    class Star {
        constructor() {
            this.x = Math.random() * starCanvas.width;
            this.y = Math.random() * starCanvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = starColors[Math.floor(Math.random() * starColors.length)];
            this.opacity = Math.random() * 0.8 + 0.2;
            this.life = Math.random() * 100 + 50;
            this.maxLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > starCanvas.width) this.x = Math.random() * starCanvas.width;
            if (this.y < 0 || this.y > starCanvas.height) this.y = Math.random() * starCanvas.height;

            this.opacity = this.opacity * (this.life / this.maxLife); // Ajuste aqui para não usar initialOpacity após a primeira execução
            this.life -= 0.2;

            if (this.life < 0) {
                this.x = Math.random() * starCanvas.width;
                this.y = Math.random() * starCanvas.height;
                this.life = this.maxLife;
                this.opacity = Math.random() * 0.8 + 0.2;
            }

            this.speedX += (Math.random() * 0.02) - 0.01;
            this.speedY += (Math.random() * 0.02) - 0.01;
            this.speedX = Math.min(Math.max(this.speedX, -0.6), 0.6);
            this.speedY = Math.min(Math.max(this.speedY, -0.6), 0.6);
        }

        draw() {
            starCtx.fillStyle = this.color;
            starCtx.globalAlpha = this.opacity;
            starCtx.beginPath();
            starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            starCtx.fill();
            starCtx.globalAlpha = 1;
        }
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    function animateStars() {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        starCtx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
        }
        starCtx.globalCompositeOperation = 'source-over';
        starAnimationId = requestAnimationFrame(animateStars);
    }

    function resizeStarCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        initStars();
    }

    // --- Animação da Tela de Carregamento (Aurora Cósmica) ---
    // Dividir o título em spans para animar letra por letra ANTES de criar a timeline
    loadingTitle.innerHTML = loadingTitle.textContent.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');

    const loadingTl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.7,
                onComplete: () => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                    animateMainContent();
                    cancelAnimationFrame(starAnimationId);
                }
            });
        }
    });

    loadingTl.set(loadingScreen, { opacity: 1 })
    .add(() => {
        resizeStarCanvas();
        animateStars();
    })
    .fromTo(loadingTitle.children,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: "back.out(1.5)" }, "start")
    .fromTo(loadingSubtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "start+=0.5")
    .to([loadingTitle.children, loadingSubtitle], {
        opacity: 0,
        y: -50,
        stagger: 0.03,
        duration: 0.6,
        ease: "power1.in",
        delay: 1.2
    }, "+=0.8");

    // O restante do script (main content, envelope, letter animations) permanece INALTERADO.
    // ... (restante do seu script.js aqui)

    // --- Partículas para o Fundo da Carta (Letter Particles Canvas) ---
    let letterParticles = [];
    const numLetterParticles = 600; // Mais partículas para a carta
    const letterParticleColors = ['#f7aef8', '#ff69b4', '#9b59b6', '#ecf0f1', '#e0b8ff', '#ffd1dc'];

    class LetterParticle {
        constructor() {
            this.x = Math.random() * letterParticlesCanvas.width;
            this.y = Math.random() * letterParticlesCanvas.height;
            this.size = Math.random() * 1.8 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = letterParticleColors[Math.floor(Math.random() * letterParticleColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
            this.initialOpacity = this.opacity;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > letterParticlesCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > letterParticlesCanvas.height) this.speedY *= -1;

            this.opacity = this.initialOpacity * (0.6 + Math.sin(Date.now() * 0.0015 + this.x * 0.005) * 0.4);
        }

        draw() {
            letterParticlesCtx.fillStyle = this.color;
            letterParticlesCtx.globalAlpha = this.opacity;
            letterParticlesCtx.beginPath();
            letterParticlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            letterParticlesCtx.fill();
            letterParticlesCtx.globalAlpha = 1;
        }
    }

    function initLetterParticles() {
        letterParticles = [];
        for (let i = 0; i < numLetterParticles; i++) {
            letterParticles.push(new LetterParticle());
        }
    }

    function animateLetterParticles() {
        letterParticlesCtx.clearRect(0, 0, letterParticlesCanvas.width, letterParticlesCanvas.height);
        letterParticlesCtx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < letterParticles.length; i++) {
            letterParticles[i].update();
            letterParticles[i].draw();
        }
        letterParticlesCtx.globalCompositeOperation = 'source-over';
        letterParticleAnimationId = requestAnimationFrame(animateLetterParticles);
    }

    function resizeLetterCanvas() {
        letterParticlesCanvas.width = letterContainer.clientWidth;
        letterParticlesCanvas.height = letterContainer.clientHeight;
        initLetterParticles();
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
            duration: 1.2, // Rotação do flap mais rápida
            ease: "elastic.out(1, 0.5)"
        }, "<") // Começa com o botão sumindo
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 0.8
        }, "-=0.6")
        .to(envelope, {
            y: -100, // Menos movimento para cima
            x: 40, // Menos movimento lateral
            scale: 0.6,
            rotation: 15, // Menos rotação
            opacity: 0,
            duration: 0.8,
            ease: "power1.in"
        }, "-=0.5") // Envelope sai da tela
        .set(letterContainer, {
            display: 'flex',
            zIndex: 200,
            pointerEvents: 'none' // Desabilita interações durante a transição
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "100vh", scale: 0.1, rotateX: 45, filter: "blur(10px)" },
            {
                opacity: 1,
                y: "50%",
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 1.8, // Duração mais rápida para a carta entrar
                ease: "elastic.out(1, 0.4)",
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto'; // Habilita interações
                    resizeLetterCanvas(); // Garante o tamanho correto e inicializa partículas
                    if (!letterParticleAnimationId) {
                        animateLetterParticles();
                    }
                    animateLetterText();
                }
            }, "-=1.0") // Carta entra enquanto o envelope sai
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 25, // Movimento sutil
            stagger: 0.015, // Stagger bem rápido para o texto
            duration: 0.6,
            ease: "power1.out",
            delay: 0.4 // Pequeno atraso
        });
    }

    // --- Resizing e Otimização Geral ---
    window.addEventListener('resize', () => {
        resizeStarCanvas(); // Redimensiona o canvas de carregamento
        if (!letterContainer.classList.contains('hidden')) {
            resizeLetterCanvas(); // Redimensiona o canvas da carta
        }
    });

    // Esconde o conteúdo principal ao carregar
    mainContent.classList.add('hidden');
});
