document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const galaxyBg = document.querySelector('.galaxy-bg');
    const blackholeCenter = document.querySelector('.blackhole-center');
    const loadingText = document.querySelector('.loading-text');
    const starsContainer = document.querySelector('.stars');

    const mainHeaderH1 = document.querySelector('.main-header h1');
    const mainHeaderSubtitle = document.querySelector('.main-header .subtitle');

    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.flap');
    const envelopeInnerShadow = document.querySelector('.inner-shadow'); // Nova sombra
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');
    const letterContainer = document.getElementById('letter-container');
    const letterContent = document.querySelector('.letter-paper-content');
    const letterBodyElements = document.querySelectorAll('#letter-container .letter-body p, #letter-container .letter-body h2, #letter-container .letter-header p');

    // --- Canvas para o Fundo da Carta Animado ---
    const canvas = document.getElementById('letter-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 100;
    const particleColors = ['#f7aef8', '#ff69b4', '#2ecc71', '#9b59b6', '#e74c3c']; // Cores da paleta

    function resizeCanvas() {
        canvas.width = letterContainer.clientWidth;
        canvas.height = letterContainer.clientHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // 1 to 3px
            this.speedX = (Math.random() * 0.4) - 0.2; // -0.2 to 0.2
            this.speedY = (Math.random() * 0.4) - 0.2;
            this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            this.opacity = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
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
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    // --- Animação de Carregamento (Buraco Negro/Galáxia) ---
    function createGalaxyStars(count) {
        for (let i = 0; i < count; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`;
            starsContainer.appendChild(star);

            gsap.to(star, {
                duration: Math.random() * 5 + 3,
                opacity: 0.1,
                scale: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 2
            });
        }
    }

    const loadingTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    loadingTl.to(galaxyBg, { opacity: 1, scale: 1.2, duration: 2.5, filter: "brightness(1.5) contrast(1.1)" })
             .to(blackholeCenter, { scale: 1, duration: 1.8, ease: "back.out(1.7)" }, "-=1")
             .to(loadingText, { opacity: 1, y: -20, duration: 1.2, letterSpacing: "0.1em" }, "-=1")
             .to([galaxyBg, blackholeCenter, loadingText, starsContainer], {
                 opacity: 0,
                 scale: 0.8,
                 duration: 1.5,
                 ease: "power1.in",
                 onComplete: () => {
                     loadingScreen.style.display = 'none';
                     mainContent.classList.remove('hidden');
                     animateMainContent();
                 }
             }, "+=2"); // Espera mais tempo para contemplar a animação

    createGalaxyStars(200); // Mais estrelas para a animação inicial

    // --- Animação do Conteúdo Principal e Envelope ---
    function animateMainContent() {
        gsap.timeline()
            .to(mainContent, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" })
            .from(mainHeaderH1, { opacity: 0, y: -80, duration: 1.8, ease: "elastic.out(1, 0.5)" }, "-=1")
            .from(mainHeaderSubtitle, { opacity: 0, y: 50, duration: 1.5, ease: "power3.out" }, "-=1.2")
            .from(envelope, {
                scale: 0.3,
                opacity: 0,
                y: 150,
                rotation: 60,
                duration: 2,
                ease: "elastic.out(1, 0.4)"
            }, "-=1.5")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 80 },
                { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" }, "-=0.8"
            );
    }

    // --- Animação de Abrir Carta ---
    openEnvelopeBtn.addEventListener('click', () => {
        gsap.timeline()
            .to(openEnvelopeBtn, { opacity: 0, y: 50, duration: 0.5, ease: "power1.in" })
            .to(envelopeFlap, { rotationX: 180, duration: 1.2, ease: "elastic.out(1, 0.6)" }, "-=0.3") // Efeito de "bounce" na aba
            .to(envelopeInnerShadow, { opacity: 1, duration: 0.8 }, "-=0.8") // Sombra interna aparece
            .to(envelope, { y: -100, scale: 0.7, rotation: -10, duration: 0.8, ease: "power2.out" }, "-=0.6") // Envelope recua e gira
            .set(letterContainer, { display: 'flex', zIndex: 200 }) // Torna a carta visível, acima de tudo
            .fromTo(letterContainer,
                { opacity: 0, y: "100vh", scale: 0.2, rotateX: 30 }, // Começa de baixo, rotacionada
                { opacity: 1, y: "50%", scale: 1, rotateX: 0, duration: 1.8, ease: "elastic.out(1, 0.4)" }, "-=0.5" // Sobe com bounce
            )
            .to(envelope, { opacity: 0, duration: 0.8, ease: "power1.out", onComplete: () => {
                envelopeContainer.style.display = 'none'; // Esconde o envelope completamente
            }}, "-=0.8")
            .from(letterBodyElements, {
                opacity: 0,
                y: 30,
                stagger: 0.05, // Anima cada elemento da carta com um pequeno atraso
                duration: 0.9,
                ease: "power2.out",
                onComplete: () => {
                    // Após a animação de entrada da carta e texto, inicia as partículas
                    resizeCanvas();
                    initParticles();
                    animateParticles();
                }
            }, "-=1"); // Começa a animar o texto um pouco antes do envelope sumir
    });

    // Resize do canvas quando a janela é redimensionada
    window.addEventListener('resize', () => {
        if (!letterContainer.classList.contains('hidden')) { // Só redimensiona se a carta estiver visível
            resizeCanvas();
            initParticles(); // Reinicia partículas para se adaptarem ao novo tamanho
        }
    });
});
