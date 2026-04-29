
// Main Application Entry Point
import Router from './router.js';

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.router = new Router(this.appElement);
    }

    init() {
        console.log('THP Service Knowledge Center Initialized');
        this.router.loadRoute(window.location.pathname);

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.router.loadRoute(window.location.pathname);
        });
    }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => {
    app.init();
    // Re-init icons after dynamic content load if needed
    if (window.lucide) window.lucide.createIcons();
});
