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

document.addEventListener('DOMContentLoaded', function () {
    tippy('.stepmother-card-number', {
        content: 'The tier of the card and indicates is cost to play.',
        followCursor: true,
    });
    tippy('.stepmother-title', {
        content: 'The name of the card.',
        followCursor: true,
    });
    tippy('.stepmother-art-placeholder', {
        content: 'Card Artwork',
        followCursor: true,
    });
    tippy('.stepmother-stats', {
        content: 'The attack and defence of the card.',
        followCursor: true,
    });
    tippy('.stepmother-arrow-right', {
        content: 'The direction the card can move or link to.',
        followCursor: true,
    });
    tippy('.stepmother-arrow-down', {
        content: 'The direction the card can move or link to.',
        followCursor: true,
    });
    tippy('.stepmother-trigger', {
        content: 'This is the cards effect or description. If there is a listed effect, it works as listed below. This area determines whether your card is capable of doing anything other than attacking.',
        followCursor: true,
    });
    tippy('.stepmother-active', {
        content: 'This is the cards effect or description. If there is a listed effect, it works as listed below. This area determines whether your card is capable of doing anything other than attacking.',
        followCursor: true,
    });
    tippy('.stepmother-family', {
        content: 'This is the cards tag. Cards within the same archetype share a tag and sometimes invoke a tag to specify an archetype of card.',
        followCursor: true,
    });
    tippy('.stepmother-outer-border-hover-area', {
        content: 'This is the border of the card, the colour indicates whether it is a Linked, Trigger, Passive, Active, Normal or Token. Cards with two borders are both types.',
        followCursor: true,
    });
});
