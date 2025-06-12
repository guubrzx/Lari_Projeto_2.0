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
    const numParticles = 300; // Dobrado para mais densidade e fluidez
    // Cores mais vivas para as partículas e adicionado um espectro maior
    const particleColors = ['#f7aef8', '#ff69b4', '#2ecc71', '#9b59b6', '#e74c3c', '#3498db', '#f1c40f', '#8e44ad', '#1abc9c', '#d35400'];

    function resizeCanvas() {
        canvas.width = letterContainer.clientWidth;
        canvas.height = letterContainer.clientHeight;
        // Recria partículas com base no novo tamanho para evitar que fiquem fora da tela ou esparsas
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1; // Tamanho um pouco maior
            this.speedX = (Math.random() * 1) - 0.5; // Velocidade um pouco maior
            this.speedY = (Math.random() * 1) - 0.5;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = Math.random() * 0.7 + 0.3; // Opacidade um pouco maior
            this.initialOpacity = this.opacity;
            this.direction = Math.random() < 0.5 ? 1 : -1; // Direção para movimento de onda
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Faz as partículas "ricochetear" nas bordas
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Pequena variação aleatória para movimento mais orgânico
            this.speedX += (Math.random() * 0.2) - 0.1;
            this.speedY += (Math.random() * 0.2) - 0.1;
            this.speedX = Math.min(Math.max(this.speedX, -0.8), 0.8); // Limita a velocidade
            this.speedY = Math.min(Math.max(this.speedY, -0.8), 0.8);

            // Efeito de pulsação de opacidade para as partículas
            this.opacity = this.initialOpacity * (0.8 + Math.sin(Date.now() * 0.002 + this.x * 0.01) * 0.2);
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    // --- Animação da Tela de Carregamento (Galaxy Entrance) ---
    function createGalaxyStars(count) {
        for (let i = 0; i < count; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 3 + 0.5; // 0.5 to 3.5px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 8 + 4}px rgba(255, 255, 255, 0.7)`; // Mais brilho
            starsContainer.appendChild(star);

            gsap.to(star, {
                duration: Math.random() * 8 + 5, // Durações mais longas
                opacity: 0.1,
                scale: 0.6,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 4 // Atrasos variados
            });
        }
    }

    // Timeline principal da tela de carregamento
    const loadingTl = gsap.timeline({
        defaults: { ease: "power3.inOut" }, // Easing mais suave e dramático
        onComplete: () => {
            loadingScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            animateMainContent();
        }
    });

    loadingTl.to(galaxyBg, {
        opacity: 1,
        scale: 1.5, // Mais zoom
        duration: 3.5,
        filter: "brightness(2) contrast(1.5)", // Brilho intenso
        rotation: 720, // Mais rotação ao aparecer
        ease: "power2.out"
    })
    .to(blackholeCenter, {
        scale: 1,
        duration: 2.5,
        ease: "elastic.out(1, 0.7)", // Efeito elástico forte
        yoyo: true,
        repeat: 1 // Pulsa uma vez antes de sumir
    }, "-=1.8") // Começa antes da galáxia terminar
    .to(loadingText, {
        opacity: 1,
        y: -40, // Mais movimento
        duration: 2,
        letterSpacing: "0.2em", // Mais espaçamento
        textShadow: "0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,105,180,0.8)", // Sombra forte e colorida
        ease: "back.out(1.7)"
    }, "-=1.2")
    .to([galaxyBg, blackholeCenter, loadingText, starsContainer], {
        opacity: 0,
        scale: 0.5, // Desaparece encolhendo dramaticamente
        duration: 2.5, // Duração da saída
        ease: "power3.in",
        stagger: 0.15 // Stagger para cada elemento da galáxia
    }, "+=2.5"); // Espera um pouco mais para a transição final

    createGalaxyStars(400); // Mais estrelas para um cosmos mais denso

    // --- Animação do Conteúdo Principal (Fade-in e Apresentação) ---
    function animateMainContent() {
        gsap.timeline({ defaults: { ease: "power3.out" } })
            .to(mainContent, { opacity: 1, y: 0, duration: 2.5 })
            .from(mainHeaderH1, { opacity: 0, y: -120, duration: 2.5, ease: "elastic.out(1, 0.6)" }, "<0.7") // Atrasa um pouco
            .from(mainHeaderSubtitle, { opacity: 0, y: 60, duration: 1.8, ease: "power2.out" }, "<0.5") // Atrasa um pouco
            .from(envelope, {
                scale: 0.1, // Começa bem pequeno
                opacity: 0,
                y: 300,
                rotation: 120, // Mais rotação inicial
                duration: 2.8, // Duração mais longa
                ease: "elastic.out(1, 0.4)" // Efeito elástico para o envelope
            }, "-=1.5") // Sobrepõe com o subtítulo
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 150, rotation: -60 }, // Inicia com rotação
                { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.8, ease: "back.out(1.7)" }, "-=1" // Efeito back-out para o botão
            );
    }

    // --- Animação de Abrir Carta (A Grande Revelação) ---
    openEnvelopeBtn.addEventListener('click', () => {
        const openingTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        openingTl.to(openEnvelopeBtn, {
            opacity: 0,
            y: 80,
            scale: 0.7,
            duration: 0.8,
            ease: "power1.in"
        })
        .to(envelopeFlap, {
            rotationX: 180,
            duration: 2, // Mais tempo para a aba abrir majestosamente
            ease: "elastic.out(1, 0.7)" // Efeito elástico forte na aba
        }, "-=0.5")
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 1.5
        }, "-=1.8") // Sombra interna aparece mais cedo
        .to(envelope, {
            y: -200, // Envelope sobe mais
            x: 70, // Move lateralmente
            scale: 0.5, // Diminui mais
            rotation: 30, // Rotação final do envelope
            opacity: 0, // Desaparece no final
            duration: 1.5,
            ease: "power2.out"
        }, "-=1.2") // Começa a sumir um pouco antes da carta aparecer
        .set(letterContainer, {
            display: 'flex',
            zIndex: 200,
            pointerEvents: 'none' // Inicialmente inabilitado para cliques durante a animação
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "150vh", scale: 0.05, rotateX: 90, rotationY: -45, filter: "blur(20px)" }, // Começa bem de baixo, rotacionada em 3D, com blur
            {
                opacity: 1,
                y: "50%",
                scale: 1,
                rotateX: 0,
                rotationY: 0,
                filter: "blur(0px)",
                duration: 2.8, // Duração da animação da carta
                ease: "elastic.out(1, 0.5)", // Efeito elástico poderoso para a carta
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto'; // Habilita cliques após a animação
                    // Inicia o fundo animado e a animação do texto
                    resizeCanvas();
                    initParticles();
                    animateParticles();
                    animateLetterText(); // Chama a função para animar o texto
                }
            }, "-=2") // Carta aparece sobrepondo a saída do envelope
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 50,
            stagger: 0.04, // Stagger um pouco mais visível
            duration: 1,
            ease: "power2.out",
            delay: 0.8 // Pequeno atraso após a carta se estabilizar
        });
    }

    // --- Resizing e Otimização ---
    window.addEventListener('resize', () => {
        if (!letterContainer.classList.contains('hidden')) {
            resizeCanvas();
            // Re-initialize particles if needed, already handled in resizeCanvas
        }
    });

    // Initialize particles for canvas even if not immediately visible
    // This ensures they are ready when the letter opens.
    // However, they will be re-initialized on resize and when letter opens to match actual dimensions.
    // initParticles(); // Called only when letter becomes visible now for performance.
});
