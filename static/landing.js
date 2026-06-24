document.body.addEventListener('click', () => {
            // Add the fluent exit animation class
            document.body.classList.add('exit-animation');
            
            // Wait for the animation to mostly finish before redirecting
            setTimeout(() => {
                window.location.href = "{{ url_for('instructions_page') }}";
            }, 350); 
        });

        // Handle browser back button (BFCache restores page in exit-animation state)
        window.addEventListener('pageshow', (event) => {
            // event.persisted is true if page is loaded from bfcache
            document.body.classList.remove('exit-animation');
        });