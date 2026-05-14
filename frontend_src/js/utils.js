/* ========================================
   UTILS - Helper functions
   ======================================== */

const Utils = {
    /**
     * Show a custom alert message
     */
    showAlert(message, type = 'info', duration = 4000) {
        console.log(`Alert: [${type}] ${message}`);
        
        const container = document.getElementById('alert-container');
        if (!container) {
            console.warn('Alert container not found. Using fallback alert.');
            alert(message);
            return;
        }

        const alertEl = document.createElement('div');
        alertEl.className = `alert ${type}`;
        
        // Add icon based on type
        let icon = 'ℹ';
        if (type === 'success') icon = '✓';
        if (type === 'error') icon = '✕';
        if (type === 'warning') icon = '⚠';
        
        alertEl.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        
        // Add to container
        container.appendChild(alertEl);

        // Remove after duration
        setTimeout(() => {
            alertEl.classList.add('fade-out');
            setTimeout(() => alertEl.remove(), 500);
        }, duration);
    },

    /**
     * Redirect to login if user is not authenticated
     */
    redirectIfNotLoggedIn() {
        const token = localStorage.getItem('token');
        const isPublicPage = ['login.html', 'signup.html', 'forgot-password.html'].some(page => 
            window.location.pathname.includes(page)
        );

        if (!token && !isPublicPage) {
            window.location.href = '/pages/login.html';
        }
    },

    /**
     * Format currency (VND)
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
};

// Global export
window.Utils = Utils;

// Water Ripple Effect
document.addEventListener('mousedown', function(e) {
    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
});
