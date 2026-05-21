 // Product Data
        const products = [
            {
                id: 1,
                name: "Valentino Oil",
                category: "Classic Collection",
                description: "Cold-pressed from premium Mediterranean olives.",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-bottle-droplet",
                badge: "Bestseller",
                image: "images/1.jpg"
            },
            {
                id: 2,
                name: "Tobacco Vanilla Oil Spray",
                category: "Tropical Blend",
                description: "Organic oil with a light, sweet aroma. Ideal for freshness and skin care.",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-bottle-water",
                badge: "New",
                image: "images/2.jpg"
            },
            {
                id: 3,
                name: "Tobacco Horney Oil Blend",
                category: "Premium Series",
                description: "High-smoke point Tobacco oil blended with a hint of lime. Perfect for sweetness   .",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-lemon",
                badge: "Popular",
                image: "images/3.jpg"
            },
            {
                id: 4,
                name: "Creed Aventus",
                category: "Gourmet Selection",
                description: "Luxurious golden truffle infused  oil. A few sprays transforms any smell into a  masterpiece.",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-star",
                badge: "Limited",
                image: "images/4.jpg"
            },
            {
                id: 5,
                name: "Chanel Blue",
                category: "Seasoned Sprays",
                description: " Your secret weapon for instant flavor.",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-mortar-pestle",
                badge: null,
                image: "images/5.jpg"
            },
            {
                id: 6,
                name: "Spice Bomb Oil Spray",
                category: "Asian Fusion",
                description: "smell meets perfection.",
                price: { GBP: 16.67, USD: 21.43, NGN: 9900, GHS: 300 },
                icon: "fa-bowl-rice",
                badge: null,
                image: "images/6.jpg"
            }
        ];

        // Currency Settings
        let currentCurrency = 'GBP';
        let currencySymbol = '£';
        let currencyCountry = 'UK';

        const currencySymbols = {
            'GBP': '£',
            'USD': '$',
            'NGN': '₦',
            'GHS': '₵'
        };

        const currencyFlags = {
            'GBP': '',
            'USD': '',
            'NGN': '',
            'GHS': ''
        };

        // Cart State
        let cart = [];

        // Theme State
        let isDark = false;

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartUI();
            loadTheme();
        });

        // Render Products
        function renderProducts() {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" class="product-thumb" onclick="openImageModal('${product.image}','${product.name}')">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <div class="product-price">
                                <span class="currency">${currencySymbol}</span>${product.price[currentCurrency].toFixed(2)}
                            </div>
                            <button class="add-to-cart" onclick="addToCart(${product.id})" id="btn-${product.id}">
                                <i class="fas fa-plus"></i>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Add to Cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price[currentCurrency],
                    icon: product.icon,
                    quantity: 1
                });
            }

            updateCartUI();
            showToast(`${product.name} added to cart!`);

            // Button animation
            const btn = document.getElementById(`btn-${productId}`);
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
            }, 1500);
        }

        // Update Cart UI
        function updateCartUI() {
            const cartItems = document.getElementById('cart-items');
            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cart-total');
            const checkoutBtn = document.getElementById('checkout-btn');

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your cart is empty</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some products to get started!</p>
                    </div>
                `;
                cartTotal.textContent = `${currencySymbol}0.00`;
                checkoutBtn.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <i class="fas ${item.icon}"></i>
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${currencySymbol}${(item.price * item.quantity).toFixed(2)}</div>
                            <div class="quantity-control">
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                                <button class="remove-item" onclick="removeFromCart(${item.id})" style="margin-left: auto;">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');

                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = `${currencySymbol}${total.toFixed(2)}`;
                checkoutBtn.style.display = 'flex';

                // Update WhatsApp link
                updateWhatsAppLink();
            }
        }

        // Update Quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCartUI();
                }
            }
        }

        // Remove from Cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartUI();
            showToast('Item removed from cart');
        }

        // Update WhatsApp Link
        function updateWhatsAppLink() {
            const phoneNumber = '233241287968';

            let message = `Hello! I'd like to place an order for the following items:

`;
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                message += `• ${item.name} x${item.quantity} - ${currencySymbol}${itemTotal.toFixed(2)}
`;
            });

            message += `
*Total: ${currencySymbol}${total.toFixed(2)}*
`;
            message += `
Currency: ${currentCurrency} (${currencyCountry})
`;
            message += `
Please confirm my order. Thank you!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${233241287968}?text=${encodedMessage}`;

            document.getElementById('checkout-btn').href = whatsappUrl;
        }

        // Toggle Cart
        function toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('active');
            document.getElementById('cart-overlay').classList.toggle('active');
            document.body.style.overflow = document.getElementById('cart-sidebar').classList.contains('active') ? 'hidden' : '';
        }

        // Currency Functions
        function toggleCurrency() {
            const dropdown = document.getElementById('currency-dropdown');
            dropdown.classList.toggle('active');
            updateCartBlurState();
        }

        function setCurrency(code, symbol, country) {
            currentCurrency = code;
            currencySymbol = symbol;
            currencyCountry = country;
            removeCartBlurState();

            document.getElementById('current-currency').textContent = `${currencyFlags[code]} ${code}`;
            document.getElementById('currency-dropdown').classList.remove('active');

            // Update prices in cart
            cart = cart.map(item => {
                const product = products.find(p => p.id === item.id);
                return { ...item, price: product.price[code] };
            });

            renderProducts();
            updateCartUI();
            showToast(`Currency changed to ${code}`);
        }

        // Theme Functions
        function toggleTheme() {
            isDark = !isDark;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.getElementById('theme-icon').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('scentnest-theme', isDark ? 'dark' : 'light');
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('scentnest-theme');
            if (savedTheme === 'dark') {
                isDark = true;
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('theme-icon').className = 'fas fa-sun';
            }
        }

        function updateCartBlurState() {
            const cartBtn = document.querySelector('.cart-btn');
            const dropdown = document.getElementById('currency-dropdown');
            if (!cartBtn) return;
            if (window.innerWidth <= 768 && dropdown.classList.contains('active')) {
                cartBtn.classList.add('blurred');
            } else {
                cartBtn.classList.remove('blurred');
            }
        }

        function removeCartBlurState() {
            const cartBtn = document.querySelector('.cart-btn');
            if (cartBtn) {
                cartBtn.classList.remove('blurred');
            }
        }

        // Toast
        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-message').textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // Close currency dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.currency-selector')) {
                const dropdown = document.getElementById('currency-dropdown');
                dropdown.classList.remove('active');
                removeCartBlurState();
            }
        });

        window.addEventListener('resize', updateCartBlurState);

        // Image modal functions
        function openImageModal(src, alt) {
            const modal = document.getElementById('image-modal');
            const img = document.getElementById('modal-img');
            img.src = src;
            img.alt = alt || '';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeImageModal() {
            const modal = document.getElementById('image-modal');
            const img = document.getElementById('modal-img');
            modal.classList.remove('active');
            // clear src after a short delay to prevent flashing on reopen
            setTimeout(() => img.src = '', 200);
            document.body.style.overflow = '';
        }

        function scrollToContact() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function submitContactForm(event) {
            event.preventDefault();
            const form = event.target;
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                showToast('Please complete all contact fields.');
                return;
            }

            const subject = `ScentNest inquiry from ${name}`;
            const body = `Name: ${name}\r\nEmail: ${email}\r\n\r\n${message}`;
            window.location.href = `mailto:hello@scentnest.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            showToast('Opening your email app...');
            form.reset();
        }

        // IMPORTANT: Replace 'YOUR_PHONE_NUMBER' with your actual WhatsApp number
        // Format: Country code + number without + or spaces (e.g., '2348012345678' for Nigeria)