// scripts.js - Nasir Digital Consultancy Limited

// 1. Navigation & Mobile Menu Menu
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// 2. Accordion Logic for Implementation Section
const accordions = document.querySelectorAll('.acc-item');

accordions.forEach(acc => {
    const header = acc.querySelector('.acc-header');
    header.addEventListener('click', () => {
        // Close others
        accordions.forEach(item => {
            if (item !== acc) {
                item.classList.remove('active');
            }
        });
        // Toggle current
        acc.classList.toggle('active');
    });
});

// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
        });

        // Toggle the clicked FAQ
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});

// 3. Dynamic Canvas Background (Particles/Orbs)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(123, 44, 191, 0.4)' : 'rgba(247, 127, 0, 0.4)'; // Purple or Orange
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Responsive count
    for (let i = 0; i < particleCount; i++) {
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

initParticles();
animateParticles();

// Reset particles on significant resize
window.addEventListener('resize', () => {
    initParticles();
});

// 4. GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Sequence
const heroTl = gsap.timeline();
heroTl.from(".navbar", { y: -50, opacity: 0, duration: 1, ease: "power3.out" })
    .from(".gs-reveal", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.5");

// Fade Up Elements
gsap.utils.toArray('.gs-fade-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// Fade Left Elements (Coming from left)
gsap.utils.toArray('.gs-fade-right').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Fade Right Elements (Coming from right)
gsap.utils.toArray('.gs-fade-left').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Staggered Cards (Services & Steps)
const staggerSections = ['.services-grid', '.steps-container'];

staggerSections.forEach(selector => {
    const parent = document.querySelector(selector);
    if (parent) {
        gsap.fromTo(parent.children,
            {
                y: 50,
                opacity: 0
            },
            {
                scrollTrigger: {
                    trigger: parent,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out"
            }
        );
    }
});

// 5. Contact Form Ajax Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(this);

        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                submitBtn.innerHTML = 'Message Sent! <span class="arrow">✓</span>';
                submitBtn.style.background = 'linear-gradient(135deg, #166534, #22c55e)'; // Green success
                this.reset();
            } else {
                // Show error message from server
                submitBtn.innerHTML = 'Failed to Send. Try WhatsApp instead.';
                submitBtn.style.background = 'rgb(220, 38, 38)'; // Red error
                console.error(result.message);
            }
        } catch (error) {
            // General fetch error
            submitBtn.innerHTML = 'Network Error. Try WhatsApp instead.';
            submitBtn.style.background = 'rgb(220, 38, 38)';
            console.error('Error submitting form:', error);
        }

        // Reset button after 5 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.background = ''; // reset to default css gradient
        }, 5000);
    });
}