/**
 * Simple analytics and conversion tracking for SparklingPicks
 */
(function() {
    // Track page views
    const pageData = {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: Date.now()
    };

    // Track scroll depth (for engagement)
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
    });

    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        // Could send to analytics endpoint here
    });

    // Track affiliate link clicks with visual feedback
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="amazon"]');
        if (link) {
            // Visual feedback
            link.style.transform = 'scale(0.98)';
            setTimeout(() => link.style.transform = '', 150);
            
            // Log click (replace with real analytics)
            console.log('[SparklingPicks] Affiliate click:', {
                product: link.textContent.trim().substring(0, 50),
                page: window.location.pathname,
                position: Array.from(document.querySelectorAll('a[href*="amazon"]')).indexOf(link)
            });
        }
    });

    // Add urgency indicators to stock status
    function addUrgencyIndicators() {
        document.querySelectorAll('.product-card').forEach(card => {
            const reviews = card.querySelector('.reviews');
            if (reviews) {
                const count = parseInt(reviews.textContent.replace(/[^0-9]/g, ''));
                if (count > 5000) {
                    const urgency = document.createElement('div');
                    urgency.className = 'urgency';
                    urgency.textContent = '🔥 Popular choice';
                    reviews.parentNode.insertBefore(urgency, reviews.nextSibling);
                }
            }
        });
    }

    // Highlight "Best Value" products
    function highlightBestValue() {
        document.querySelectorAll('.product-card').forEach(card => {
            const priceNote = card.querySelector('.price-note');
            if (priceNote && priceNote.textContent.toLowerCase().includes('value')) {
                card.classList.add('best-value');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addUrgencyIndicators();
            highlightBestValue();
        });
    } else {
        addUrgencyIndicators();
        highlightBestValue();
    }
})();
