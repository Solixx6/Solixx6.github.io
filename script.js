/***********************************************
  WARNING: This is a demo implementation only.
  Never store passwords in plain text in real apps.
  Use proper backend authentication.
***********************************************/

// =================== Cart Functionality ===================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAuthUI();
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

// =================== Authentication ===================
const users = JSON.parse(localStorage.getItem('users')) || [];
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');

// Auth UI Management
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userGreeting = document.querySelector('.user-greeting');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userGreeting.innerHTML = `
            Welcome, ${currentUser.username}!
            <button onclick="logout()">Logout</button>
        `;
    } else {
        authButtons.style.display = 'flex';
        userGreeting.innerHTML = '';
    }
}

// Login
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => 
        u.username === username && u.password === password
    );

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginModal.style.display = 'none';
        updateAuthUI();
        alert(`Welcome back, ${username}!`);
    } else {
        alert('Invalid credentials!');
    }
});

// Signup
document.getElementById('signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    if (users.some(u => u.username === username)) {
        alert('Username taken!');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    signupModal.style.display = 'none';
    alert('Account created! Please login.');
});

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
}

// =================== Modal Management ===================
document.querySelectorAll('.auth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(`${btn.dataset.modal}Modal`).style.display = 'block';
    });
});

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        document.querySelectorAll('form').forEach(form => form.reset());
    });
});

window.addEventListener('click', e => {
    if (e.target === loginModal || e.target === signupModal) {
        e.target.style.display = 'none';
        document.querySelectorAll('form').forEach(form => form.reset());
    }
});

document.getElementById('showSignup').addEventListener('click', e => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
});