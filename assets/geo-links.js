/**
 * Geo-targeted Amazon Affiliate Links
 * Automatically redirects users to their local Amazon store
 */
(function() {
  // Amazon domains by country (timezone-based detection)
  const amazonStores = {
    'Europe/London': { domain: 'amazon.co.uk', tag: 'sparklingpicks-21' },
    'Europe/Paris': { domain: 'amazon.fr', tag: 'sparklingpicks-21' },
    'Europe/Berlin': { domain: 'amazon.de', tag: 'sparklingpicks-21' },
    'Europe/Rome': { domain: 'amazon.it', tag: 'sparklingpicks-21' },
    'Europe/Madrid': { domain: 'amazon.es', tag: 'sparklingpicks-21' },
    'America/New_York': { domain: 'amazon.com', tag: 'sparklingpicks-21' },
    'America/Los_Angeles': { domain: 'amazon.com', tag: 'sparklingpicks-21' },
    'America/Chicago': { domain: 'amazon.com', tag: 'sparklingpicks-21' },
  };

  // Country fallbacks by timezone prefix
  const regionFallbacks = {
    'Europe/': { domain: 'amazon.co.uk', tag: 'sparklingpicks-21' },
    'America/': { domain: 'amazon.com', tag: 'sparklingpicks-21' },
    'Australia/': { domain: 'amazon.com.au', tag: 'sparklingpicks-21' },
    'Asia/Tokyo': { domain: 'amazon.co.jp', tag: 'sparklingpicks-21' },
  };

  // Default fallback
  const defaultStore = { domain: 'amazon.co.uk', tag: 'sparklingpicks-21' };

  function getLocalStore() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Exact match first
      if (amazonStores[tz]) {
        return amazonStores[tz];
      }
      
      // Region fallback
      for (const [prefix, store] of Object.entries(regionFallbacks)) {
        if (tz.startsWith(prefix)) {
          return store;
        }
      }
    } catch (e) {
      console.log('Timezone detection failed, using default');
    }
    
    return defaultStore;
  }

  function updateAmazonLinks() {
    const store = getLocalStore();
    const links = document.querySelectorAll('a[href*="amazon."]');
    
    links.forEach(link => {
      const href = link.href;
      
      // Extract search query or product path
      let searchQuery = '';
      const searchMatch = href.match(/[?&]k=([^&]+)/);
      const pathMatch = href.match(/\/dp\/([A-Z0-9]+)/);
      
      if (searchMatch) {
        searchQuery = searchMatch[1];
        // Build new search URL for local store
        link.href = `https://www.${store.domain}/s?k=${searchQuery}&tag=${store.tag}`;
      } else if (pathMatch) {
        // Product page - keep the ASIN
        const asin = pathMatch[1];
        link.href = `https://www.${store.domain}/dp/${asin}?tag=${store.tag}`;
      } else {
        // Generic Amazon link - just swap domain and add tag
        const newHref = href
          .replace(/amazon\.(co\.uk|com|de|fr|it|es|co\.jp|com\.au)/g, store.domain)
          .replace(/tag=[^&]+/, `tag=${store.tag}`);
        
        // Add tag if missing
        if (!newHref.includes('tag=')) {
          link.href = newHref + (newHref.includes('?') ? '&' : '?') + `tag=${store.tag}`;
        } else {
          link.href = newHref;
        }
      }
    });
    
    console.log(`Updated ${links.length} Amazon links for ${store.domain}`);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAmazonLinks);
  } else {
    updateAmazonLinks();
  }
})();
