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

cartCount.addEventListener('click', ()=> {
    cartOverlay.style.display = cartOverlay.style.display === 'none' ? 'block' : 'none';
});

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.dataset.product;
        const productPrice = parseFloat(button.dataset.price);

        addToCart(productName, productPrice);
    });
});

function addToCart(name, price) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({name: name, price: price, quantity: 1});
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
        li.textContent = `${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`;

        // Löschen-Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.background = 'transparent';
        removeBtn.style.border = 'none';
        removeBtn.style.color = '#ff4d4d';
        removeBtn.style.cursor = 'pointer';
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1); // Produkt entfernen
            updateCartUI(); // UI neu rendern
        });

        li.appendChild(removeBtn);
        cartItems.appendChild(li);

        totalPrice += item.price * item.quantity;
    });

    // Gesamtpreis aktualisieren
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
