/* 
===============================================
 Dexuan Children's Development Programme 
 JavaScript Main File 
=============================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Translation System */
    let currentLang = 'en';
    const langToggleBtn = document.getElementById('langToggleBtn');

    function updateLanguage() {
        // Update all standard translation targets
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[currentLang] && translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key]; // innerHTML allows HTML tags like <strong>
            }
        });

        // Update placeholder texts for inputs
        document.querySelectorAll('[data-placeholder-translate]').forEach(el => {
            const key = el.getAttribute('data-placeholder-translate');
            if (translations[currentLang] && translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });

        // Update the button text
        langToggleBtn.textContent = currentLang === 'en' ? '中文' : 'ENG';
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            updateLanguage();
        });
    }

    /* 2. Top Announcement Marquee (Flashing Text) */
    const announcementText = document.getElementById('announcement-text');
    const messagesEn = [
        "A place where children are transformed, and family values are strengthened.",
        "Building character. Strengthening families.",
        "A place where children grow in character, and families grow together."
    ];
    const messagesZh = [
        "在这里孩子重塑自我，家庭价值观更加坚定。",
        "培养品格，凝聚家庭。",
        "一个孩子与家庭共同汲取力量、并肩成长的地方。"
    ];
    let messageIndex = 0;

    // Change text every 4 seconds (matching CSS animation)
    setInterval(() => {
        const msgs = currentLang === 'en' ? messagesEn : messagesZh;
        messageIndex = (messageIndex + 1) % msgs.length;

        // Update custom announcement messages manually
        if (announcementText) {
            // Just set text content, but don't overwrite translate tags if we are on index 0
            // since index 0 is mapped in translations object. We just manually insert texts here.
            announcementText.textContent = msgs[messageIndex];
        }
    }, 4000);

    /* 3. Sticky Navbar */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    /* 4. Mobile Menu Toggle */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    /* Close mobile menu when a link is clicked */
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /* 5. Intersection Observer for Scroll Reveals */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* 6. Smooth Scrolling for Anchor Links */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* 7. About Us Tab Menu Logic */
    const aboutNavItems = document.querySelectorAll('.about-menu li');
    const aboutPanes = document.querySelectorAll('.about-pane');

    aboutNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all tabs
            aboutNavItems.forEach(nav => nav.classList.remove('active'));
            aboutPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});

