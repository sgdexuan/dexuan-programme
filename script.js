/* 
===============================================
 Dexuan Children's Development Programme 
 JavaScript Main File 
=============================================== 
*/

let currentLang = localStorage.getItem('dexuanLang') || 'en';
let langToggleBtn = null;
let announcementText = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeSite();
});

async function initializeSite() {
    await loadSharedLayout();

    setupLanguage();
    setupAnnouncement();
    setupNavbar();
    setupMobileMenu();
    setupRevealAnimations();
    setupSmoothScrolling();
    setupAboutTabs();
    setupGalleryLightbox();
    setupContactForm();
    setupWhatsAppWidget();

    window.dispatchEvent(new Event('scroll'));
}

async function loadSharedLayout() {
    const headerSlot = document.getElementById('site-header');
    const footerSlot = document.getElementById('site-footer');

    if (!headerSlot && !footerSlot) {
        return;
    }

    try {
        const layoutHtml = await getSharedLayoutHtml();
        const parsedLayout = new DOMParser().parseFromString(layoutHtml, 'text/html');
        const sharedHeader = parsedLayout.querySelector('.header-wrapper');
        const sharedFooter = parsedLayout.querySelector('footer');

        if (headerSlot && sharedHeader) {
            headerSlot.replaceWith(sharedHeader);
        }

        if (footerSlot && sharedFooter) {
            footerSlot.replaceWith(sharedFooter);
        }

        if (document.body.dataset.page === 'gallery') {
            normalizeGalleryHeaderLinks();
        }
    } catch (error) {
        console.error(error);
    }
}

async function getSharedLayoutHtml() {
    if (window.location.protocol !== 'file:') {
        try {
            const response = await fetch('shared-header-footer.html', { cache: 'no-cache' });
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.warn('Falling back to inline shared layout.', error);
        }
    }

    return `
<div class="header-wrapper">
    <div class="top-announcement">
        <div class="announcement-content" id="announcement-text">
            🌟 More than a class. A journey of growth for both child and family time.
        </div>
    </div>
    <nav id="navbar">
        <div class="container nav-container">
            <a href="#home" class="logo">
                <img class="logo-img" src="assets/Dexuan_logo_bg.png" alt="Dexuan Character Academy logo">
                <span class="logo-text" data-translate="logo_text">Dexuan<br><small>Character Academy</small></span>
            </a>
            <div class="nav-links">
                <a href="#home" data-translate="nav_home">Home</a>
                <a href="#about" data-translate="nav_about">About Us</a>
                <a href="gallery.html" data-translate="nav_gallery">Gallery</a>
                <a href="#why-choose-us" data-translate="nav_why_us">Why Choose Us</a>
                <a href="#programme" data-translate="nav_programme">Programme</a>
                <a href="#contact" class="btn btn-outline btn-sm" data-translate="nav_enrol">Contact Us</a>
                <a href="https://forms.gle/Ft4GAnRMrwTL34HM6" target="_blank" class="btn btn-primary btn-sm" data-translate="nav_register">Enrol Now</a>
            </div>
            <div class="nav-right-controls" style="display: flex; align-items: center; gap: 15px;">
                <button id="langToggleBtn" class="lang-btn">中文</button>
                <div class="mobile-menu-btn">
                    <i class="fa-solid fa-bars"></i>
                </div>
            </div>
        </div>
    </nav>
</div>

<footer>
    <div class="container text-center">
        <a href="index.html" class="footer-brand">
            <img class="footer-logo-img" src="assets/Dexuan_logo_footer.png" alt="Dexuan Character Academy logo">
            <span class="footer-logo-text" data-translate="logo_text">Dexuan<br><small>Character Academy</small></span>
        </a>
        <p data-translate="footer_p">A children’s programme centred on character development, helping young learners
            build self-discipline, confidence, and strong values through meaningful activities and real-life
            practice.</p>
        <p class="copyright" data-translate="footer_copy">&copy; 2026 Dexuan Character Academy. All rights
            reserved.</p>
    </div>
</footer>`;
}

function setupLanguage() {
    langToggleBtn = document.getElementById('langToggleBtn');

    function updateLanguage() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[currentLang] && translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });

        document.querySelectorAll('[data-placeholder-translate]').forEach(el => {
            const key = el.getAttribute('data-placeholder-translate');
            if (translations[currentLang] && translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });

        if (langToggleBtn) {
            langToggleBtn.textContent = currentLang === 'en' ? '中文' : 'ENG';
        }
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'zh' : 'en';
            localStorage.setItem('dexuanLang', currentLang);
            updateLanguage();
            updateAnnouncement();
        });
    }

    updateLanguage();
}

function setupAnnouncement() {
    announcementText = document.getElementById('announcement-text');
    updateAnnouncement();
}

function updateAnnouncement() {
    if (!announcementText) {
        return;
    }

    const messagesEn = [
        '🌟 More than a class. A journey of growth for both child and family.',
        '🌟 A place where children are transformed, and family values are strengthened.',
        '🌟 Building character. Strengthening families.',
        '🌟 A place where children grow in character, and families grow together.'
    ];
    const messagesZh = [
        '🌟 在這裡，改變的不只是孩子，還有整個家庭的方向。',
        '🌟 一個真正改變孩子，也凝聚家庭價值的地方。',
        '🌟 以品格為根基，成就孩子一生的改變。',
        '🌟 讓孩子的改變，從家庭開始。'
    ];

    const messages = currentLang === 'en' ? messagesEn : messagesZh;
    announcementText.innerHTML = messages.join(' &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp; ');
}

function setupNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (!navbar) {
            return;
        }

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }

        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
}

function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        });
    });
}

function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) {
        return;
    }

    let revealFrameId = null;

    const updateRevealStates = () => {
        revealFrameId = null;

        revealElements.forEach(element => {
            if (isElementVisible(element)) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    };

    const scheduleRevealUpdate = () => {
        if (revealFrameId !== null) {
            return;
        }

        revealFrameId = window.requestAnimationFrame(updateRevealStates);
    };

    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(scheduleRevealUpdate);
    });

    window.setTimeout(scheduleRevealUpdate, 75);

    window.addEventListener('scroll', scheduleRevealUpdate, { passive: true });
    window.addEventListener('load', scheduleRevealUpdate, { once: true });
    window.addEventListener('resize', scheduleRevealUpdate);
}

function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const viewportCoverage = visibleHeight / viewportHeight;

    return rect.left < viewportWidth && rect.right > 0 && viewportCoverage >= 0.1;
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                return;
            }

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
}

function setupAboutTabs() {
    const aboutNavItems = document.querySelectorAll('.about-menu li');
    const aboutPanes = document.querySelectorAll('.about-pane');

    aboutNavItems.forEach(item => {
        item.addEventListener('click', () => {
            aboutNavItems.forEach(nav => nav.classList.remove('active'));
            aboutPanes.forEach(pane => pane.classList.remove('active'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetPane = document.getElementById(targetId);

            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

function setupGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-card img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImg || !lightboxClose) {
        return;
    }

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.classList.add('show');
            }, 10);
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });
}

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Contact form submission failed');
            }

            contactForm.reset();
            showFormToast(
                translations[currentLang]?.form_submit_success || 'Thank you. Your enquiry has been sent successfully.',
                'success'
            );
        } catch (error) {
            console.error(error);
            showFormToast(
                translations[currentLang]?.form_submit_error || 'Sorry, we could not send your enquiry right now. Please try again later.',
                'error'
            );
        }
    });
}

function showFormToast(message, tone = 'success') {
    let toastHost = document.getElementById('form-toast-host');

    if (!toastHost) {
        toastHost = document.createElement('div');
        toastHost.id = 'form-toast-host';
        toastHost.className = 'form-toast-host';
        document.body.appendChild(toastHost);
    }

    toastHost.innerHTML = `
        <div class="form-toast form-toast-${tone}" role="status" aria-live="polite">
            <span class="form-toast-icon">${tone === 'success' ? '✓' : '!'}</span>
            <span class="form-toast-message">${message}</span>
            <button type="button" class="form-toast-close" aria-label="Dismiss message">×</button>
        </div>
    `;

    const toast = toastHost.querySelector('.form-toast');
    const closeBtn = toastHost.querySelector('.form-toast-close');

    const dismissToast = () => {
        if (!toast) {
            return;
        }

        toast.classList.add('is-hiding');
        window.setTimeout(() => {
            if (toastHost) {
                toastHost.innerHTML = '';
            }
        }, 240);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', dismissToast);
    }

    window.clearTimeout(showFormToast.hideTimer);
    showFormToast.hideTimer = window.setTimeout(dismissToast, 4200);
}

function setupWhatsAppWidget() {
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

        document.addEventListener('click', e => {
            if (!waPopup.contains(e.target) && !waFloatingBtn.contains(e.target)) {
                waPopup.classList.remove('show');
            }
        });
    }

    if (waWidget) {
        if (contactSection) {
            window.addEventListener('scroll', () => {
                const contactTop = contactSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (contactTop <= windowHeight + 100) {
                    waWidget.classList.add('wa-visible');
                } else {
                    waWidget.classList.remove('wa-visible');
                    if (waPopup) {
                        waPopup.classList.remove('show');
                    }
                }
            });
        } else {
            waWidget.classList.add('wa-visible');
        }
    }
}

function normalizeGalleryHeaderLinks() {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        return;
    }

    const logoLink = navbar.querySelector('.logo');
    if (logoLink) {
        logoLink.setAttribute('href', 'index.html#home');
    }

    navbar.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.setAttribute('href', `index.html${href}`);
        }
    });
}

