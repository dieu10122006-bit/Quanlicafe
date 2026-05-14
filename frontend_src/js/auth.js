/* ========================================
   AUTHENTICATION - Login & Auth logic
   ======================================== */

const Auth = {
    /**
     * Handle login form submission
     */
    async login(username, password) {
        try {
            const response = await API.auth.login(username, password);
            
            // Save token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            Utils.showAlert('Đăng nhập thành công!', 'success');
            
            // Redirect based on role
            if (response.user.role === 'admin') {
                window.location.href = '/pages/dashboard.html';
            } else if (response.user.role === 'staff') {
                window.location.href = '/pages/order.html';
            } else {
                window.location.href = '/pages/menu.html';
            }
        } catch (error) {
            Utils.showAlert('Đăng nhập thất bại: ' + error.message, 'error');
        }
    },

    /**
     * Handle logout
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Utils.showAlert('Đã đăng xuất', 'success');
        window.location.href = '/pages/login.html';
    },

    /**
     * Get authentication token
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Check if authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Get current user
     */
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Setup navbar with user info
     */
    setupNavbar() {
        const user = this.getUser();
        if (user) {
            const userNameEl = document.getElementById('user-name');
            const userAvatarEl = document.getElementById('user-avatar');
            
            if (userNameEl) {
                userNameEl.textContent = user.full_name || user.username;
            }
            
            if (userAvatarEl) {
                const initials = (user.full_name || user.username)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                userAvatarEl.textContent = initials;
            }
        }
    },

    /**
     * Setup logout button
     */
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },

    /**
     * Check authorization (role-based)
     */
    isAuthorized(requiredRoles) {
        const user = this.getUser();
        if (!user) return false;
        
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(user.role);
        }
        
        // Handle comma-separated string
        if (typeof requiredRoles === 'string') {
            const roles = requiredRoles.split(',').map(r => r.trim());
            return roles.includes(user.role);
        }
        
        return user.role === requiredRoles;
    },

    /**
     * Show/hide elements based on role
     */
    showForRole(selector, roles) {
        const elements = document.querySelectorAll(selector);
        const user = this.getUser();
        
        if (!user) {
            elements.forEach(el => el.style.display = 'none');
            return;
        }
        
        if (Array.isArray(roles) && roles.includes(user.role)) {
            elements.forEach(el => el.style.display = '');
        } else if (!Array.isArray(roles) && user.role === roles) {
            elements.forEach(el => el.style.display = '');
        } else {
            elements.forEach(el => el.style.display = 'none');
        }
    },

    /**
     * Show/hide elements based on role
     */
    handleDataForRoles() {
        const user = this.getUser();
        const elements = document.querySelectorAll('[data-for-role]');
        
        elements.forEach(el => {
            const roles = el.getAttribute('data-for-role').split(',');
            if (user && roles.includes(user.role)) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });
    },

    /**
     * Initialize authentication on page load
     */
    init() {
        // Redirect to login if not authenticated
        Utils.redirectIfNotLoggedIn();
        
        // Setup navbar
        this.setupNavbar();
        
        // Setup logout button
        this.setupLogoutButton();
        
        // Handle role-based elements
        this.handleDataForRoles();
        
        // Check authorization for protected pages (check html, body, or meta tags)
        const requiredRole = document.documentElement.getAttribute('data-required-role') || 
                           document.body.getAttribute('data-required-role');
                           
        if (requiredRole && !this.isAuthorized(requiredRole)) {
            const user = this.getUser();
            console.warn(`Unauthorized access attempt to ${window.location.pathname} for role: ${user ? user.role : 'none'}`);
            
            // Determine best fallback page to avoid infinite loops
            let targetPage = '/pages/login.html';
            if (user) {
                if (user.role === 'customer') {
                    targetPage = '/pages/menu.html';
                } else if (user.role === 'staff') {
                    targetPage = '/pages/order.html';
                } else if (user.role === 'admin') {
                    targetPage = '/pages/dashboard.html';
                }
            }
            
            // Only redirect if target is different from current
            if (!window.location.pathname.includes(targetPage.split('/').pop())) {
                Utils.showAlert('Bạn không có quyền truy cập trang này', 'error');
                window.location.href = targetPage;
            }
        }
    }
};

// Call init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Don't init on auth-related pages or landing pages that don't require login
    const publicPages = ['login', 'signup', 'forgot-password'];
    const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));
    
    if (!isPublicPage) {
        Auth.init();
    }
});
