/* ========================================
   API WRAPPER - Handle all API calls
   ======================================== */

const API = {
    baseURL: '/api',

    /**
     * Generic fetch wrapper
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add JWT token if available
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
                    // Token expired, redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/pages/login.html';
                    return; // Prevent further execution
                }
                
                let errorData;
                try {
                    errorData = await response.json();
                } catch(e) {
                    throw new Error('Lỗi máy chủ: Không thể xử lý phản hồi (' + response.status + ')');
                }
                
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    throw new Error(errorData.errors.map(err => err.msg || err.message || JSON.stringify(err)).join(', '));
                }
                
                throw new Error(errorData.message || 'Có lỗi xảy ra từ máy chủ');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    // ============ AUTH ENDPOINTS ============

    auth: {
        /**
         * Login user
         */
        login(username, password) {
            return API.post('/auth/login', { username, password });
        },

        /**
         * Signup/Register new user
         */
        signup(data) {
            return API.post('/auth/signup', data);
        },

        /**
         * Check if username is available
         */
        checkUsername(username) {
            return API.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
        },

        /**
         * Check if email is available
         */
        checkEmail(email) {
            return API.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
        },

        /**
         * Get current user info
         */
        getCurrentUser() {
            return API.get('/auth/me');
        },

        /**
         * Logout user
         */
        logout() {
            return API.post('/auth/logout', {});
        },

        /**
         * Register user (legacy)
         */
        register(data) {
            return API.post('/auth/register', data);
        }
    },

    // ============ PRODUCTS ENDPOINTS ============

    products: {
        getAll() {
            return API.get('/products');
        },
        getById(id) {
            return API.get(`/products/${id}`);
        },
        create(data) {
            return API.post('/products', data);
        },
        update(id, data) {
            return API.put(`/products/${id}`, data);
        },
        delete(id) {
            return API.delete(`/products/${id}`);
        },
        getCategories() {
            return API.get('/categories');
        }
    },

    // ============ ORDERS ENDPOINTS ============

    orders: {
        getAll() {
            return API.get('/orders');
        },
        getById(id) {
            return API.get(`/orders/${id}`);
        },
        create(data) {
            return API.post('/orders', data);
        },
        update(id, data) {
            return API.put(`/orders/${id}`, data);
        },
        delete(id) {
            return API.delete(`/orders/${id}`);
        },
        getInvoice(id) {
            return API.get(`/orders/${id}/invoice`);
        }
    },

    // ============ PAYMENTS ENDPOINTS ============

    payments: {
        process(orderId, data) {
            return API.post(`/payments/process/${orderId}`, data);
        },
        getById(id) {
            return API.get(`/payments/${id}`);
        },
        refund(id) {
            return API.post(`/payments/${id}/refund`, {});
        }
    },

    // ============ EMPLOYEES ENDPOINTS ============

    employees: {
        getAll() {
            return API.get('/employees');
        },
        getById(id) {
            return API.get(`/employees/${id}`);
        },
        create(data) {
            return API.post('/employees', data);
        },
        update(id, data) {
            return API.put(`/employees/${id}`, data);
        },
        delete(id) {
            return API.delete(`/employees/${id}`);
        }
    },

    // ============ REPORTS ENDPOINTS ============

    reports: {
        getRevenue(startDate, endDate) {
            return API.get(`/reports/revenue?start=${startDate}&end=${endDate}`);
        },
        getProducts(startDate, endDate) {
            return API.get(`/reports/products?start=${startDate}&end=${endDate}`);
        },
        getEmployees() {
            return API.get('/reports/employees');
        },
        getCustomers(startDate, endDate) {
            return API.get(`/reports/customers?start=${startDate}&end=${endDate}`);
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
if (typeof window !== 'undefined') {
    window.API = API;
}
