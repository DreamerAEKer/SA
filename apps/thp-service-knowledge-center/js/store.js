
import { services as initialServices } from './data/services.js';

class Store {
    constructor() {
        this.services = this.loadServices();
    }

    loadServices() {
        const stored = localStorage.getItem('thp_services');
        if (stored) {
            return JSON.parse(stored);
        }
        return initialServices;
    }

    save() {
        localStorage.setItem('thp_services', JSON.stringify(this.services));
    }

    getAll() {
        return this.services;
    }

    getById(id) {
        return this.services.find(s => s.id === id);
    }

    addService(service) {
        this.services.unshift(service); // Add to top
        this.save();
    }

    deleteService(id) {
        this.services = this.services.filter(s => s.id !== id);
        this.save();
    }

    search(query) {
        const lowerQ = query.toLowerCase();
        return this.services.filter(s =>
            s.name.toLowerCase().includes(lowerQ) ||
            s.description.toLowerCase().includes(lowerQ)
        );
    }
}

export const store = new Store();
