document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const initialCardWrapper = document.getElementById('initial-card-wrapper');
    const initialCard = document.getElementById('initial-card');
    const openLetterBtn = document.getElementById('open-letter-btn');
    const letterContainer = document.getElementById('letter-container');
    const letterContentSection = document.getElementById('letter-content');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const backgroundMusic = document.getElementById('background-music');
    const readAgainBtn = document.getElementById('read-again-btn');

    // Text content for the letter
    const letterParagraphs = [
        "Tem algo em você que acalma, mesmo quando tudo ao redor parece um caos. É o jeito como fala, como sorri, como olha. Você tem essa aura leve e ao mesmo tempo tão forte, como se conseguisse, sem perceber, mudar o dia de alguém só com a tua presença.",
        "Sabe aquelas pessoas que são difíceis de esquecer? Então… você é exatamente isso. Mas o mais bonito é que não é por grandes gestos, é pelos pequenos. Pelo seu jeitinho de cuidar, de provocar, de se preocupar mesmo sem dizer. Pela forma como seu nome aparece na notificação e, por um instante, tudo parece melhor.",
        "Você tem uma mistura única de doçura com firmeza. Uma calma que chega junto de uma personalidade forte, marcante, impossível de ignorar. Dá vontade de te ouvir por horas, mesmo que seja só sobre coisas bobas — porque até nas bobagens você é interessante.",
        "E aí entra outro ponto… você é linda. De verdade. Daquelas que hipnotiza. Teus olhos, meu Deus… eles brilham de um jeito que parece que o mundo inteiro mora dentro deles. Um brilho que não se explica, só se sente. Quando você sorri com os olhos — e você faz isso sem nem notar — parece que tudo ao redor para.",
        "Seu sorriso então… é outro universo. Tem luz, tem verdade, tem aquele calorzinho que acerta o peito. Um sorriso teu vale o dia inteiro. E não é só o sorriso — teu rosto todo tem uma delicadeza que encanta. A pele, seu cabelo, até a forma como você vira o rosto quando ri… tudo em você parece feito com carinho.",
        "E mesmo com toda essa beleza por fora, o que mais me fascina é o que tem por dentro. Tua inteligência, tua sensibilidade, teu senso de justiça. Você tem atitude, tem opinião, e ainda assim consegue ser leve, fofa e carismática. Tem gente que tenta ser tudo isso e falha. Você é tudo isso sem esforço.",
        "Tem uma energia em você que atrai, que acolhe, que faz querer estar perto. Você é linda sim, mas não só de aparência — você é linda por inteiro. E se você se olhasse com os meus olhos, nem teria coragem de duvidar disso nem por um segundo.",
        "Por isso, se algum dia o mundo pesar, se as inseguranças baterem, volta aqui. Lê isso de novo. Porque você é muito mais do que imagina. É alguém que encanta só por ser quem é. É alguém que transforma só com um olhar. E eu sou só mais um que teve a sorte de te notar… e não conseguir mais parar de notar."
    ];

    const signatureText = "Com carinho, orgulho e esse sorriso bobo que você me faz ter só de pensar em ti…<br>Teu Schissl.";
    const psNoteText = "Ps: você é linda, irresistível e completamente única. Nunca esquece disso, tá?<br>Te admiro demais — por fora, por dentro e por inteiro.";
    const finalMessageText = "Te cuida, coisa linda<br>🌹✨🧡";

    // --- Loading Screen Logic ---
    window.addEventListener('load', () => {
        // Simula um carregamento mínimo para que a tela não desapareça instantaneamente
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.classList.remove('hidden');
                document.body.style.overflow = 'auto'; // Habilita o scroll do body se necessário
                generateFloatingHearts(15); // Gera corações após o carregamento
            }, 1000); // Tempo da transição de fade-out
        }, 500); // Tempo mínimo de exibição da tela de carregamento
    });

    // --- Floating Hearts Logic ---
    const floatingHeartsContainer = document.getElementById('floating-hearts-container');

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️'; // Ou use uma imagem/SVG: <img src="assets/heart.png">
        heart.style.left = `${Math.random() * 100}vw`; // Posição X aleatória
        heart.style.animationDuration = `${Math.random() * 8 + 5}s`; // Duração aleatória (5-13s)
        heart.style.animationDelay = `${Math.random() * 3}s`; // Delay aleatório para não começarem juntos
        heart.style.setProperty('--rand-x', (Math.random() - 0.5) * 200); // Movimento lateral aleatório
        floatingHeartsContainer.appendChild(heart);

        // Remove heart after animation to prevent memory leak
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    function generateFloatingHearts(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(createHeart, Math.random() * 2000); // Stagger creation
        }
        setInterval(createHeart, 1500); // Continuously add new hearts
    }

    // --- Letter Opening Logic ---
    openLetterBtn.addEventListener('click', () => {
        // Animação de "fechar" o cartão inicial
        initialCard.style.transform = 'rotateY(90deg)';
        initialCard.style.opacity = '0';
        initialCardWrapper.style.pointerEvents = 'none'; // Desabilita cliques

        setTimeout(() => {
            initialCardWrapper.style.display = 'none'; // Remove o cartão inicial

            // Exibe o container da carta e inicia a animação de entrada
            letterContainer.style.display = 'block';
            setTimeout(() => {
                letterContainer.classList.add('visible');
                typeLetterContent(); // Inicia a digitação do poema
                if (backgroundMusic) {
                    backgroundMusic.volume = 0.4; // Define o volume
                    backgroundMusic.play().catch(e => console.error("Erro ao tocar música:", e));
                }
            }, 100); // Pequeno atraso para a transição do display

        }, 800); // Tempo para a animação de fechar o cartão inicial
    });

    // --- Typewriter Effect for Letter Content ---
    let paragraphIndex = 0;
    const typingSpeed = 50; // ms per character
    const paragraphDelay = 1000; // ms between paragraphs

    function typeParagraph(pElement, text, callback) {
        let charIndex = 0;
        function type() {
            if (charIndex < text.length) {
                pElement.textContent += text.charAt(charIndex);
                charIndex++;
                requestAnimationFrame(() => setTimeout(type, typingSpeed));
            } else {
                if (callback) callback();
            }
        }
        pElement.classList.add('visible'); // Makes the paragraph element visible before typing starts
        type();
    }

    function typeLetterContent() {
        if (paragraphIndex < letterParagraphs.length) {
            const p = document.createElement('p');
            letterContentSection.appendChild(p);

            typeParagraph(p, letterParagraphs[paragraphIndex], () => {
                paragraphIndex++;
                setTimeout(typeLetterContent, paragraphDelay); // Next paragraph after delay
            });
        } else {
            // All main paragraphs typed, now for the footer
            typeFooterContent();
            // Show scroll indicator if content overflows
            if (letterContentSection.scrollHeight > letterContentSection.clientHeight) {
                scrollIndicator.style.display = 'block';
            } else {
                scrollIndicator.style.display = 'none';
            }
        }
    }

    function typeFooterContent() {
        const signatureElement = letterContainer.querySelector('.signature');
        const psNoteElement = letterContainer.querySelector('.ps-note');
        const finalMessageElement = letterContainer.querySelector('.final-message');

        signatureElement.innerHTML = signatureText;
        psNoteElement.innerHTML = psNoteText;
        finalMessageElement.innerHTML = finalMessageText;

        // Animate visibility for footer elements
        setTimeout(() => {
            signatureElement.classList.add('visible');
        }, 500);
        setTimeout(() => {
            psNoteElement.classList.add('visible');
        }, 1500);
        setTimeout(() => {
            finalMessageElement.classList.add('visible');
            readAgainBtn.classList.remove('hidden'); // Show read again button
        }, 2500);
    }

    // --- Scroll Visibility for already displayed paragraphs (if typing effect is not used for all) ---
    // (This part is less critical if typing effect is used for all paragraphs)
    const updateParagraphVisibility = () => {
        const containerTop = letterContentSection.scrollTop;
        const containerBottom = containerTop + letterContentSection.clientHeight;
        const paragraphs = [...letterContentSection.querySelectorAll('p')]; // Get all p tags in section

        paragraphs.forEach(p => {
            const pTop = p.offsetTop;
            const pBottom = pTop + p.offsetHeight;

            // Check if paragraph is in view and add 'visible' class
            if (pBottom > containerTop && pTop < containerBottom) {
                // If we're using typing effect, 'visible' is added there.
                // This is for ensuring elements are visible on scroll after initial render/type.
                if (!p.classList.contains('visible')) {
                    p.classList.add('visible');
                }
            } else {
                // p.classList.remove('visible'); // Optionally remove if out of view, but can be jarring with typing
            }
        });

        // Hide scroll indicator if at the bottom
        if (letterContentSection.scrollHeight - letterContentSection.scrollTop === letterContentSection.clientHeight) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    };

    letterContentSection.addEventListener('scroll', updateParagraphVisibility);
    // Initial check in case content is short and no scroll is needed
    // setTimeout(updateParagraphVisibility, 3000); // Delay to allow typing to start

    // --- Read Again Button Logic ---
    readAgainBtn.addEventListener('click', () => {
        // Reset letter state
        paragraphIndex = 0;
        letterContentSection.innerHTML = ''; // Clear existing content
        letterContainer.querySelector('.signature').innerHTML = '';
        letterContainer.querySelector('.ps-note').innerHTML = '';
        letterContainer.querySelector('.final-message').innerHTML = '';
        readAgainBtn.classList.add('hidden'); // Hide button

        // Scroll to top
        letterContentSection.scrollTop = 0;

        // Restart typing animation
        typeLetterContent();
    });

    // Handle background music play/pause based on user interaction (important for autoplay policies)
    // The play() is called on button click, which is usually allowed.
    // However, if the user leaves the tab, the music might stop.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            backgroundMusic.pause();
        } else {
            // Only attempt to play if it was already playing before
            if (backgroundMusic.paused === false) { // This check is tricky. Better to rely on user action.
                // Or: backgroundMusic.play().catch(e => console.log("Music play blocked: ", e));
            }
        }
    });

});
