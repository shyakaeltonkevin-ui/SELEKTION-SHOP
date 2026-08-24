const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}



// ── NEW DROPDOWN LOGIC for "WEB DESIGN" (BUILD / REBUILD / RELAUNCH) ──
(function() {
    'use strict';

    // Target the "WEB DESIGN" link inside the dropdown
    const dropdownToggles = document.querySelectorAll('.dropdown > a');

    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            // Only run this on mobile (≤768px) – desktop uses CSS hover
            if (window.innerWidth > 768) return;

            e.preventDefault(); // stop navigation

            const parentLi = this.parentElement;
            const dropdownMenu = parentLi.querySelector('.dropdown-content');

            if (dropdownMenu) {
                // Close any other open dropdowns (optional, keeps it tidy)
                document.querySelectorAll('.dropdown-content.open').forEach(function(menu) {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('open');
                    }
                });
                // Toggle this one
                dropdownMenu.classList.toggle('open');
            }
        });
    });

    // Close dropdowns if user clicks outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;

        const isDropdown = e.target.closest('.dropdown');
        if (!isDropdown) {
            document.querySelectorAll('.dropdown-content.open').forEach(function(menu) {
                menu.classList.remove('open');
            });
        }
    });

    // Reset mobile dropdowns when resizing back to desktop
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