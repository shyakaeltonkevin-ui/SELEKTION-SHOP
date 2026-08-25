// ============================================================
// NAVBAR – open / close mobile menu
// ============================================================

const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}


// ============================================================
// DROPDOWN LOGIC for mobile (≤768px)
// ============================================================

(function() {
    'use strict';

    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth > 768) return;

            e.preventDefault();

            const parentLi = this.parentElement;
            const dropdownMenu = parentLi.querySelector('.dropdown-content');

            if (dropdownMenu) {
                // Close any other open dropdowns
                document.querySelectorAll('.dropdown-content.open').forEach(function(menu) {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('open');
                    }
                });
                dropdownMenu.classList.toggle('open');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;
        const isDropdown = e.target.closest('.dropdown');
        if (!isDropdown) {
            document.querySelectorAll('.dropdown-content.open').forEach(function(menu) {
                menu.classList.remove('open');
            });
        }
    });

    // Reset when resizing back to desktop
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                document.querySelectorAll('.dropdown-content.open').forEach(function(menu) {
                    menu.classList.remove('open');
                });
            }
        }, 200);
    });

})();


// ============================================================
// DEVELOPMENT PAGE – MODAL WITH NOTIFICATION & AUTO-CLOSE
// ============================================================

const modal = document.getElementById('devModal');
const openBtn = document.getElementById('openFormBtn');
const closeBtn = document.querySelector('.modal-close');
const form = document.getElementById('devForm');
const submitBtn = document.getElementById('submitFormBtn');

// ── Helper: show notification inside modal ──
function showNotification(message, color = '#10b981') {
    const oldNote = document.querySelector('.form-notification');
    if (oldNote) oldNote.remove();

    const note = document.createElement('div');
    note.className = 'form-notification';
    note.textContent = message;
    note.style.cssText = `
        background: ${color};
        color: #ffffff;
        padding: 14px 18px;
        border-radius: 10px;
        margin: 0 0 16px 0;
        font-weight: 600;
        font-size: 15px;
        text-align: center;
        animation: slideDown 0.3s ease;
        font-family: 'Montserrat', sans-serif;
    `;

    const modalContent = document.querySelector('.modal-content');
    const heading = modalContent.querySelector('h3');
    modalContent.insertBefore(note, heading.nextSibling);
}

// ── Helper: reset form ──
function resetForm() {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
    const existingNote = document.querySelector('.form-notification');
    if (existingNote) existingNote.remove();
}

// ── Only run if modal elements exist (prevents errors on other pages) ──
if (modal && openBtn && closeBtn && form && submitBtn) {

    // Open modal
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
    });

    // Close modal (X button)
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        resetForm();
    });

    // Close modal (click outside)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            resetForm();
        }
    });

    // ── ✅ ACTIVE: EmailJS submission ──
    // Make sure you have included the EmailJS library in your HTML:
    // <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    // And initialized it with your public key:
    // <script>emailjs.init("YOUR_PUBLIC_KEY");</script>
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const name = document.getElementById('devName').value;
        const email = document.getElementById('devEmail').value;
        const message = document.getElementById('devMessage').value;

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'kevinelton34@gmail.com' // <-- change to your email
        };

        emailjs.send('service_nn38yk5selktion', 'template_6hen6as', templateParams)
            .then(() => {
                showNotification('✅ Message sent successfully! We\'ll get back to you shortly.');
                setTimeout(() => {
                    modal.classList.remove('show');
                    resetForm();
                }, 3000);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showNotification('❌ Failed to send. Please try again.', '#ef4444');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
    });

    // ── 🟡 ALTERNATIVE: Formspree (comment out EmailJS above, uncomment this) ──
    /*
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('✅ Message sent successfully! We\'ll get back to you shortly.');
                setTimeout(() => {
                    modal.classList.remove('show');
                    resetForm();
                }, 3000);
            } else {
                const errorData = await response.json();
                showNotification('❌ ' + (errorData.error || 'Something went wrong. Please try again.'), '#ef4444');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        } catch (error) {
            showNotification('❌ Network error. Please check your connection.', '#ef4444');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
    */

} // end if elements exist
