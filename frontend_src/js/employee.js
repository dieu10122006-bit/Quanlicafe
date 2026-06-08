// employee.js
document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        tables: Array.from({length: 12}, (_, i) => ({
            id: i + 1,
            name: `Bàn ${i + 1}`,
            status: ['empty', 'occupied', 'paying', 'reserved'][Math.floor(Math.random() * 4)],
            total: 0,
            cart: []
        })),
        menu: [
            { id: 101, name: 'Cà Phê Đen', price: 20000, category: 'Cà Phê', img: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=200&q=80' },
            { id: 102, name: 'Cà Phê Sữa', price: 25000, category: 'Cà Phê', img: 'https://images.unsplash.com/photo-1578314675249-a694eb2f2e4b?w=200&q=80' },
            { id: 103, name: 'Bạc Xỉu', price: 28000, category: 'Cà Phê', img: 'https://images.unsplash.com/photo-1572424855652-3fb65e31da29?w=200&q=80' },
            { id: 201, name: 'Trà Đào Cam Sả', price: 35000, category: 'Trà', img: 'https://images.unsplash.com/photo-1513558117768-a40d5c074ea9?w=200&q=80' },
            { id: 202, name: 'Trà Vải', price: 35000, category: 'Trà', img: 'https://images.unsplash.com/photo-1558850117-9195b0fadb9e?w=200&q=80' },
            { id: 301, name: 'Sinh Tố Bơ', price: 40000, category: 'Sinh Tố', img: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=200&q=80' },
            { id: 401, name: 'Bánh Mì Pate', price: 25000, category: 'Đồ Ăn', img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=200&q=80' },
            { id: 402, name: 'Bánh Sừng Bò', price: 30000, category: 'Đồ Ăn', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&q=80' }
        ],
        categories: ['Tất cả', 'Cà Phê', 'Trà', 'Sinh Tố', 'Đồ Ăn'],
        currentTableId: null,
        activeCategory: 'Tất cả',
        filterStatus: 'all',
        discount: 0,
        vatRate: 0.08
    };

    // Pre-fill some table carts
    state.tables.forEach(t => {
        if(t.status === 'occupied' || t.status === 'paying') {
            const item = state.menu[Math.floor(Math.random() * state.menu.length)];
            t.cart.push({ ...item, qty: 1 });
            const item2 = state.menu[Math.floor(Math.random() * state.menu.length)];
            t.cart.push({ ...item2, qty: 2 });
            calcTableTotal(t);
        }
    });

    // Formatting utilities
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    function calcTableTotal(table) {
        table.total = table.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    // Elements
    const viewTables = document.getElementById('view-tables');
    const viewPos = document.getElementById('view-pos');
    const tableGrid = document.getElementById('tables-grid');
    const menuGrid = document.getElementById('menu-grid');
    const cartItems = document.getElementById('cart-items');
    const navBtns = document.querySelectorAll('.sidebar-nav .nav-btn');
    const clockEl = document.getElementById('real-time-clock');
    const notifSound = document.getElementById('notif-sound');

    // 1. Clock
    setInterval(() => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
    }, 1000);

    // 2. Navigation
    navBtns.forEach(btn => {
        if(btn.id === 'notif-btn') return;
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if(view === 'tables') {
                viewTables.classList.add('active');
                viewPos.classList.remove('active');
                document.getElementById('view-title').textContent = 'Sơ Đồ Bàn';
                renderTables();
            } else if (view === 'menu') {
                // If opening POS view from nav, don't tie to table
                state.currentTableId = null;
                openPosView();
            }
        });
    });

    document.getElementById('btn-back-tables').addEventListener('click', () => {
        document.querySelector('[data-view="tables"]').click();
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        if(confirm('Bạn có muốn đăng xuất?')) {
            window.location.href = '/pages/login.html';
        }
    });

    // 3. Render Tables
    const renderTables = () => {
        tableGrid.innerHTML = '';
        const filtered = state.tables.filter(t => state.filterStatus === 'all' || t.status === state.filterStatus);
        
        filtered.forEach(table => {
            const el = document.createElement('div');
            el.className = `table-card ${table.status}`;
            
            let statusText = 'Trống';
            if(table.status === 'occupied') statusText = 'Có khách';
            if(table.status === 'paying') statusText = 'Thanh toán';
            if(table.status === 'reserved') statusText = 'Đặt trước';

            el.innerHTML = `
                <div class="table-icon">☕</div>
                <div class="table-name">${table.name}</div>
                <div class="table-status">${statusText}</div>
                <div class="table-total">${formatCurrency(table.total)}</div>
            `;
            el.addEventListener('click', () => {
                state.currentTableId = table.id;
                navBtns.forEach(b => b.classList.remove('active'));
                openPosView();
            });
            tableGrid.appendChild(el);
        });
    };

    // Table Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.filterStatus = e.target.dataset.status;
            renderTables();
        });
    });

    // 4. POS View (Menu & Cart)
    const openPosView = () => {
        viewTables.classList.remove('active');
        viewPos.classList.add('active');
        document.getElementById('view-title').textContent = 'Chi Tiết Đơn / Menu';
        
        renderCategories();
        renderMenu();
        updateCartView();
    };

    const renderCategories = () => {
        const container = document.getElementById('category-tabs');
        container.innerHTML = '';
        state.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `cat-btn ${state.activeCategory === cat ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                state.activeCategory = cat;
                renderCategories();
                renderMenu();
            });
            container.appendChild(btn);
        });
    };

    const renderMenu = (searchQuery = '') => {
        menuGrid.innerHTML = '';
        const filtered = state.menu.filter(item => {
            const matchCat = state.activeCategory === 'Tất cả' || item.category === state.activeCategory;
            const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });

        filtered.forEach(item => {
            const el = document.createElement('div');
            el.className = 'menu-item';
            el.innerHTML = `
                <img src="${item.img}" class="menu-img" alt="${item.name}">
                <div class="menu-info">
                    <div class="menu-title">${item.name}</div>
                    <div class="menu-price">${formatCurrency(item.price)}</div>
                </div>
            `;
            el.addEventListener('click', () => addToCart(item));
            menuGrid.appendChild(el);
        });
    };

    document.getElementById('search-product').addEventListener('input', (e) => {
        renderMenu(e.target.value);
    });

    // 5. Cart Logic
    const addToCart = (product) => {
        if(!state.currentTableId) {
            alert('Vui lòng chọn bàn trước khi thêm món!');
            return;
        }
        const table = state.tables.find(t => t.id === state.currentTableId);
        
        // Auto convert empty table to occupied when adding items
        if (table.status === 'empty' || table.status === 'reserved') {
            table.status = 'occupied';
        }

        const existing = table.cart.find(i => i.id === product.id);
        if(existing) {
            existing.qty += 1;
        } else {
            table.cart.push({ ...product, qty: 1 });
        }
        calcTableTotal(table);
        updateCartView();
    };

    const updateCartQty = (productId, delta) => {
        const table = state.tables.find(t => t.id === state.currentTableId);
        if(!table) return;
        const item = table.cart.find(i => i.id === productId);
        if(item) {
            item.qty += delta;
            if(item.qty <= 0) {
                table.cart = table.cart.filter(i => i.id !== productId);
            }
            calcTableTotal(table);
            updateCartView();
        }
    };

    const updateCartView = () => {
        const tableHeader = document.getElementById('cart-table-name');
        const tableStatus = document.getElementById('cart-table-status');
        
        if(!state.currentTableId) {
            tableHeader.textContent = "Chưa chọn bàn";
            tableStatus.className = 'status-badge';
            tableStatus.textContent = '';
            cartItems.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">Không có đơn hàng</td></tr>';
            document.getElementById('summary-subtotal').textContent = '0đ';
            document.getElementById('summary-total').textContent = '0đ';
            return;
        }

        const table = state.tables.find(t => t.id === state.currentTableId);
        tableHeader.textContent = table.name;
        
        tableStatus.className = 'status-badge ' + (table.status === 'empty' ? 'empty' : 'occupied');
        let statusTxt = 'Trống';
        if(table.status === 'occupied') statusTxt = 'Có khách';
        if(table.status === 'paying') statusTxt = 'Thanh toán';
        if(table.status === 'reserved') statusTxt = 'Đặt trước';
        tableStatus.textContent = statusTxt;

        cartItems.innerHTML = '';
        if(table.cart.length === 0) {
            cartItems.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">Bàn trống</td></tr>';
        } else {
            table.cart.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-note">${formatCurrency(item.price)}</span>
                    </td>
                    <td class="qty-control">
                        <button class="btn-qty btn-minus" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="btn-qty btn-plus" data-id="${item.id}">+</button>
                    </td>
                    <td style="text-align:right">
                        ${formatCurrency(item.price * item.qty)}
                        <button class="cart-item-remove" data-id="${item.id}">×</button>
                    </td>
                `;
                cartItems.appendChild(tr);
            });
        }

        // Attach events
        document.querySelectorAll('.btn-minus').forEach(b => b.addEventListener('click', (e) => updateCartQty(parseInt(e.target.dataset.id), -1)));
        document.querySelectorAll('.btn-plus').forEach(b => b.addEventListener('click', (e) => updateCartQty(parseInt(e.target.dataset.id), +1)));
        document.querySelectorAll('.cart-item-remove').forEach(b => b.addEventListener('click', (e) => updateCartQty(parseInt(e.target.dataset.id), -999)));

        document.getElementById('summary-subtotal').textContent = formatCurrency(table.total);
        document.getElementById('summary-total').textContent = formatCurrency(table.total);
    };

    // Actions
    document.getElementById('btn-kitchen').addEventListener('click', () => {
        if(!state.currentTableId || state.tables.find(t => t.id === state.currentTableId).cart.length === 0) return;
        alert('✅ Đã gửi order vào Bếp/Pha chế');
    });

    document.getElementById('btn-print').addEventListener('click', () => {
        if(!state.currentTableId || state.tables.find(t => t.id === state.currentTableId).cart.length === 0) return;
        alert('🖨️ Đang in hóa đơn tạm tính...');
    });

    // 6. Checkout Modal
    const checkoutModal = document.getElementById('checkout-modal');
    
    document.getElementById('btn-checkout').addEventListener('click', () => {
        if(!state.currentTableId) return;
        const table = state.tables.find(t => t.id === state.currentTableId);
        if(table.cart.length === 0) return;

        table.status = 'paying';
        updateCheckoutModal(table);
        checkoutModal.classList.add('active');
    });

    document.getElementById('close-checkout').addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        // revert status if just viewing
        const table = state.tables.find(t => t.id === state.currentTableId);
        if(table && table.status === 'paying') {
            table.status = 'occupied';
        }
    });

    const updateCheckoutModal = (table) => {
        document.getElementById('checkout-table-name').textContent = table.name;
        document.getElementById('checkout-subtotal').textContent = formatCurrency(table.total);
        
        const calcFinal = () => {
            const discountPct = parseInt(document.getElementById('checkout-discount').value) || 0;
            const discountedAmount = table.total * (1 - discountPct/100);
            const vat = discountedAmount * state.vatRate;
            const final = discountedAmount + vat;
            
            document.getElementById('checkout-vat').textContent = formatCurrency(vat);
            document.getElementById('checkout-final').textContent = formatCurrency(final);
            return final;
        };
        
        let finalAmount = calcFinal();

        document.getElementById('checkout-discount').addEventListener('input', () => {
            finalAmount = calcFinal();
            calcChange();
        });

        // Payment Method toggles
        const methodBtns = document.querySelectorAll('.method-btn');
        const cashSection = document.getElementById('cash-payment-section');
        methodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                methodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                btn.querySelector('input').checked = true;
                
                if(btn.querySelector('input').value === 'cash') {
                    cashSection.style.display = 'block';
                } else {
                    cashSection.style.display = 'none';
                }
            });
        });

        const receivedInput = document.getElementById('checkout-received');
        const changeEl = document.getElementById('checkout-change');
        
        const calcChange = () => {
            const received = parseInt(receivedInput.value) || 0;
            if(received >= finalAmount) {
                changeEl.textContent = formatCurrency(received - finalAmount);
                changeEl.style.color = "var(--success)";
            } else {
                changeEl.textContent = 'Chưa đủ tiền';
                changeEl.style.color = "var(--danger)";
            }
        };

        receivedInput.value = '';
        changeEl.textContent = '0đ';
        receivedInput.addEventListener('input', calcChange);
    };

    document.getElementById('btn-confirm-payment').addEventListener('click', () => {
        const table = state.tables.find(t => t.id === state.currentTableId);
        table.cart = [];
        table.total = 0;
        table.status = 'empty';
        
        alert(`✅ Đã thanh toán thành công cho ${table.name}!`);
        checkoutModal.classList.remove('active');
        document.getElementById('btn-back-tables').click(); // Go back to tables
    });

    // Mock notification
    setTimeout(() => {
        const badge = document.getElementById('notif-badge');
        badge.textContent = '1';
        badge.style.display = 'flex';
        // notifSound.play().catch(e => console.log('Autoplay blocked'));
        const activeTableMsg =  "Khách Bàn 5 vẫy gọi NV";
        console.log(activeTableMsg);
    }, 5000);

    // Initial render
    renderTables();
});
