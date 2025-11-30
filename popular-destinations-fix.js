// Popular Destinations - Read More Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Find all cards in Popular Destinations section
    const cards = document.querySelectorAll('.mySwiper3 .swiper-slide .text-gray-600');
    
    cards.forEach(card => {
        const text = card.textContent.trim();
        
        // Check if text is longer than 3 lines (approximately 150 characters)
        if (text.length > 150) {
            // Truncate text
            const shortText = text.substring(0, 150) + '...';
            card.setAttribute('data-full-text', text);
            card.setAttribute('data-short-text', shortText);
            card.textContent = shortText;
            
            // Create Read More button
            const readMoreBtn = document.createElement('span');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Read More';
            readMoreBtn.style.cursor = 'pointer';
            
            // Insert after the paragraph
            card.parentNode.insertBefore(readMoreBtn, card.nextSibling);
            
            // Toggle functionality
            let isExpanded = false;
            readMoreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    card.textContent = card.getAttribute('data-full-text');
                    card.classList.add('expanded');
                    readMoreBtn.textContent = 'Read Less';
                } else {
                    card.textContent = card.getAttribute('data-short-text');
                    card.classList.remove('expanded');
                    readMoreBtn.textContent = 'Read More';
                }
            });
        }
    });
});
