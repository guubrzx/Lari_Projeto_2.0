document.addEventListener('DOMContentLoaded', () => {
    // Elementos da tela de carregamento
    const loadingScreen = document.getElementById('loading-screen');
    const galaxyBg = document.querySelector('.galaxy-bg');
    const blackholeCenter = document.querySelector('.blackhole-center');
    const loadingText = document.querySelector('.loading-text');
    const starsContainer = document.querySelector('.stars');

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

    // --- Configuração das Partículas do Fundo da Carta (Canvas) ---
    const canvas = document.getElementById('letter-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 400; // Aumentado para uma experiência mais imersiva
    const particleColors = ['#f7aef8', '#ff69b4', '#2ecc71', '#9b59b6', '#e74c3c', '#3498db', '#f1c40f', '#8e44ad', '#1abc9c', '#d35400', '#f39c12', '#9b59b6', '#c0392b', '#16a085']; // Mais cores

    function resizeCanvas() {
        canvas.width = letterContainer.clientWidth;
        canvas.height = letterContainer.clientHeight;
        if (letterContainer.classList.contains('hidden')) {
            // Only re-initialize if the letter is hidden, otherwise animateParticles will handle it
            initParticles();
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8; // Tamanho refinado
            this.speedX = (Math.random() * 1.2) - 0.6; // Velocidade ajustada
            this.speedY = (Math.random() * 1.2) - 0.6;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = Math.random() * 0.6 + 0.2; // Opacidade mais variada
            this.initialOpacity = this.opacity;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Continua o movimento nas bordas, dando uma sensação de "loop" infinito
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            this.speedX += (Math.random() * 0.1) - 0.05; // Pequenas variações para movimento orgânico
            this.speedY += (Math.random() * 0.1) - 0.05;
            this.speedX = Math.min(Math.max(this.speedX, -0.7), 0.7);
            this.speedY = Math.min(Math.max(this.speedY, -0.7), 0.7);

            this.opacity = this.initialOpacity * (0.7 + Math.sin(Date.now() * 0.0015 + this.x * 0.005) * 0.3); // Pulsação mais suave
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1; // Reseta para não afetar outros desenhos
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    let animationFrameId; // Para controlar a animação de partículas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    // --- Animação da Tela de Carregamento (Galaxy Entrance) ---
    function createGalaxyStars(count) {
        for (let i = 0; i < count; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 2.5 + 0.5; // Tamanho ajustado
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 6 + 3}px rgba(255, 255, 255, 0.6)`;
            starsContainer.appendChild(star);

            gsap.to(star, {
                duration: Math.random() * 7 + 4,
                opacity: 0.1,
                scale: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 3
            });
        }
    }

    const loadingTl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loadingScreen.classList.add('hidden'); // Usa a classe hidden
                    mainContent.classList.remove('hidden');
                    animateMainContent();
                }
            });
        }
    });

    loadingTl.to(galaxyBg, {
        opacity: 1,
        scale: 1.5,
        duration: 3,
        filter: "brightness(2) contrast(1.5)",
        rotation: 720,
        ease: "power2.out"
    })
    .to(blackholeCenter, {
        scale: 1,
        duration: 2,
        ease: "elastic.out(1, 0.7)",
        yoyo: true,
        repeat: 1
    }, "-=1.5")
    .to(loadingText, {
        opacity: 1,
        y: -30,
        duration: 1.8,
        letterSpacing: "0.15em",
        textShadow: "0 0 15px rgba(255,255,255,0.9), 0 0 30px rgba(255,105,180,0.7)",
        ease: "back.out(1.5)"
    }, "-=1.0")
    .to([galaxyBg, blackholeCenter, loadingText, starsContainer], {
        opacity: 0,
        scale: 0.6,
        duration: 2,
        ease: "power3.in",
        stagger: 0.1
    }, "+=2");

    createGalaxyStars(500); // Mais estrelas para um céu mais denso

    // --- Animação do Conteúdo Principal (Fade-in e Apresentação) ---
    function animateMainContent() {
        gsap.timeline({ defaults: { ease: "power3.out" } })
            .to(mainContent, { opacity: 1, y: 0, duration: 2 })
            .from(mainHeaderH1, { opacity: 0, y: -100, duration: 2, ease: "elastic.out(1, 0.5)" }, "<0.6")
            .from(mainHeaderSubtitle, { opacity: 0, y: 50, duration: 1.5, ease: "power2.out" }, "<0.4")
            .from(envelope, {
                scale: 0.2,
                opacity: 0,
                y: 250,
                rotation: 90,
                duration: 2.2,
                ease: "elastic.out(1, 0.3)"
            }, "-=1.2")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 120, rotation: -45 },
                { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.5, ease: "back.out(1.6)" }, "-=0.8"
            );
    }

    // --- Animação de Abrir Carta (A Grande Revelação) ---
    openEnvelopeBtn.addEventListener('click', () => {
        const openingTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        openingTl.to(openEnvelopeBtn, {
            opacity: 0,
            y: 70,
            scale: 0.8,
            duration: 0.6,
            ease: "power1.in"
        })
        .to(envelopeFlap, {
            rotationX: 180,
            duration: 1.8,
            ease: "elastic.out(1, 0.6)"
        }, "-=0.4")
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 1.2
        }, "-=1.5")
        .to(envelope, {
            y: -180,
            x: 60,
            scale: 0.6,
            rotation: 25,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        }, "-=1.0")
        .set(letterContainer, {
            display: 'flex', // Muda de hidden para flex
            zIndex: 200,
            pointerEvents: 'none'
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "120vh", scale: 0.1, rotateX: 70, rotationY: -30, filter: "blur(15px)" },
            {
                opacity: 1,
                y: "50%",
                scale: 1,
                rotateX: 0,
                rotationY: 0,
                filter: "blur(0px)",
                duration: 2.5,
                ease: "elastic.out(1, 0.4)",
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto';
                    resizeCanvas(); // Garante que o canvas tem o tamanho correto
                    initParticles(); // Inicializa partículas após a carta estar no lugar
                    if (!animationFrameId) { // Evita múltiplos loops de animação
                        animateParticles();
                    }
                    animateLetterText();
                }
            }, "-=1.8")
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 40,
            stagger: 0.03, // Stagger ajustado
            duration: 0.9,
            ease: "power2.out",
            delay: 0.7 // Pequeno atraso
        });
    }

    // --- Resizing e Otimização ---
    window.addEventListener('resize', () => {
        if (!letterContainer.classList.contains('hidden')) {
            resizeCanvas(); // Apenas redimensiona o canvas
        }
    });

    // Clean up animation frame when the page is unloaded (useful for single-page applications)
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    // Initial setup for the main content to be hidden
    mainContent.classList.add('hidden');
});
