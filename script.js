/* 
===============================================
 Dexuan Children's Development Programme 
 JavaScript Main File 
=============================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Translation System */
    // Restore saved language preference, default to 'en' (English)
    let currentLang = localStorage.getItem('dexuanLang') || 'en';
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
            // Save language preference so it persists across pages
            localStorage.setItem('dexuanLang', currentLang);
            updateLanguage();
            updateAnnouncement();
        });
    }

    /* 2. Top Announcement Marquee (Continuous) */
    const announcementText = document.getElementById('announcement-text');
    const messagesEn = [
        "🌟 More than a class. A journey of growth for both child and family.",
        "🌟 A place where children are transformed, and family values are strengthened.",
        "🌟 Building character. Strengthening families.",
        "🌟 A place where children grow in character, and families grow together."
    ];
    const messagesZh = [
        "🌟 在這裡，改變的不只是孩子，還有整個家庭的方向。",
        "🌟 一個真正改變孩子，也凝聚家庭價值的地方。",
        "🌟 以品格為根基，成就孩子一生的改變。",
        "🌟 讓孩子的改變，從家庭開始。"
    ];

    function updateAnnouncement() {
        if (announcementText) {
            const msgs = currentLang === 'en' ? messagesEn : messagesZh;
            announcementText.innerHTML = msgs.join(" &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; ");
        }
    }

    // Initialize content
    updateLanguage();
    updateAnnouncement();

    /* 3. Sticky Navbar & Mobile Menu Scroll */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }

        // Auto-close the mobile menu when scrolling
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    /* 4. Mobile Menu Toggle */
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

    /* 8. Gallery Lightbox Logic */
    const galleryImages = document.querySelectorAll('.gallery-card img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                // Slight delay to allow display:block to apply before adding opacity class
                setTimeout(() => {
                    lightbox.classList.add('show');
                }, 10);
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden'; // Lock background scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = ''; // Unlock background scrolling
            }, 300); // Wait for transition to finish
        };

        lightboxClose.addEventListener('click', closeLightbox);

        // Close if clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }

    /* 9. WhatsApp Floating Widget Logic */
    const waFloatingBtn = document.getElementById('waFloatingBtn');
    const waPopup = document.getElementById('waPopup');
    const waCloseBtn = document.getElementById('waCloseBtn');
    const waWidget = document.querySelector('.wa-floating-widget');
    const contactSection = document.getElementById('contact');

    if (waFloatingBtn && waPopup && waCloseBtn) {
        waFloatingBtn.addEventListener('click', () => {
            waPopup.classList.toggle('show');
        });

        waCloseBtn.addEventListener('click', () => {
            waPopup.classList.remove('show');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!waPopup.contains(e.target) && !waFloatingBtn.contains(e.target)) {
                waPopup.classList.remove('show');
            }
        });
    }

    // Show/hide WhatsApp widget based on scroll position
    if (waWidget) {
        // If there's a contact section, show widget when scrolling near it
        // Otherwise (e.g. gallery page), always show the widget
        if (contactSection) {
            window.addEventListener('scroll', () => {
                const contactTop = contactSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (contactTop <= windowHeight + 100) {
                    waWidget.classList.add('wa-visible');
                } else {
                    waWidget.classList.remove('wa-visible');
                    if (waPopup) waPopup.classList.remove('show');
                }
            });
        } else {
            // No contact section on this page, always show
            waWidget.classList.add('wa-visible');
        }
    }
});

