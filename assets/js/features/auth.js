/**
 * @file features/auth.js
 * Authentication functionality
 */

import { showLoginModal, showRegisterModal, switchToLogin, switchToRegister } from '../components/modal.js';

// Handle login
export function loginUser(email, password) {
    // Mock implementation - replace with actual API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify({
                    email: email,
                    displayName: email.split('@')[0]
                }));
                resolve({ success: true });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
}

// Handle logout
export function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    // Redirect to home page
    window.location.href = "?page=home";
}

// Check if user is logged in
export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user data
export function getCurrentUser() {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch (e) {
        return null;
    }
}

// Initialize auth event listeners
export function initAuth() {
    // Set up login form submission
    document.addEventListener('submit', function (e) {
        if (e.target.id === 'loginForm') {
            e.preventDefault();

            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;

            loginUser(email, password)
                .then(() => {
                    window.location.reload();
                })
                .catch(error => {
                    const errorElement = document.getElementById('loginError');
                    if (errorElement) {
                        errorElement.textContent = error.message;
                        errorElement.style.display = 'block';
                    }
                });
        }
    });

    // Set up register form submission
    document.addEventListener('submit', function (e) {
        if (e.target.id === 'registerForm') {
            e.preventDefault();

            const email = document.getElementById('registerEmail')?.value;
            const password = document.getElementById('registerPassword')?.value;

            // Mock registration - would call API in real implementation
            setTimeout(() => {
                switchToLogin();
            }, 1000);
        }
    });

    // Set up logout button
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser();
        });
    });
}