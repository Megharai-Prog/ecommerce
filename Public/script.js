const cart = [];
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.getElementById('totalPrice');
const cartPanel = document.getElementById('cartPanel');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('closeCartBtn');




// Open Cart
cartToggleBtn.addEventListener('click', () => {
    cartPanel.classList.add('active');
    overlay.classList.add('active');
});

// Close Cart
overlay.addEventListener('click', closeCart);
closeCartBtn.addEventListener('click', closeCart);

function closeCart() {
    cartPanel.classList.remove('active');
    overlay.classList.remove('active');
}

// Add to Cart Logic
document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.product');
        const id = productElement.dataset.id;
        const name = productElement.dataset.name;
        const price = parseFloat(productElement.dataset.price);

        addToCart(id, name, price);
    });
});

function showCartAlert() {
    const alert = document.getElementById('cartAlert');
    alert.classList.add('show');

    setTimeout(() => {
        alert.classList.remove('show');
    }, 2000);
}

function showCartAlerts() {
    const alert = document.getElementById('cartAlertadd');
    alert.classList.add('show');

    setTimeout(() => {
        alert.classList.remove('show');
    }, 2000);
}



function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
       showCartAlerts();
    } else {
        cart.push({ id, name, price, quantity: 1 });
        updateCart();
        showCartAlert(); 

    }
    
}

function updateCart() {
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price}</span>
            <div class="controls">
                <button class="qty-btn" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn2" data-id="${item.id}">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    document.querySelectorAll('.qty-btn2').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.textContent = total.toFixed(2);
}

function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        const index = cart.findIndex(p => p.id === id);
        cart.splice(index, 1);
    }

    updateCart();
}
