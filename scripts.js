const siteMotion = (() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.body.classList.add('js-ready');
        return;
    }

    const targets = document.querySelectorAll('.hero-content, header .header-inner, .card, footer .footer-col');
    targets.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 560)}ms`);
    });

    const observer = new IntersectionObserver(
        (entries, observerRef) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('visible');
                observerRef.unobserve(entry.target);
            });
        },
        { threshold: 0.18 }
    );

    document.body.classList.add('js-ready');
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();

const formValidation = (() => {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        let isValid = true;
        const errors = [];

        // Get form elements
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const service = document.getElementById('service').value;
        const terms = document.getElementById('terms').checked;

        // Validate name
        if (name.length < 2) {
            isValid = false;
            errors.push('Name must be at least 2 characters long.');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            isValid = false;
            errors.push('Please enter a valid email address.');
        }

        // Validate phone
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone) || phone.length < 7) {
            isValid = false;
            errors.push('Please enter a valid phone number.');
        }

        // Validate date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        if (selectedDate < today) {
            isValid = false;
            errors.push('Preferred date cannot be in the past.');
        }

        // Validate time (basic check for reasonable hours)
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes;
            const openStart = 9 * 60; // 9:00
            const openEnd = 18 * 60; // 18:00
            if (totalMinutes < openStart || totalMinutes > openEnd) {
                isValid = false;
                errors.push('Preferred time must be between 9:00 AM and 6:00 PM.');
            }
        }

        // Validate service
        if (!service) {
            isValid = false;
            errors.push('Please select a service.');
        }

        // Validate terms
        if (!terms) {
            isValid = false;
            errors.push('You must agree to the terms and conditions.');
        }

        if (!isValid) {
            e.preventDefault();
            alert('Please correct the following errors:\n' + errors.join('\n'));
        }
    });
})();
