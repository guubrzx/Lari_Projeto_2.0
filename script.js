document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const galaxyBg = document.querySelector('.galaxy-bg');
    const blackholeCenter = document.querySelector('.blackhole-center');
    const loadingText = document.querySelector('.loading-text');
    const starsContainer = document.querySelector('.stars');

    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.querySelector('.envelope');
    const envelopeFlap = document.querySelector('.flap');
    const openEnvelopeBtn = document.getElementById('open-envelope-btn');
    const letterContainer = document.getElementById('letter-container');
    const headerTitle = document.querySelector('.header-animation h1');
    const letterBodyParagraphs = document.querySelectorAll('#letter-container .letter-body p, #letter-container .letter-body h2');

    // --- Animação de Carregamento (Buraco Negro/Galáxia) ---
    function createStars(numStars) {
        for (let i = 0; i < numStars; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            const size = Math.random() * 2 + 1; // 1 to 3px
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
                opacity: 0.1, // Pisca para um brilho mais sutil
                scale: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 2
            });
        }
    }

    // Timeline para a sequência da animação de carregamento
    const loadingTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    loadingTl.to(galaxyBg, { opacity: 1, scale: 1.2, duration: 2, filter: "brightness(1.5)" })
             .to(blackholeCenter, { scale: 1, duration: 1.5, ease: "back.out(1.7)" }, "-=0.8")
             .to(loadingText, { opacity: 1, y: -20, duration: 1 }, "-=0.8")
             .to([galaxyBg, blackholeCenter, loadingText, starsContainer], {
                 opacity: 0,
                 scale: 0.8, // Diminui um pouco antes de sumir
                 duration: 1.2,
                 ease: "power1.in",
                 onComplete: () => {
                     loadingScreen.style.display = 'none';
                     mainContent.classList.remove('hidden');
                     animateMainContent();
                 }
             }, "+=1.5"); // Espera um pouco mais antes de começar a transição

    createStars(150); // Mais estrelas para um efeito mais denso

    // --- Animação do Conteúdo Principal e Envelope ---
    function animateMainContent() {
        gsap.timeline()
            .to(mainContent, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" })
            .from(headerTitle, { opacity: 0, y: -50, duration: 1.5, ease: "back.out(1.7)" }, "-=0.7")
            .from(envelope, {
                scale: 0.4,
                opacity: 0,
                y: 100,
                rotation: 45,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.8")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.5"
            );
    }

    // --- Animação de Abrir Carta ---
    openEnvelopeBtn.addEventListener('click', () => {
        gsap.timeline()
            .to(openEnvelopeBtn, { opacity: 0, y: 50, duration: 0.4, ease: "power1.in" })
            .to(envelopeFlap, { rotationX: 180, duration: 1, ease: "elastic.out(1, 0.5)" }, "-=0.2") // Efeito de "bounce" na aba
            .to(envelope, { y: -80, scale: 0.8, duration: 0.6, ease: "power1.out" }, "-=0.5") // Pequeno pulo do envelope
            .set(letterContainer, { display: 'block', zIndex: 100 }) // Garante que a carta esteja visível e acima de tudo
            .fromTo(letterContainer,
                { opacity: 0, y: 200, scale: 0.4, rotateX: -20 }, // Inicia um pouco rotacionada para 3D
                { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.5, ease: "back.out(1.4)" }, "-=0.3"
            )
            .to(envelope, { opacity: 0, duration: 0.5, ease: "power1.out", onComplete: () => {
                envelopeContainer.style.display = 'none'; // Esconde o envelope completamente
            }}, "-=0.5")
            .from(letterBodyParagraphs, {
                opacity: 0,
                y: 20,
                stagger: 0.08, // Anima cada parágrafo com um pequeno atraso
                duration: 0.7,
                ease: "power2.out"
            }, "-=0.8"); // Começa a animar o texto um pouco antes do envelope sumir
    });
});
