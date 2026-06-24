// Micro-interaction for steps
        document.querySelectorAll('.group').forEach(item => {
            item.addEventListener('touchstart', () => {
                item.classList.add('bg-primary-container/5');
            });
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.classList.remove('bg-primary-container/5');
                }, 150);
            });
        });

        // Button click effect
        const proceedBtn = document.querySelector('footer button');
        proceedBtn.addEventListener('click', () => {
            proceedBtn.innerHTML = '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span> Loading...';
            setTimeout(() => {
                window.location.href = "{{ url_for('exam_page') }}";
            }, 1500);
        });