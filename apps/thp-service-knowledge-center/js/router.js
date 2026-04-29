
import Portal from './views/Portal.js';
import CustomerView from './views/CustomerView.js';
import StaffView from './views/StaffView.js';
import ServiceDetail from './views/ServiceDetail.js';

const routes = {
    '/': Portal,
    '/customer': CustomerView,
    '/staff': StaffView
};

export default class Router {
    constructor(appElement) {
        this.appElement = appElement;
    }

    async loadRoute(path) {
        let ViewClass = routes[path];

        // Dynamic Route Matching
        if (!ViewClass) {
            if (path.startsWith('/service/')) {
                ViewClass = ServiceDetail;
            } else {
                ViewClass = routes['/'];
            }
        }

        const view = new ViewClass(this);
        this.appElement.innerHTML = await view.render();

        // Re-initialize icons after render
        if (window.lucide) window.lucide.createIcons();

        // Execute any after-render logic the view might have
        if (view.afterRender) await view.afterRender();
    }

    navigateTo(path) {
        window.history.pushState({}, path, window.location.origin + path);
        this.loadRoute(path);
    }
}
