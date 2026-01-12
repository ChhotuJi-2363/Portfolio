/**
 * Portfolio Website - Custom JavaScript
 * Author: Chhotu Verma
 * 
 * This file handles:
 * - Smooth scrolling navigation
 * - Navbar scroll effects
 * - Active navigation highlighting
 * - Form validation
 * - Animations on scroll
 */

(function() {
    'use strict';

    /**
     * Initialize all functionality when DOM is loaded
     */
    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScrolling();
        initNavbarScroll();
        initActiveNavigation();
        initFormValidation();
        initScrollAnimations();
    });

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        // Get all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip empty hash or just #
                if (href === '#' || href === '') {
                    return;
                }
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calculate offset for fixed navbar
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    /**
     * Navbar scroll effects (change style on scroll)
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add 'scrolled' class when scrolling down
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    /**
     * Highlight active navigation link based on scroll position
     */
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        function updateActiveNav() {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const scrollPosition = window.pageYOffset + navbarHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // Update on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Update on page load
        updateActiveNav();
    }

    /**
     * Form validation and submission handling
     */
    function initFormValidation() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        // Remove Bootstrap validation classes on input
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
                if (this.classList.contains('is-valid')) {
                    this.classList.remove('is-valid');
                }
            });
        });
        
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation flag
            let isValid = true;
            
            // Validate name
            if (name === '') {
                showFieldError('name', 'Please provide your name.');
                isValid = false;
            } else {
                showFieldSuccess('name');
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                showFieldError('email', 'Please provide your email address.');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                showFieldError('email', 'Please provide a valid email address.');
                isValid = false;
            } else {
                showFieldSuccess('email');
            }
            
            // Validate message
            if (message === '') {
                showFieldError('message', 'Please provide a message.');
                isValid = false;
            } else if (message.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long.');
                isValid = false;
            } else {
                showFieldSuccess('message');
            }
            
            // If form is valid, handle submission
            if (isValid) {
                handleFormSubmission(name, email, message);
            } else {
                // Add was-validated class to show errors
                contactForm.classList.add('was-validated');
            }
        });
    }

    /**
     * Show field error state
     */
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const feedback = field.nextElementSibling;
        
        field.classList.add('is-invalid');
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
    }

    /**
     * Show field success state
     */
    function showFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }

    /**
     * Handle form submission
     * Note: In a real application, you would send this data to a server
     */
    function handleFormSubmission(name, email, message) {
        // Create mailto link as a simple solution
        // In production, you would typically send this to a backend API
        const subject = encodeURIComponent('Contact Form Submission from Portfolio');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:Princeraaz363@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showFormSuccess();
        
        // Reset form after a delay
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            const formInputs = document.querySelectorAll('#contactForm .form-control');
            formInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }, 2000);
    }

    /**
     * Show form submission success message
     */
    function showFormSuccess() {
        // Create success alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>Success!</strong> Your message has been prepared. 
            Please send it from your email client, or contact me directly at Princeraaz363@gmail.com
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(alertDiv, form.nextSibling);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }

    /**
     * Animate elements on scroll (Intersection Observer)
     */
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            return; // Fallback for older browsers
        }
        
        // Create observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements (cards, sections, etc.)
        const animatedElements = document.querySelectorAll('.skill-card, .project-card, .experience-card, .about-content');
        animatedElements.forEach((el, index) => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            // Observe element
            observer.observe(el);
        });
    }

    /**
     * Utility function to debounce scroll events
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll handlers with debouncing
    const optimizedScrollHandler = debounce(function() {
        // This can be used for any scroll-based functions that need optimization
    }, 100);

})();
