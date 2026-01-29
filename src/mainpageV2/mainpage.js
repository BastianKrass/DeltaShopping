// Product Showcase
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".product").forEach(product => {
        const mainImage = product.querySelector(".product-image");
        const thumbnails = product.querySelectorAll(".product-thumbnails img")

        if (!mainImage || thumbnails.length === 0) return;

        const defaultImage = mainImage.dataset.default;

        function switchImage(newSrc) {
            mainImage.style.opacity = 0;

            setTimeout(() => {
                mainImage.src = newSrc;
                mainImage.style.opacity = 1
            }, 150);
        }

        thumbnails.forEach(thumb => {
            thumb.addEventListener("mouseenter", () => {
                switchImage(thumb.src);
            });
            thumb.addEventListener("mouseleave", () => {
                switchImage(thumb.src);
            });
        });
    });
});

// Shopping Cart

let cart = [];

const buttons = document.querySelectorAll('.product button');
const cartCount = document.getElementById('cart-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const cartIcon = document.getElementById('cart');
const cartClose = document.getElementById('cart-close');

cartIcon.addEventListener('click', ()=> {
    cartOverlay.style.display = cartOverlay.style.display === 'none' ? 'block' : 'none';
});

cartClose.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const product =  button.closest('.product');

        const productName = button.dataset.product;
        const productPrice = parseFloat(button.dataset.price);

        const selectedColor = product.querySelector(
            'input[type="radio"]:checked'
        )?.value || "Default";

        addToCart(productName, productPrice, selectedColor);
    });
});

function addToCart(name, price, color) {
    const existingProduct = cart.find(item => item.name === name && item.color === color);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({name: name, price: price, color: color, quantity: 1});
    }
    updateCartUI();
}

function updateCartUI() {
    // 1. Anzahl im Icon
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // 2. Dropdown füllen
    cartItems.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '8px';

        // Info-Container
        const info = document.createElement('div');
        info.className = 'cart-item-info';
        info.innerHTML = `
            <span>${item.name} (${item.color})</span>
            <span>€${item.price.toFixed(2)} x ${item.quantity} = €${(item.price * item.quantity).toFixed(2)}</span>
        `;

        // Menge Buttons
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '5px';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        minusBtn.className = 'cart-quantity';
        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCartUI();
        });

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.className = 'cart-quantity';
        plusBtn.addEventListener('click', () => {
            item.quantity++;
            updateCartUI();
        });

        controls.appendChild(minusBtn);
        controls.appendChild(plusBtn);

        // Löschen Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.className = 'cart-remove';
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1);
            updateCartUI();
        });

        li.appendChild(info);
        li.appendChild(controls);
        li.appendChild(removeBtn);

        cartItems.appendChild(li);

        totalPrice += item.price * item.quantity;
    });

    cartTotal.textContent = totalPrice.toFixed(2);
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Dein Warenkrob ist leer!");
        return;
    }

    let message = "Deine Bestellung:\n\n";
    cart.forEach(item => {
        message += `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nGesamt: €${totalPrice.toFixed(2)}`;

    alert(message);

    cart = [];
    updateCartUI();
    cartOverlay.style.display = 'none';
})

// Color Picker + Showcase Image Switch
document.querySelectorAll('.product').forEach(product => {
    const mainImage = product.querySelector('.product-image');
    const thumbnails = product.querySelectorAll('.product-thumbnails img');
    const colorRadios = product.querySelectorAll('.color-picker input');

    if (!mainImage) return;

    const productKey = mainImage.dataset.product;
    let currentColor =
        product.querySelector('.color-picker input:checked')?.dataset.color || 'black';

    function imagePath(view, color) {
        return `/images/products/${productKey}/${color}/${productKey}${view}-${color}.png`;
    }

    function updateImages(view = 'front') {
        mainImage.style.opacity = 0;

        setTimeout(() => {
            mainImage.src = imagePath(view, currentColor);

            thumbnails.forEach(thumb => {
                const thumbView = thumb.dataset.view;
                thumb.src = imagePath(thumbView, currentColor);
            });

            mainImage.style.opacity = 1;
        }, 150);
    }

    // Initial laden
    updateImages();

    // Farbwechsel
    colorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            currentColor = radio.dataset.color;
            updateImages();
        });
    });

    // Hover Showcase
    thumbnails.forEach(thumb => {
        thumb.addEventListener('mouseenter', () => {
            updateImages(thumb.dataset.view);
        });
    });
});