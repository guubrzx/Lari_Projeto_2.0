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
    const numParticles = 150; // Aumentado para mais densidade
    // Cores mais vivas para as partículas
    const particleColors = ['#f7aef8', '#ff69b4', '#2ecc71', '#9b59b6', '#e74c3c', '#3498db', '#f1c40f'];

    function resizeCanvas() {
        canvas.width = letterContainer.clientWidth;
        canvas.height = letterContainer.clientHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() * 0.6) - 0.3; // Velocidade um pouco maior
            this.speedY = (Math.random() * 0.6) - 0.3;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = Math.random() * 0.6 + 0.3; // Opacidade um pouco maior
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Faz as partículas "ricochetear" nas bordas
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Pequena variação aleatória para movimento mais orgânico
            this.speedX += (Math.random() * 0.1) - 0.05;
            this.speedY += (Math.random() * 0.1) - 0.05;
            this.speedX = Math.min(Math.max(this.speedX, -0.5), 0.5);
            this.speedY = Math.min(Math.max(this.speedY, -0.5), 0.5);
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
            const size = Math.random() * 2.5 + 0.5; // 0.5 to 3px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 6 + 3}px rgba(255, 255, 255, 0.6)`; // Mais brilho
            starsContainer.appendChild(star);

            gsap.to(star, {
                duration: Math.random() * 6 + 4, // Durações mais longas
                opacity: 0.1,
                scale: 0.7,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 3 // Atrasos variados
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
        scale: 1.3, // Mais zoom
        duration: 3,
        filter: "brightness(1.8) contrast(1.2)", // Brilho intenso
        rotation: 360, // Rotação ao aparecer
        ease: "power2.out"
    })
    .to(blackholeCenter, {
        scale: 1,
        duration: 2,
        ease: "elastic.out(1, 0.7)", // Efeito elástico forte
        yoyo: true,
        repeat: 1 // Pulsa uma vez antes de sumir
    }, "-=1.5") // Começa antes da galáxia terminar
    .to(loadingText, {
        opacity: 1,
        y: -30, // Mais movimento
        duration: 1.5,
        letterSpacing: "0.15em", // Mais espaçamento
        textShadow: "0 0 15px rgba(255,255,255,1)" // Sombra forte
    }, "-=1")
    .to([galaxyBg, blackholeCenter, loadingText, starsContainer], {
        opacity: 0,
        scale: 0.7, // Desaparece encolhendo
        duration: 1.8, // Duração da saída
        ease: "power3.in",
        stagger: 0.1 // Stagger para cada elemento da galáxia
    }, "+=2"); // Espera um pouco mais para a transição final

    createGalaxyStars(250); // Mais estrelas para um cosmos mais denso

    // --- Animação do Conteúdo Principal (Fade-in e Apresentação) ---
    function animateMainContent() {
        gsap.timeline({ defaults: { ease: "power3.out" } })
            .to(mainContent, { opacity: 1, y: 0, duration: 1.8 })
            .from(mainHeaderH1, { opacity: 0, y: -100, duration: 2, ease: "elastic.out(1, 0.6)" }, "<0.5") // Atrasa um pouco
            .from(mainHeaderSubtitle, { opacity: 0, y: 50, duration: 1.5, ease: "power2.out" }, "<0.3") // Atrasa um pouco
            .from(envelope, {
                scale: 0.2, // Começa bem pequeno
                opacity: 0,
                y: 200,
                rotation: 90, // Mais rotação inicial
                duration: 2.2, // Duração mais longa
                ease: "elastic.out(1, 0.4)" // Efeito elástico para o envelope
            }, "-=1.2") // Sobrepõe com o subtítulo
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 100, rotation: -30 }, // Inicia com rotação
                { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.5, ease: "back.out(1.7)" }, "-=0.8" // Efeito back-out para o botão
            );
    }

    // --- Animação de Abrir Carta (A Grande Revelação) ---
    openEnvelopeBtn.addEventListener('click', () => {
        const openingTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        openingTl.to(openEnvelopeBtn, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.6,
            ease: "power1.in"
        })
        .to(envelopeFlap, {
            rotationX: 180,
            duration: 1.5, // Mais tempo para a aba abrir majestosamente
            ease: "elastic.out(1, 0.7)" // Efeito elástico forte na aba
        }, "-=0.3")
        .to(envelopeInnerShadow, {
            opacity: 1,
            duration: 1
        }, "-=1.2") // Sombra interna aparece mais cedo
        .to(envelope, {
            y: -150, // Envelope sobe mais
            x: 50, // Move lateralmente
            scale: 0.6, // Diminui mais
            rotation: 20, // Rotação final do envelope
            opacity: 0, // Desaparece no final
            duration: 1.2,
            ease: "power2.out"
        }, "-=0.8") // Começa a sumir um pouco antes da carta aparecer
        .set(letterContainer, {
            display: 'flex',
            zIndex: 200,
            pointerEvents: 'none' // Inicialmente inabilitado para cliques durante a animação
        })
        .fromTo(letterContainer,
            { opacity: 0, y: "120vh", scale: 0.1, rotateX: 60, rotationY: -30 }, // Começa bem de baixo, rotacionada em 3D
            {
                opacity: 1,
                y: "50%",
                scale: 1,
                rotateX: 0,
                rotationY: 0,
                duration: 2, // Duração da animação da carta
                ease: "elastic.out(1, 0.5)", // Efeito elástico poderoso para a carta
                onComplete: () => {
                    letterContainer.style.pointerEvents = 'auto'; // Habilita cliques após a animação
                    // Inicia o fundo animado e a animação do texto
                    resizeCanvas();
                    initParticles();
                    animateParticles();
                    animateLetterText(); // Chama a função para animar o texto
                }
            }, "-=1.5") // Carta aparece sobrepondo a saída do envelope
    });

    // --- Animação do Texto da Carta (O Revelar da Mensagem) ---
    function animateLetterText() {
        gsap.from(letterBodyElements, {
            opacity: 0,
            y: 40,
            stagger: 0.03, // Stagger ainda mais sutil e rápido
            duration: 0.8,
            ease: "power2.out",
            delay: 0.5 // Pequeno atraso após a carta se estabilizar
        });
    }

    // --- Resizing e Otimização ---
    window.addEventListener('resize', () => {
        if (!letterContainer.classList.contains('hidden')) {
            resizeCanvas();
            initParticles(); // Recria partículas para se adaptarem ao novo tamanho
        }
        // Otimização: Forçar reflow em alguns elementos se necessário (raro com GSAP e REM)
        // mainContent.offsetHeight; // Exemplo de forçar reflow
    });
});
