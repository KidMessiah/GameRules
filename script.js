document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });

        target.classList.add('pulse-glow');
        setTimeout(() => {
            target.classList.remove('pulse-glow');
        }, 2000); // Remove the class after 2 seconds
    });
});
