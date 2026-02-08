// SparklingPicks Simple Analytics Tracker
// Logs pageviews to localStorage, syncs to beacon endpoint if available
(function() {
    'use strict';
    
    var SP_TRACK = {
        version: '1.0',
        
        init: function() {
            this.logPageview();
            this.trackClicks();
        },
        
        getSessionId: function() {
            var sid = sessionStorage.getItem('sp_sid');
            if (!sid) {
                sid = 'sp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('sp_sid', sid);
            }
            return sid;
        },
        
        logPageview: function() {
            var data = {
                t: 'pv',
                ts: Date.now(),
                url: location.pathname,
                ref: document.referrer || '(direct)',
                sid: this.getSessionId(),
                ua: navigator.userAgent,
                sw: screen.width,
                sh: screen.height
            };
            this.store(data);
        },
        
        trackClicks: function() {
            var self = this;
            document.addEventListener('click', function(e) {
                var link = e.target.closest('a[href*="amazon"]');
                if (link) {
                    var data = {
                        t: 'click',
                        ts: Date.now(),
                        url: location.pathname,
                        dest: link.href,
                        text: (link.textContent || '').trim().substring(0, 50),
                        sid: self.getSessionId()
                    };
                    self.store(data);
                    self.beacon(data);
                }
            });
        },
        
        store: function(data) {
            try {
                var logs = JSON.parse(localStorage.getItem('sp_logs') || '[]');
                logs.push(data);
                // Keep last 500 events
                if (logs.length > 500) logs = logs.slice(-500);
                localStorage.setItem('sp_logs', JSON.stringify(logs));
            } catch(e) {}
        },
        
        beacon: function(data) {
            // If we have a beacon endpoint, send immediately
            // For now, just store - we'll add endpoint later
            if (navigator.sendBeacon && window.SP_BEACON_URL) {
                navigator.sendBeacon(window.SP_BEACON_URL, JSON.stringify(data));
            }
        },
        
        // Export function for manual retrieval
        exportLogs: function() {
            return JSON.parse(localStorage.getItem('sp_logs') || '[]');
        }
    };
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { SP_TRACK.init(); });
    } else {
        SP_TRACK.init();
    }
    
    // Expose for debugging
    window.SP_TRACK = SP_TRACK;
})();
