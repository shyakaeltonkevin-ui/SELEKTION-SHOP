// MOBILE MENU TOGGLE

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


// TOAST NOTIFICATIONS

function showNotification(message, type = 'success') {
    // Create container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Build the toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = '✓';
    if (type === 'error') icon = '✕';
    else if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;

    // Append to container
    container.appendChild(toast);

    // Trigger slide-in after a tiny delay (for reflow)
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto-remove after 3.5 seconds
    const timeout = setTimeout(() => {
        removeToast(toast);
    }, 3500);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        removeToast(toast);
    });

    // Click on toast itself also closes (optional)
    toast.addEventListener('click', (e) => {
        if (e.target === toast || e.target.closest('.toast-message')) {
            clearTimeout(timeout);
            removeToast(toast);
        }
    });
}

function removeToast(toast) {
    toast.classList.remove('show');
    // Wait for animation to finish then remove from DOM
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
        // If container is empty, remove it as well
        const container = document.querySelector('.toast-container');
        if (container && container.children.length === 0) {
            container.parentNode.removeChild(container);
        }
    }, 400);
}


// CART FUNCTIONALITY

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists (by name) – if so, update quantity
    const existingIndex = cart.findIndex(item => item.name === product.name);
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += product.quantity || 1;
        showNotification(`Added another ${product.name} (now ${cart[existingIndex].quantity} in cart)`, 'info');
    } else {
        cart.push(product);
        showNotification(`${product.name} added to cart! 🛒`, 'success');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}


// ---------- 1. Handle "Add to Cart" button on sproducts.html ----------
const addToCartBtn = document.querySelector('#prodetails .single-pro-details button.normal');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const productName = document.querySelector('#prodetails .single-pro-details h4')?.innerText || 'Product';
        const productPrice = parseFloat(
            document.querySelector('#prodetails .single-pro-details h2')?.innerText.replace(/[$,€]/g, '').trim() || '0'
        );
        const productImage = document.getElementById('MainImg')?.src || 'imgs/placeholder.jpg';
        const quantity = parseInt(
            document.querySelector('#prodetails .single-pro-details input[type="number"]')?.value || '1'
        );

        addToCart({
            id: Date.now() + Math.random(),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        });
    });
}


// ---------- 2. Handle cart icons on product cards (index.html, shops.html, etc.) ----------
document.addEventListener('click', function (e) {
    let target = e.target.closest('.cart');
    if (!target) return;

    const pro = target.closest('.pro');
    if (!pro) return;

    const img = pro.querySelector('img');
    const brand = pro.querySelector('.des span')?.innerText || '';
    const name = pro.querySelector('.des h5')?.innerText || 'Product';
    const priceText = pro.querySelector('.des h4')?.innerText || '0';
    const price = parseFloat(priceText.replace(/[$,€]/g, '').trim()) || 0;
    const imageSrc = img ? img.src: 'imgs/placeholder.jpg';

    e.preventDefault();

    addToCart({
        id: Date.now() + Math.random(),
        name: name,
        price: price,
        image: imageSrc,
        quantity: 1
    });
});


// ---------- Render Cart (carts.html) ----------
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.querySelector('#cart tbody');
    const subtotalCell = document.querySelector('#subtotal table tbody tr:first-child td:last-child');
    const totalCell = document.querySelector('#subtotal table tbody tr:last-child td:nth-child(2)');

    if (!tbody) return;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">Your cart is empty. Start shopping!</td></tr>`;
        if (subtotalCell) subtotalCell.innerText = '€0.00';
        if (totalCell) totalCell.innerText = '€5.00';
        return;
    }

    let html = '';
    let subtotal = 0;
    const shipping = 5.00;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <tr>
                <td><a href="#" class="remove-item" data-index="${index}"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}" style="width:70px; border-radius:10px;"></td>
                <td>${item.name}</td>
                <td>€${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="update-qty" data-index="${index}" style="width:60px; padding:8px;"></td>
                <td>€${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    const total = subtotal + shipping;
    if (subtotalCell) subtotalCell.innerText = `€${subtotal.toFixed(2)}`;
    if (totalCell) totalCell.innerText = `€${total.toFixed(2)}`;

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const index = parseInt(this.dataset.index);
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const removed = cart[index];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            showNotification(`${removed.name} removed from cart.`, 'error');
            renderCart();
        });
    });

    // Update quantity
    document.querySelectorAll('.update-qty').forEach(input => {
        input.addEventListener('change', function () {
            const index = parseInt(this.dataset.index);
            let newQty = parseInt(this.value) || 1;
            if (newQty < 1) newQty = 1;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart[index].quantity = newQty;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    });
}

// Run renderCart when the page loads (only on carts.html)
if (document.querySelector('#cart')) {
    document.addEventListener('DOMContentLoaded', renderCart);
}


// ---------- Coupon & Checkout (carts.html) ----------
const applyCouponBtn = document.querySelector('#coupon button.normal');
if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const couponInput = document.querySelector('#coupon input[type="text"]');
        if (couponInput.value.trim().toUpperCase() === 'SELKTION10') {
            showNotification('🎉 Coupon applied! You get 10% off (demo only).', 'success');
        } else {
            showNotification('❌ Invalid coupon code. Try "SELKTION10".', 'error');
        }
    });
}

const checkoutBtn = document.querySelector('#subtotal button.normal');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// ---------- Checkout Page Logic ----------
if (document.querySelector('#checkout')) {
    // Populate order summary
    function renderCheckoutSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const container = document.getElementById('order-items');
        const subtotalSpan = document.getElementById('subtotal-display');
        const shippingSpan = document.getElementById('shipping-display');
        const totalSpan = document.getElementById('total-display');

        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty. <a href="shops.html">Continue shopping</a></p>';
            subtotalSpan.innerText = '€0.00';
            totalSpan.innerText = '€5.00';
            return;
        }

        let html = '';
        let subtotal = 0;
        const shipping = 5.00;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="order-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>€${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        container.innerHTML = html;
        const total = subtotal + shipping;
        subtotalSpan.innerText = `€${subtotal.toFixed(2)}`;
        shippingSpan.innerText = `€${shipping.toFixed(2)}`;
        totalSpan.innerText = `€${total.toFixed(2)}`;
    }

    renderCheckoutSummary();

    // Handle form submission
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();

            if (!name || !email || !address) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Get current cart
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Your cart is empty.', 'error');
                return;
            }

            // Build order object
            const order = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                customer: { 
                    name, 
                    email, 
                    phone: document.getElementById('phone').value,
                    address: address 
                },
                payment: document.getElementById('payment').value,
                items: cart,
                subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                shipping: 5.00,
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.00
            };

            // Save to orders list in localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear the cart
            localStorage.removeItem('cart');

            // Show success notification
            showNotification('✅ Order placed successfully! Redirecting...', 'success');

            // Disable the submit button to prevent double-click
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerText = 'Processing...';

            // Redirect after 2.5 seconds
            setTimeout(() => {
                // Redirect to home page or a thank you page
                window.location.href = 'index.html';
                // OR if you have a thanks.html: window.location.href = 'thanks.html';
            }, 2500);
        });
    }
}
