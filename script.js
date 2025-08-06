// Particles configuration with galaxy theme
let particlesLoaded = false;

function getParticlesOptions() {
    return {
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "repulse" },
                onHover: { enable: true, mode: "grab" },
            },
            modes: {
                repulse: { distance: 200, duration: 0.4 },
                grab: { distance: 150, links: { opacity: 1 } },
                bubble: { distance: 200, size: 10, duration: 2, opacity: 0.8 },
            },
        },
        particles: {
            color: { value: ["#93C5FD", "#38BDF8"] },
            links: {
                color: "#93C5FD",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: true,
                speed: 0.3,
                straight: false,
            },
            number: { density: { enable: true, area: 1000 }, value: 120 },
            opacity: {
                value: 0.6,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                }
            },
            shape: { type: "circle" },
            size: {
                value: { min: 1, max: 4 },
                random: true,
                animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.5,
                    sync: false
                }
            },
        },
        detectRetina: true,
    };
}

async function initParticles() {
    try {
        if (typeof tsParticles === 'undefined') return;
        await tsParticles.load("particles-container", getParticlesOptions());
        particlesLoaded = true;
    } catch (error) {
        console.error("Error loading particles:", error);
    }
}

function waitForParticles() {
    if (typeof tsParticles !== 'undefined') {
        initParticles();
    } else {
        setTimeout(waitForParticles, 100);
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navbar = document.querySelector('nav');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            const offset = navbar.offsetHeight;
            const top = target.offsetTop - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// Fade-in on scroll
function animateOnScroll() {
    document.querySelectorAll('.fade-in').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
}

// Scroll progress indicator
function updateScrollProgress() {
    const win = document.documentElement;
    const pct = (win.scrollTop / (win.scrollHeight - window.innerHeight)) * 100;
    document.querySelector('.scroll-indicator').style.width = pct + '%';
}

// Parallax hero
function updateParallax() {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.hero-content').forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Glow effects
function addGlowEffects() {
    document.querySelectorAll('.btn, .skill-category, .project-card, .social-link')
    .forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            if (el.classList.contains('btn-primary')) {
                el.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
            } else {
                el.style.boxShadow = '';
            }
        });
    });
}

// Typing effect
function typeWriter(el, text, speed = 100) {
    let i = 0;
    el.innerHTML = '';
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i++);
            setTimeout(type, speed);
        }
    }
    type();
}

// Stagger fade-in
function initStaggerAnimations() {
    document.querySelectorAll('.skill-category').forEach((card,i) => {
        card.style.animationDelay = `${i * 0.1}s`;
        card.classList.add('fade-in');
    });
    document.querySelectorAll('.project-card').forEach((card,i) => {
        card.style.animationDelay = `${i * 0.2}s`;
        card.classList.add('fade-in');
    });
}

// Ripple effect
function createRipple(e) {
    const btn = e.currentTarget;
    const dia = Math.max(btn.clientWidth, btn.clientHeight);
    const rad = dia / 2;
    const circle = document.createElement('span');
    circle.style.width = circle.style.height = `${dia}px`;
    circle.style.left = `${e.clientX - btn.offsetLeft - rad}px`;
    circle.style.top  = `${e.clientY - btn.offsetTop  - rad}px`;
    circle.classList.add('ripple');
    const old = btn.querySelector('.ripple');
    if (old) old.remove();
    btn.appendChild(circle);
}

// Set up ripple CSS & listeners
function initRipple() {
    const style = document.createElement('style');
    style.textContent = `
        .btn { position: relative; overflow: hidden; }
        .ripple {
            position: absolute; border-radius: 50%;
            background-color: rgba(255,255,255,0.3);
            transform: scale(0); animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
}

// Section‐in‐view Highlighting + Navbar background swap
function initSectionObserver() {
    const navbar = document.querySelector('nav');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            if (!id) return;
            const link = document.querySelector(`.nav-links a[data-section="${id}"]`);
            if (entry.isIntersecting) {
                // highlight
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');

                // navbar bg
                if (id === 'home') {
                    navbar.style.background = 'transparent';
                    navbar.style.boxShadow = 'none';
                    document.querySelector('.hero').style.zIndex = '0';
                } else {
                    const bg = window.getComputedStyle(entry.target).backgroundColor;
                    navbar.style.background = bg;
                    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                }

                if (id === 'about') {
                    document.querySelector('.hero').style.zIndex = '-1';
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
}

// ─── Initialize everything ───
document.addEventListener('DOMContentLoaded', () => {
    waitForParticles();
    initSmoothScroll();
    animateOnScroll();
    updateScrollProgress();
    initStaggerAnimations();
    addGlowEffects();
    initRipple();
    initSectionObserver();

    // typing
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const txt = heroTitle.textContent;
        setTimeout(() => typeWriter(heroTitle, txt, 80), 500);
    }
});

// on scroll
window.addEventListener('scroll', () => {
    animateOnScroll();
    updateScrollProgress();
    updateParallax();
});
