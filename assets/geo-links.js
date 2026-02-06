/**
 * Geo-targeting for Amazon affiliate links
 * Redirects users to their local Amazon store
 */
(function() {
    const AMAZON_DOMAINS = {
        'GB': { domain: 'amazon.co.uk', tag: 'sparklingpicks-21' },
        'DE': { domain: 'amazon.de', tag: 'sparklingpicks-21' },
        'FR': { domain: 'amazon.fr', tag: 'sparklingpicks-21' },
        'ES': { domain: 'amazon.es', tag: 'sparklingpicks-21' },
        'IT': { domain: 'amazon.it', tag: 'sparklingpicks-21' },
        'NL': { domain: 'amazon.nl', tag: 'sparklingpicks-21' },
        'BE': { domain: 'amazon.de', tag: 'sparklingpicks-21' },
        'AT': { domain: 'amazon.de', tag: 'sparklingpicks-21' },
        'US': { domain: 'amazon.com', tag: 'sparklingpicks-20' },
        'CA': { domain: 'amazon.ca', tag: 'sparklingpicks-20' }
    };

    // Get user's country from timezone or navigator
    function detectCountry() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tzCountryMap = {
                'Europe/London': 'GB', 'Europe/Dublin': 'GB',
                'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
                'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
                'Europe/Madrid': 'ES', 'Europe/Rome': 'IT',
                'Europe/Vienna': 'AT', 'Europe/Zurich': 'DE',
                'America/New_York': 'US', 'America/Los_Angeles': 'US',
                'America/Chicago': 'US', 'America/Denver': 'US',
                'America/Toronto': 'CA', 'America/Vancouver': 'CA'
            };
            return tzCountryMap[tz] || 'GB';
        } catch (e) {
            return 'GB';
        }
    }

    // Update Amazon links on page load
    function updateAmazonLinks() {
        const country = detectCountry();
        const config = AMAZON_DOMAINS[country] || AMAZON_DOMAINS['GB'];
        
        document.querySelectorAll('a[href*="amazon.co.uk"]').forEach(link => {
            const href = link.href;
            // Extract ASIN from URL
            const asinMatch = href.match(/\/dp\/([A-Z0-9]{10})/);
            if (asinMatch) {
                const asin = asinMatch[1];
                link.href = `https://www.${config.domain}/dp/${asin}?tag=${config.tag}`;
            }
        });
        
        console.log('[SparklingPicks] Links updated for:', country);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAmazonLinks);
    } else {
        updateAmazonLinks();
    }

    // Track clicks for analytics
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="amazon"]');
        if (link) {
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'affiliate_click', {
                    'event_category': 'affiliate',
                    'event_label': link.href
                });
            }
        }
    });
})();
