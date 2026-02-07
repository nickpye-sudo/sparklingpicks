/**
 * Geo-targeting for Amazon affiliate links
 * Redirects users to their local Amazon store with proper ASINs
 */
(function() {
    const AMAZON_CONFIG = {
        'GB': { domain: 'amazon.co.uk', tag: 'sparklingpicks-21', currency: '£' },
        'DE': { domain: 'amazon.de', tag: 'sparklingpicks-21', currency: '€' },
        'FR': { domain: 'amazon.fr', tag: 'sparklingpicks-21', currency: '€' },
        'ES': { domain: 'amazon.es', tag: 'sparklingpicks-21', currency: '€' },
        'IT': { domain: 'amazon.it', tag: 'sparklingpicks-21', currency: '€' },
        'NL': { domain: 'amazon.nl', tag: 'sparklingpicks-21', currency: '€' },
        'BE': { domain: 'amazon.de', tag: 'sparklingpicks-21', currency: '€' },
        'AT': { domain: 'amazon.de', tag: 'sparklingpicks-21', currency: '€' },
        'CH': { domain: 'amazon.de', tag: 'sparklingpicks-21', currency: 'CHF' },
        'US': { domain: 'amazon.com', tag: 'sparkpicks-20', currency: '$' },
        'CA': { domain: 'amazon.ca', tag: 'sparkpicks-20', currency: 'C$' },
        'AU': { domain: 'amazon.com.au', tag: 'sparkpicks-20', currency: 'A$' }
    };

    // Detect user's country from timezone
    function detectCountry() {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const tzCountryMap = {
                'Europe/London': 'GB', 'Europe/Dublin': 'GB',
                'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
                'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
                'Europe/Madrid': 'ES', 'Europe/Rome': 'IT',
                'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH',
                'Europe/Lisbon': 'ES', 'Europe/Warsaw': 'DE',
                'America/New_York': 'US', 'America/Los_Angeles': 'US',
                'America/Chicago': 'US', 'America/Denver': 'US',
                'America/Phoenix': 'US', 'America/Detroit': 'US',
                'America/Toronto': 'CA', 'America/Vancouver': 'CA',
                'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
                'Australia/Perth': 'AU', 'Australia/Brisbane': 'AU'
            };
            return tzCountryMap[tz] || 'GB';
        } catch (e) {
            return 'GB';
        }
    }

    // Extract ASIN from any Amazon URL
    function extractASIN(url) {
        const patterns = [
            /\/dp\/([A-Z0-9]{10})/,
            /\/product\/([A-Z0-9]{10})/,
            /\/gp\/product\/([A-Z0-9]{10})/,
            /asin=([A-Z0-9]{10})/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    // Update all Amazon links on the page
    function updateAmazonLinks() {
        const country = detectCountry();
        const config = AMAZON_CONFIG[country] || AMAZON_CONFIG['GB'];
        
        // Find all Amazon links (any Amazon domain)
        const amazonLinkPattern = /amazon\.(com|co\.uk|de|fr|es|it|nl|ca|com\.au)/;
        
        document.querySelectorAll('a[href]').forEach(link => {
            if (!amazonLinkPattern.test(link.href)) return;
            
            const asin = extractASIN(link.href);
            if (asin) {
                link.href = `https://www.${config.domain}/dp/${asin}?tag=${config.tag}`;
            }
        });
        
        console.log('[SparklingPicks] Links geo-targeted for:', country, '→', config.domain);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAmazonLinks);
    } else {
        updateAmazonLinks();
    }

    // Track affiliate clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="amazon"]');
        if (link) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'affiliate_click', {
                    'event_category': 'affiliate',
                    'event_label': extractASIN(link.href) || link.href,
                    'country': detectCountry()
                });
            }
        }
    });
})();
