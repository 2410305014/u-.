// Navigation Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Simple Cart Interaction (Demo)
const addCartBtns = document.querySelectorAll('.action-btn[title="Add to Cart"]');
const cartCount = document.querySelector('.cart-count');

let count = 0;
addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        count++;
        cartCount.innerText = count;
        
        // Add a subtle animation to the cart icon
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
        
        // Add item to local storage for cart page (simplified demo)
        const productCard = btn.closest('.product-card') || btn.closest('.product-details');
        if (productCard) {
            let productName, productPrice, productImage;
            
            let qtyToAdd = 1;
            
            if (productCard.classList.contains('product-card')) {
                productName = productCard.querySelector('h3').innerText;
                productPrice = productCard.querySelector('.price').innerText;
                productImage = productCard.querySelector('img').src;
            } else {
                productName = productCard.querySelector('h1').innerText;
                productPrice = productCard.querySelector('.product-price').innerText;
                productImage = document.querySelector('.main-image img').src;
                
                const qtyInput = productCard.querySelector('.quantity-input');
                if(qtyInput) {
                    qtyToAdd = parseInt(qtyInput.value) || 1;
                }
            }

            const item = { name: productName, price: productPrice, image: productImage, qty: qtyToAdd };
            let cart = JSON.parse(localStorage.getItem('elegance_cart')) || [];
            cart.push(item);
            localStorage.setItem('elegance_cart', JSON.stringify(cart));
            
            alert(`${productName} added to cart!`);
        }
    });
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('elegance_cart')) || [];
    if(cartCount) {
        cartCount.innerText = cart.length;
    }
    
    // Inject Chatbot HTML
    const chatbotHTML = `
        <button class="chatbot-toggler">
            <span class="fas fa-comment-dots"></span>
            <span class="fas fa-times"></span>
        </button>
        <div class="chatbot-container">
            <header class="chatbot-header">
                <h3>ÉLÉGANCE Concierge AI</h3>
                <span class="close-btn fas fa-times"></span>
            </header>
            <ul class="chatbox">
                <li class="chat incoming">
                    <span class="icon fas fa-robot"></span>
                    <p>Welcome to ÉLÉGANCE. <br>How may I assist you in finding your perfect scent today?</p>
                </li>
            </ul>
            <div class="chat-input">
                <input type="text" placeholder="Type a message..." spellcheck="false" required>
                <span id="send-btn" class="fas fa-paper-plane"></span>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Chatbot Functionality
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input input");
    const sendChatBtn = document.querySelector("#send-btn");

    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="icon fas fa-robot"></span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    let isChatbotTyping = false;

    const generateResponse = (incomingChatLi, userMessage) => {
        const messageElement = incomingChatLi.querySelector("p");
        const lowerCaseMessage = userMessage.toLowerCase();
        
        // Formulate a formal response based on keywords
        setTimeout(() => {
            let response = "Pardon me, but I am unable to assist with that particular inquiry at this moment. May I direct you to our human concierge at concierge@elegance-parfums.com for personalized guidance?";
            
            if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
                response = "Greetings. It is a pleasure to assist you today. How may I guide you through our exclusive collections?";
            } else if (lowerCaseMessage.includes("shipping") || lowerCaseMessage.includes("delivery")) {
                response = "We are delighted to offer complimentary express shipping globally for all orders exceeding $100. Rest assured, your selection will be handled with the utmost care.";
            } else if (lowerCaseMessage.includes("price") || lowerCaseMessage.includes("cost")) {
                response = "Our luxurious fragrances reflect the rare and precious ingredients we source. Prices range between $145 and $250. May I assist you in finding a signature scent within a specific preference?";
            } else if (lowerCaseMessage.includes("woody") || lowerCaseMessage.includes("oud")) {
                response = "For an aficionado of woody notes, I highly recommend our 'Midnight Aura' or the prestigious 'Oud Supreme'. Both offer an exquisite depth and longevity.";
            } else if (lowerCaseMessage.includes("floral") || lowerCaseMessage.includes("rose")) {
                response = "If you appreciate floral elegance, the 'Velvet Rose' and 'Lumina Gold' are exceptional choices, crafted with the finest hand-picked petals.";
            } else if (lowerCaseMessage.includes("recommend") || lowerCaseMessage.includes("best")) {
                response = "Our esteemed clientele frequently select the 'Lumina Gold' for its radiant warmth, or the 'Midnight Aura' for evening sophistication. Which ambiance do you prefer?";
            } else if (lowerCaseMessage.includes("return") || lowerCaseMessage.includes("refund")) {
                response = "We accommodate returns within 14 days of delivery, provided the fragrance remains unopened in its original, pristine packaging. Your satisfaction is our priority.";
            }

            messageElement.textContent = response;
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
            isChatbotTyping = false;
        }, 1500);
    }

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if(!userMessage || isChatbotTyping) return;

        chatInput.value = "";
        isChatbotTyping = true;
        
        // Append user message to chatbox
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });

        // Display "Thinking..." message
        setTimeout(() => {
            const incomingChatLi = createChatLi("Consulting our fragrance archives...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
            generateResponse(incomingChatLi, userMessage);
        }, 600);
    }

    sendChatBtn.addEventListener("click", handleChat);
    chatInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });
});
