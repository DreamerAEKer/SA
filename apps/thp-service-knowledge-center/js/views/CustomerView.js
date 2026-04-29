
import { store } from '../store.js';

export default class CustomerView {
    constructor(router) {
        this.router = router;
        this.services = store.getAll().filter(s => s.target === 'Customer' || s.target === 'Both');
    }

    async render() {
        return `
            <div class="min-h-screen bg-slate-50">
                <!-- Helper Nav -->
                <nav class="bg-white shadow-sm sticky top-0 z-10 glass">
                    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div class="flex items-center gap-2 cursor-pointer" id="nav-home">
                            <div class="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">P</div>
                            <span class="font-bold text-red-600 text-lg">THP Knowledge</span>
                        </div>
                        <button class="text-slate-500 hover:text-red-600 transition-colors" id="nav-back">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i> Back to Portal
                        </button>
                    </div>
                </nav>

                <!-- Hero Section -->
                <div class="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 text-center">
                    <div class="container mx-auto px-4">
                        <h1 class="text-4xl font-bold mb-4">How can we help you today?</h1>
                        <p class="text-red-100 mb-8 max-w-2xl mx-auto">Explore Thailand Post's delivery services, rates, and solutions designed for you.</p>
                        
                        <!-- Search Bar -->
                        <div class="max-w-xl mx-auto relative">
                            <input type="text" 
                                placeholder="Search for a service (e.g., EMS, COD)..." 
                                class="w-full h-14 pl-12 pr-4 rounded-full shadow-lg text-slate-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all placeholder:text-slate-400"
                            >
                            <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"></i>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="container mx-auto px-4 py-12">
                    <h2 class="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <i data-lucide="package" class="text-red-600"></i> Available Services
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${this.services.map(service => this.createServiceCard(service)).join('')}
                    </div>
                </div>
            </div>
            
            <style>
                 /* Tailwind-like utilities if not using full Tailwind */
                 .bg-red-600 { background-color: var(--thp-red); }
                 .bg-red-700 { background-color: var(--thp-red-dark); }
                 .text-red-600 { color: var(--thp-red); }
                 .text-red-100 { color: #ffe5e6; }
                 .grid { display: grid; }
                 .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                 @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
                 @media (min-width: 1024px) { .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
            </style>
        `;
    }

    createServiceCard(service) {
        return `
            <div class="card hover:border-red-500 cursor-pointer group">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-red-50 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <i data-lucide="truck" class="w-6 h-6"></i>
                    </div>
                    <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ${service.type}
                    </span>
                </div>
                <h3 class="text-xl font-bold mb-2 group-hover:text-red-600 transition-colors">${service.name}</h3>
                <p class="text-slate-500 text-sm mb-4 line-clamp-2">${service.description}</p>
                <div class="flex items-center text-red-600 text-sm font-medium">
                    Learn more <i data-lucide="arrow-right" class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"></i>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById('nav-back').addEventListener('click', () => {
            this.router.navigateTo('/');
        });

        // Add listeners to cards later for detail view
    }
}
