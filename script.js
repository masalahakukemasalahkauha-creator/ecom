document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {  // Safety check (always present, but good practice)
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // Smooth scroll for internal # links (only relevant on single-page versions; harmless on multi-page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Cart system (unchanged – works perfectly across all pages)
    let cart = JSON.parse(localStorage.getItem('toyyibanCart')) || [];

    const cartLink = document.getElementById('cart-link');
    const modal = document.getElementById('cart-modal');
    const closeModal = document.getElementById('close-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');

    function saveCart() {
        localStorage.setItem('toyyibanCart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Cart (${totalItems})`;

        cartItems.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                totalPrice += item.price * item.quantity;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-details">
                        <strong>${item.name}</strong><br>
                        MYR ${item.price} each
                    </div>
                    <div class="quantity-controls">
                        <button data-index="${index}" class="qty-decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-index="${index}" class="qty-increase">+</button>
                    </div>
                    <div class="cart-item-price">
                        MYR ${item.price * item.quantity}
                        <br><button data-index="${index}" class="remove-item secondary">Remove</button>
                    </div>
                `;
                cartItems.appendChild(div);
            });
        }

        cartTotal.textContent = `Total: MYR ${totalPrice}`;
    }

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.closest('.product');
            const id = product.dataset.id;
            const name = product.dataset.name;
            const price = parseFloat(product.dataset.price);

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            saveCart();
            updateCartDisplay();
            alert(`${name} added to cart!`);
        });
    });

    // Cart modal interactions
    if (cartLink && modal) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            updateCartDisplay();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => { 
        if (e.target === modal) modal.style.display = 'none'; 
    });

    // Delegate events for dynamic buttons
    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (isNaN(index)) return; // Safety

            if (e.target.classList.contains('qty-increase')) {
                cart[index].quantity++;
            } else if (e.target.classList.contains('qty-decrease')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
            } else if (e.target.classList.contains('remove-item')) {
                cart.splice(index, 1);
            }
            saveCart();
            updateCartDisplay();
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            cart = [];
            saveCart();
            updateCartDisplay();
        });
    }

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            let summary = 'Checkout Summary:\n\n';
            let total = 0;
            cart.forEach(item => {
                summary += `${item.name} x ${item.quantity} = MYR ${item.price * item.quantity}\n`;
                total += item.price * item.quantity;
            });
            summary += `\nTotal: MYR ${total}`;
            alert(summary + '\n\nThank you for shopping with Toyyiban! (Demo checkout)');
        }
    });

    // === NEW: Contact form handler (only runs on contact.html) ===
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been sent. (Demo only)');
        e.target.reset(); // Clears the form
    });

    // Initial cart display
    updateCartDisplay();
});