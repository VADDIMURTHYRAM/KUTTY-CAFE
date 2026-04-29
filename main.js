document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize cart from Local Storage (or empty array if nothing is saved)
    let cart = JSON.parse(localStorage.getItem('kuttyCart')) || [];
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    const modal = document.getElementById("menuModal");
    const menuBtn = document.getElementById("menu-btn");
    const heroMenuBtn = document.getElementById("hero-menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");
    const cartItems = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");
    const placeOrderBtn = document.getElementById("place-order");
    const downloadReceiptBtn = document.getElementById("download-receipt"); 
    const chatBtn = document.getElementById("chat-btn");
    const chatPanel = document.getElementById("chat-panel");
    const chatClose = document.getElementById("chat-close");
    const statusIndicator = document.getElementById("status-indicator");

    // 2. Setup Toast Container
    const toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);

    // Toast Notification Function
    const showToast = (message, type = "success") => {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;
        
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("fade-out");
            toast.addEventListener("animationend", () => toast.remove());
        }, 3500);
    };

    const openMenu = (e) => {
        e.preventDefault();
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
    };

    const closeMenu = () => {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    };

    const updateCart = () => {
        cartCount.innerText = cart.length;
        cartCount.style.display = cart.length > 0 ? "inline-flex" : "none";
        totalPrice.innerText = total;
        cartSummary.style.display = cart.length > 0 ? "block" : "none";
        
        if (cart.length > 0) {
            cartItems.innerHTML = "";
            cart.forEach((item, index) => {
                const tag = document.createElement("span");
                tag.className = "cart-item-tag";
                tag.innerHTML = `${item.name} <button class="remove-btn" aria-label="Remove item" data-index="${index}">&times;</button>`;
                cartItems.appendChild(tag);
            });

            document.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const indexToRemove = parseInt(e.target.getAttribute("data-index"), 10);
                    total -= cart[indexToRemove].price;
                    cart.splice(indexToRemove, 1);
                    updateCart();
                });
            });
            
            // Show the download button when items exist
            downloadReceiptBtn.style.display = "block";
        } else {
            cartItems.innerText = "None";
            // Hide the download button when cart is empty
            downloadReceiptBtn.style.display = "none";
        }

        // Save current cart to Local Storage every time it updates
        localStorage.setItem('kuttyCart', JSON.stringify(cart));
    };

    const checkStatus = () => {
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 22) {
            statusIndicator.innerHTML = "🟢 Open | India's No.1 Cafe";
            statusIndicator.style.color = "#1f7a35";
        } else {
            statusIndicator.innerHTML = "🔴 Closed | Opens at 8 AM";
            statusIndicator.style.color = "#c0392b";
        }
    };

    menuBtn.addEventListener("click", openMenu);
    heroMenuBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
            chatPanel.classList.remove("show");
            chatPanel.setAttribute("aria-hidden", "true");
        }
    });

    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {
            const name = item.getAttribute("data-name");
            const price = parseInt(item.getAttribute("data-price"), 10);

            cart.push({ name, price });
            total += price;
            updateCart();
            
            showToast(`${name} added to cart!`);

            item.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.03)" },
                    { transform: "scale(1)" }
                ],
                { duration: 250 }
            );
        });
    });

    // Place Order logic
    placeOrderBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            showToast("Your cart is empty. Please select an item!", "error");
            return;
        }

        showToast(`Order placed successfully! Total: $${total}`);
        cart = [];
        total = 0;
        updateCart(); 
        closeMenu();
    });

    // Download Receipt Logic
    downloadReceiptBtn.addEventListener("click", () => {
        const receiptData = {
            cafe: "Kutty Cafe",
            date: new Date().toLocaleString(),
            items: cart,
            total: `$${total}`
        };

        // Create a Blob from the JSON string
        const blob = new Blob([JSON.stringify(receiptData, null, 4)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor tag to trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "kutty_cafe_receipt.json";
        
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast("Receipt downloaded!", "success");
    });

    chatBtn.addEventListener("click", () => {
        chatPanel.classList.toggle("show");
        chatPanel.setAttribute("aria-hidden", chatPanel.classList.contains("show") ? "false" : "true");
    });

    chatClose.addEventListener("click", () => {
        chatPanel.classList.remove("show");
        chatPanel.setAttribute("aria-hidden", "true");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

    // Slideshow Logic
    document.querySelectorAll('.image-gallery').forEach(gallery => {
        const slides = gallery.querySelectorAll('.slide');
        const prevBtn = gallery.querySelector('.prev');
        const nextBtn = gallery.querySelector('.next');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            if (index >= slides.length) currentIndex = 0;
            if (index < 0) currentIndex = slides.length - 1;
            
            slides[currentIndex].classList.add('active');
        };

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            showSlide(currentIndex);
        });
    });

    // Run on startup
    checkStatus();
    updateCart();
});