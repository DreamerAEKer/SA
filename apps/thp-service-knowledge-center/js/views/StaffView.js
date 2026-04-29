
import { store } from '../store.js';

export default class StaffView {
    constructor(router) {
        this.router = router;
        this.services = store.getAll(); // Staff sees all services
    }

    async render() {
        return `
            <div class="min-h-screen bg-slate-100 flex">
                <!-- Sidebar -->
                <aside class="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full">
                    <div class="p-6 border-b border-slate-100">
                        <span class="text-2xl font-bold text-red-600">THP STAFF</span>
                    </div>
                    <nav class="flex-1 p-4 space-y-2">
                        <a href="#" class="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg font-medium">
                            <i data-lucide="layout-grid" class="w-5 h-5"></i> Dashboard
                        </a>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <i data-lucide="folder-open" class="w-5 h-5"></i> All Services
                        </a>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <i data-lucide="clock" class="w-5 h-5"></i> History / Archives
                        </a>
                        <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                            <i data-lucide="settings" class="w-5 h-5"></i> Settings
                        </a>
                    </nav>
                    <div class="p-4 border-t border-slate-100">
                        <button class="flex items-center gap-2 text-slate-500 hover:text-red-600 w-full px-4 py-2" id="nav-logout">
                            <i data-lucide="log-out" class="w-5 h-5"></i> Exit to Portal
                        </button>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="flex-1 md:ml-64 p-8">
                    <header class="flex justify-between items-center mb-8">
                        <div>
                            <h1 class="text-2xl font-bold text-slate-800">Service Management</h1>
                            <p class="text-slate-500">Manage digital and physical service records</p>
                        </div>
                        <button class="btn btn-primary shadow-lg shadow-red-500/30" id="btn-add-service">
                            <i data-lucide="plus"></i> Add New Service
                        </button>
                    </header>

                    <!-- Stats Row -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="card flex items-center gap-4 p-6">
                            <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <i data-lucide="file-text" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-bold">128</div>
                                <div class="text-sm text-slate-500">Total Services</div>
                            </div>
                        </div>
                        <div class="card flex items-center gap-4 p-6">
                            <div class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                <i data-lucide="check-circle" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-bold">115</div>
                                <div class="text-sm text-slate-500">Active Services</div>
                            </div>
                        </div>
                        <div class="card flex items-center gap-4 p-6">
                            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                                <i data-lucide="archive" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="text-2xl font-bold">13</div>
                                <div class="text-sm text-slate-500">Expiring Soon</div>
                            </div>
                        </div>
                    </div>

                    <!-- Table Section -->
                    <div class="card overflow-hidden border-0 shadow-lg">
                         <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <h3 class="font-bold text-lg">Service Database</h3>
                            <div class="flex gap-2">
                                <button class="px-3 py-1.5 text-sm bg-slate-100 rounded-md hover:bg-slate-200">Filter</button>
                                <button class="px-3 py-1.5 text-sm bg-slate-100 rounded-md hover:bg-slate-200">Export</button>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th class="px-6 py-3 font-semibold">Service Name</th>
                                        <th class="px-6 py-3 font-semibold">Type</th>
                                        <th class="px-6 py-3 font-semibold">Status</th>
                                        <th class="px-6 py-3 font-semibold">Last Updated</th>
                                        <th class="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 bg-white">
                                    ${this.services.map(s => this.createRow(s)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            
            <style>
                .bg-slate-50 { background-color: #f8fafc; }
                .bg-slate-100 { background-color: #f1f5f9; }
                .text-slate-600 { color: #475569; }
                .border-slate-200 { border-color: #e2e8f0; }
                tr:hover { background-color: #f8fafc; }
            </style>
        `;
    }

    createRow(service) {
        const statusClass = service.status === 'Active'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'; // Expired or Inactive

        return `
            <tr class="transition-colors">
                <td class="px-6 py-4">
                    <div class="font-semibold text-slate-800">${service.name}</div>
                    <div class="text-xs text-slate-400">${service.description.substring(0, 40)}...</div>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        ${service.type}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
                        ${service.status}
                    </span>
                    ${service.expiredDate ? `<div class="text-[10px] text-red-500 mt-1">Exp: ${service.expiredDate}</div>` : ''}
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">
                    ${service.lastUpdated}
                </td>
                <td class="px-6 py-4 text-right">
                    <button class="text-slate-400 hover:text-blue-600 mx-1"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                    <button class="text-slate-400 hover:text-red-600 mx-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                </td>
            </tr>
        `;
    }

    async afterRender() {
        document.getElementById('nav-logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.router.navigateTo('/');
        });

        const addBtn = document.getElementById('btn-add-service');
        if (addBtn) {
            addBtn.addEventListener('click', async () => {
                const AddServiceModal = (await import('../components/AddServiceModal.js')).default;
                const modal = new AddServiceModal(() => {
                    // Refresh view
                    this.router.loadRoute(window.location.pathname);
                });
                document.body.insertAdjacentHTML('beforeend', modal.render());
                modal.attachEvents();
                if (window.lucide) window.lucide.createIcons();
            });
        }
    }
}
