document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Function to update button text based on theme
    function updateThemeButton(theme) {
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Function to create Jackson animation
    function createJacksonAnimation(e) {
        const jackson = document.createElement('img');
        jackson.src = 'jackson.png';
        jackson.style.position = 'fixed';
        jackson.style.width = '0';
        jackson.style.height = '0';
        jackson.style.zIndex = '9999';
        jackson.style.pointerEvents = 'none';
        jackson.style.transition = 'width 0.5s ease-in-out, height 0.5s ease-in-out, transform 0.5s ease-in-out';
        document.body.appendChild(jackson);

        let isActive = true;

        function updatePosition(e) {
            const width = parseFloat(jackson.style.width) || 0;
            const height = parseFloat(jackson.style.height) || 0;
            jackson.style.left = (e.clientX - width/2) + 'px';
            jackson.style.top = (e.clientY - height/2) + 'px';
        }

        const mouseMoveHandler = (e) => {
            if (isActive) {
                updatePosition(e);
            }
        };

        // Start following mouse
        document.addEventListener('mousemove', mouseMoveHandler);
        updatePosition(e);

        // Grow and spin
        setTimeout(() => {
            jackson.style.transform = 'rotate(720deg)';
            jackson.style.width = '200px';
            jackson.style.height = '200px';
        }, 0);

        // Hold position (but keep following mouse)
        setTimeout(() => {
            jackson.style.transform = 'rotate(720deg)';
        }, 500);

        // Shrink and spin opposite
        setTimeout(() => {
            jackson.style.transform = 'rotate(0deg)';
            jackson.style.width = '0';
            jackson.style.height = '0';
        }, 1500);

        // Remove element and stop following
        setTimeout(() => {
            isActive = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.body.removeChild(jackson);
        }, 2000);
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    let lastKnownMousePosition = { x: 0, y: 0 };
    
    // Track mouse position globally
    document.addEventListener('mousemove', (e) => {
        lastKnownMousePosition.x = e.clientX;
        lastKnownMousePosition.y = e.clientY;
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
        
        if (currentTheme === 'dark') { // Only animate when switching to light theme
            createJacksonAnimation({
                clientX: lastKnownMousePosition.x,
                clientY: lastKnownMousePosition.y
            });
        }
    });

    // Smooth scroll and pulse effect
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove highlight from any previously highlighted elements
            document.querySelectorAll('.scroll-highlight').forEach(el => {
                el.classList.remove('scroll-highlight');
            });

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Add highlight class
                requestAnimationFrame(() => {
                    target.classList.add('scroll-highlight');
                    
                    // Remove class after animation completes
                    setTimeout(() => {
                        target.classList.remove('scroll-highlight');
                    }, 2500);
                });
            }
        });
    });
});
