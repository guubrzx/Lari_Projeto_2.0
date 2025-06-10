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
    const letterBodyParagraphs = document.querySelectorAll('#letter-container .letter-body p');

    // --- Animação de Carregamento (Buraco Negro/Galáxia) ---
    function createStars(numStars) {
        for (let i = 0; i < numStars; i++) {
            let star = document.createElement('div');
            star.classList.add('star');
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.borderRadius = '50%';
            star.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.5)`;
            starsContainer.appendChild(star);

            gsap.to(star, {
                duration: Math.random() * 5 + 3,
                opacity: 0,
                scale: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: Math.random() * 2 // Atraso para as estrelas piscarem em momentos diferentes
            });
        }
    }

    // Timeline para a sequência da animação de carregamento
    const loadingTl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    loadingTl.to(galaxyBg, { opacity: 1, scale: 1.2, duration: 2 })
             .to(blackholeCenter, { scale: 1, duration: 1.5, ease: "back.out(1.7)" }, "-=0.5")
             .to(loadingText, { opacity: 1, y: -20, duration: 1 }, "-=0.8")
             .to(loadingScreen, {
                 opacity: 0,
                 duration: 1.5,
                 delay: 2, // Espera um pouco antes de sumir
                 onComplete: () => {
                     loadingScreen.style.display = 'none';
                     mainContent.classList.remove('hidden');
                     animateMainContent();
                 }
             });

    createStars(100); // Cria 100 estrelas para a animação inicial

    // --- Animação do Conteúdo Principal e Envelope ---
    function animateMainContent() {
        gsap.timeline()
            .to(mainContent, { opacity: 1, y: 0, duration: 1 })
            .from(headerTitle, { opacity: 0, y: -50, duration: 1, ease: "back.out(1.7)" }, "-=0.5")
            .from(envelope, {
                scale: 0.5,
                opacity: 0,
                y: 50,
                rotation: 30,
                duration: 1,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.3")
            .fromTo(openEnvelopeBtn,
                { scale: 0, opacity: 0, y: -20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5"
            );
    }

    // --- Animação de Abrir Carta ---
    openEnvelopeBtn.addEventListener('click', () => {
        gsap.timeline()
            .to(openEnvelopeBtn, { opacity: 0, y: 50, duration: 0.4, ease: "power1.in" })
            .to(envelopeFlap, { rotationX: 180, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
            .to(envelope, { y: -50, scale: 0.9, duration: 0.5, ease: "power1.out" }, "-=0.4") // Pequeno pulo do envelope
            .set(letterContainer, { display: 'block', zIndex: 5 }) // Torna a carta visível, acima do envelope
            .fromTo(letterContainer,
                { opacity: 0, y: 200, scale: 0.5 },
                { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=0.3"
            )
            .to(envelope, { opacity: 0, duration: 0.5, ease: "power1.out", onComplete: () => {
                envelopeContainer.style.display = 'none'; // Esconde o envelope completamente
            }}, "-=0.5")
            .from(letterBodyParagraphs, {
                opacity: 0,
                y: 20,
                stagger: 0.1, // Anima cada parágrafo com um pequeno atraso
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8"); // Começa a animar o texto um pouco antes do envelope sumir
    });
});