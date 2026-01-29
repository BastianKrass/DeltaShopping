// ==================== Toast Notifications ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    setupImageGalleries();
    setupCart();
    setupContactForm();
    setupMobileMenu();
    setupIntersectionObserver();
});

// ==================== Image Gallery Setup ====================
function setupImageGalleries() {
    document.querySelectorAll('.product-card').forEach(productCard => {
        const mainImage = productCard.querySelector('.product-image');
        const thumbnails = productCard.querySelectorAll('.thumb');
        const colorInputs = productCard.querySelectorAll('.color-option input');

        if (!mainImage) return;

        const productKey = mainImage.dataset.product;
        let currentColor = productCard.querySelector('.color-option input:checked')?.dataset.color || 'black';
        let currentView = mainImage.dataset['default-view'] || 'front';

        function buildImagePath(view, color) {
            return `/images/products/${productKey}/${color}/${productKey}${view}-${color}.png`;
        }

        function updateMainImage(view = currentView) {
            mainImage.style.opacity = '0';

            setTimeout(() => {
                mainImage.src = buildImagePath(view, currentColor);
                mainImage.style.opacity = '1';
                currentView = view;
            }, 150);
        }

        function updateAllImages() {
            updateMainImage('front');

            // Update thumbnail background images
            thumbnails.forEach(thumb => {
                const view = thumb.dataset.view;
                const thumbPath = buildImagePath(view, currentColor);
                thumb.style.backgroundImage = `url('${thumbPath}')`;
            });
        }

        // Initial load
        updateAllImages();

        // Color change listener
        colorInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                currentColor = e.target.dataset.color;
                updateAllImages();
            });
        });

        // Thumbnail hover listeners
        thumbnails.forEach(thumb => {
            thumb.addEventListener('mouseenter', () => {
                const view = thumb.dataset.view;
                updateMainImage(view);
            });

            thumb.addEventListener('mouseleave', () => {
                updateMainImage('front');
            });

            // Thumbnail click (for mobile)
            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                const view = thumb.dataset.view;
                updateMainImage(view);
            });
        });
    });
}

// ==================== Mobile Menu ====================
function setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');

    if (toggle) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }
}

// ==================== Shopping Cart ====================
let cart = [];

function setupCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const addToCartButtons = document.querySelectorAll('[data-product]');
    const checkoutBtn = document.getElementById('checkout-btn');

    cartToggle.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const productCard = button.closest('.product-card');
            const productName = button.dataset.product;
            const productPrice = parseFloat(button.dataset.price);
            const selectedColor = productCard.querySelector('.color-option input:checked')?.value || 'Default';

            addToCart(productName, productPrice, selectedColor);
            showToast(`${productName} added to cart.`, 'success');
        });
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty. Ready to elevate?', 'warning');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        showToast('Processing your order...', 'info');

        setTimeout(() => {
            cart = [];
            updateCartUI();
            closeCart();
            showToast('Order confirmed. Excellence delivered.', 'success');
        }, 1500);
    });
}

function addToCart(name, price, color) {
    const existingItem = cart.find(item => item.name === name && item.color === color);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name,
            price,
            color,
            quantity: 1
        });
    }

    updateCartUI();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

function updateQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartTotal.textContent = '0.00';
    } else {
        cartEmpty.style.display = 'none';

        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';

            const subtotal = item.price * item.quantity;
            total += subtotal;

            li.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-color">${item.color}</div>
                    <div class="cart-item-price">€${item.price.toFixed(2)} x ${item.quantity} = €${subtotal.toFixed(2)}</div>
                </div>
                <div class="cart-controls">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-remove" data-id="${item.id}">✕</button>
            `;

            li.querySelector('[data-action="decrease"]').addEventListener('click', () => {
                updateQuantity(item.id, item.quantity - 1);
            });

            li.querySelector('[data-action="increase"]').addEventListener('click', () => {
                updateQuantity(item.id, item.quantity + 1);
            });

            li.querySelector('.cart-remove').addEventListener('click', () => {
                removeFromCart(item.id);
                showToast(`${item.name} removed from cart.`, 'info');
            });

            cartItems.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
    }
}

// ==================== Contact Form ====================
function setupContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const message = form.querySelector('#message').value;

            console.log('Contact:', { name, email, message });

            showToast('Message sent. We\'ll be in touch.', 'success');
            form.reset();
        });
    }
}

// ==================== Intersection Observer for Animations ====================
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .vision-card, .testimonial-card, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==================== Smooth Scroll Navigation ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Hero CTA Buttons ====================
document.querySelectorAll('.hero-cta-group .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.textContent.includes('Kollektion')) {
            document.querySelector('#collection').scrollIntoView({ behavior: 'smooth' });
        } else if (btn.textContent.includes('Mission')) {
            document.querySelector('#vision').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== CTA Section Button ====================
document.querySelector('.cta-section .btn')?.addEventListener('click', () => {
    document.querySelector('#collection').scrollIntoView({ behavior: 'smooth' });
});