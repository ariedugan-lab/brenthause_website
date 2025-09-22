// Brenthaüse.com - Main JavaScript
// Smooth scrolling and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        // Link button to the controlled menu
        const controlsId = navToggle.getAttribute('aria-controls');
        const controlledMenu = controlsId ? document.getElementById(controlsId) : navMenu;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            const next = !isExpanded;
            navToggle.setAttribute('aria-expanded', String(next));

            // Toggle classes and data attribute for CSS hooks
            controlledMenu.classList.toggle('nav__menu--open', next);
            controlledMenu.dataset.open = String(next);
            navToggle.classList.toggle('nav__toggle--open', next);
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                    navMenu.classList.remove('nav__menu--open');
                    navToggle.classList.remove('nav__toggle--open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('.contact__form');
    if (contactForm) {
        // Phone input masking
        const phoneInput = contactForm.querySelector('#phone');
        const countryCode = contactForm.querySelector('#country_code');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const numbers = this.value.replace(/\D/g, '').slice(0, 10);
                const parts = [];
                if (numbers.length > 0) parts.push(numbers.slice(0, 3));
                if (numbers.length > 3) parts.push(numbers.slice(3, 6));
                if (numbers.length > 6) parts.push(numbers.slice(6, 10));
                this.value = parts
                    .map((p, idx) => (idx === 0 ? p : p.padStart(idx === 1 ? 3 : 4, '')))
                    .join('-');
            });
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm(this);
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about__feature, .service-card, .process-step, .testimonial');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Form validation function
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Clear previous errors
    const errorElements = form.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });

    // Basic required + email validation
    requiredFields.forEach(field => {
        const errorElement = document.getElementById(field.id + '-error');
        const value = (field.type === 'file') ? (field.files && field.files.length ? 'has-files' : '') : field.value.trim();

        if (!value) {
            showError(field, errorElement, 'This field is required');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, errorElement, 'Please enter a valid email address');
            isValid = false;
        }
    });

    // Phone format validation (111-111-1111)
    const phoneInput = form.querySelector('#phone');
    if (phoneInput && phoneInput.value.trim()) {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        if (!phonePattern.test(phoneInput.value)) {
            const phoneError = document.getElementById('phone-error');
            showError(phoneInput, phoneError, 'Use format 111-111-1111');
            isValid = false;
        }
    }

    // Revenue must be a positive number
    const revenueInput = form.querySelector('#monthly_revenue');
    if (revenueInput) {
        const raw = String(revenueInput.value || '').replace(/[,\s]/g, '');
        const revenue = parseFloat(raw);
        if (!(revenue > 0)) {
            const revenueError = document.getElementById('monthly_revenue-error');
            showError(revenueInput, revenueError, 'Enter a positive amount');
            isValid = false;
        }
    }

    // At least 4 bank statements must be uploaded
    const statementsInput = form.querySelector('#bank_statements');
    if (statementsInput) {
        const count = (statementsInput.files && statementsInput.files.length) || 0;
        if (count < 4) {
            const statementsError = document.getElementById('bank_statements-error');
            showError(statementsInput, statementsError, 'Upload at least 4 bank statements');
            isValid = false;
        }
    }

    if (isValid) {
        form.submit();
    }
}

function showError(field, errorElement, message) {
    field.classList.add('form-input--error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification notification--success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS for animations and mobile menu
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-input--error {
        border-color: #EF4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .header--scrolled {
        background-color: rgba(0, 0, 0, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);
// Floating CTA reveal on scroll
(function() {
  const floatingCta = document.getElementById('floating-cta');
  const hero = document.getElementById('hero');
  if (!floatingCta || !hero) return;

  const reveal = (show) => {
    floatingCta.classList.toggle('floating-cta--visible', show);
    floatingCta.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  // Use IntersectionObserver for smooth, performant detection
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // When hero is not intersecting (scrolled past), show the button
      reveal(!entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  observer.observe(hero);

  // Fallback in case IntersectionObserver is unavailable
  if (!('IntersectionObserver' in window)) {
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      reveal(rect.bottom <= 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
// Floating CTA reveal on scroll
(function() {
  const floatingCta = document.getElementById('floating-cta');
  const hero = document.getElementById('hero');
  if (!floatingCta || !hero) return;

  const reveal = (show) => {
    floatingCta.classList.toggle('floating-cta--visible', show);
    floatingCta.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      reveal(!entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  observer.observe(hero);

  if (!('IntersectionObserver' in window)) {
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      reveal(rect.bottom <= 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
