document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('button[type="button"]');
    togglePasswordBtns.forEach(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon && (icon.textContent === 'visibility_off' || icon.textContent === 'visibility')) {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                if (input && (input.type === 'password' || input.type === 'text')) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.textContent = 'visibility';
                    } else {
                        input.type = 'password';
                        icon.textContent = 'visibility_off';
                    }
                }
            });
        }
    });
});
