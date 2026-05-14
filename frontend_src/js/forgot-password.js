/* ========================================
   FORGOT PASSWORD - Password reset logic
   ======================================== */

const ForgotPassword = {
    /**
     * Handle forgot password form submission
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const submitBtn = document.querySelector('.login-btn');
        const alertContainer = document.getElementById('alert-container');

        if (!email) {
            Utils.showAlert('Vui lòng nhập email của bạn', 'error');
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('span:not(.loading-spinner)');
        const originalText = btnText ? btnText.textContent : 'Xác Nhận';
        if (btnText) btnText.textContent = 'Đang xử lý...';
        
        try {
            // Simulated API call - In a real app, this would call API.auth.forgotPassword(email)
            // But since we don't have that endpoint yet, we'll simulate success for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            Utils.showAlert('Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn.', 'success');
            
            // Show success message and hide form
            const form = document.getElementById('forgot-password-form');
            if (form) {
                form.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">📧</div>
                        <h2 style="color: white; margin-bottom: 10px;">Kiểm Tra Email</h2>
                        <p style="color: #94a3b8; margin-bottom: 25px;">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>${email}</strong></p>
                        <a href="login.html" class="login-btn" style="text-decoration: none; display: inline-block; width: auto; padding: 12px 30px;">
                            Quay lại Đăng Nhập
                        </a>
                    </div>
                `;
            }
        } catch (error) {
            Utils.showAlert('Lỗi: ' + error.message, 'error');
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = originalText;
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    if (form) {
        form.addEventListener('submit', ForgotPassword.handleSubmit);
    }
});
