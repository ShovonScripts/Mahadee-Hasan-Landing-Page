/**
 * Mahadee Hasan Landing Page - Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Set Current Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Sticky Navbar on Scroll ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 3. Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Create mobile menu structure if hamburger exists
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // We'll toggle a class on body to prevent scrolling and show the menu
            document.body.classList.toggle('nav-open');

            // Simple animated toggle using inline styles for a drop-down effect
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(5, 24, 12, 0.98)';
                navLinks.style.padding = '1.5rem';
                navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                navLinks.style.gap = '1rem';
                navLinks.style.borderTop = '1px solid rgba(212, 175, 55, 0.3)';
                hamburger.innerHTML = '<i class="fas fa-times" style="font-size:1.5rem; color:#d4af37;"></i>';
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    navLinks.style.display = 'none';
                    document.body.classList.remove('nav-open');
                    hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
                }
            });
        });
    }

    // Reset styles on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'row';
            navLinks.style.position = 'static';
            navLinks.style.width = 'auto';
            navLinks.style.padding = '0';
            navLinks.style.boxShadow = 'none';
            navLinks.style.backgroundColor = 'transparent';
        } else if (navLinks && navLinks.style.display === 'flex') {
            // If resizing from desktop down and menu was open, reset it closed
            navLinks.style.display = 'none';
            if (hamburger) {
                hamburger.innerHTML = '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
            }
        }
    });

    // --- 4. Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate.scroll-reveal');

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before the element comes into view
        threshold: 0.1 // Percentage of element visibility required
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add active class to trigger CSS animation
                entry.target.classList.add('active');

                // Stop observing once animated to prevent repeating
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each element
    animatedElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. Active Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset for navbar height
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    });

    // --- 6. Contact Form Submission (AJAX) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formStatus = document.getElementById('formStatus');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('span');
            const originalBtnText = btnText.innerText;

            // Set loading state
            btnText.innerText = 'Sending...';
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.innerHTML = '';

            const formData = new FormData(this);

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.status === 'success') {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                    this.reset();
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (data.message || 'Something went wrong.');
                }
            } catch (error) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> An error occurred while sending the message. Please try again later.';
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                btnText.innerText = originalBtnText;
                submitBtn.disabled = false;

                // Hide status message after 5 seconds if it was successful
                if (formStatus.classList.contains('success')) {
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status'; // Reset class
                    }, 5000);
                }
            }
        });
    }
});
