
import { store } from '../store.js';

export default class ServiceDetail {
    constructor(router) {
        this.router = router;
        this.serviceId = window.location.pathname.split('/service/')[1];
        this.service = store.getById(this.serviceId);
    }

    async render() {
        if (!this.service) {
            return `<div class="p-8 text-center">Service not found</div>`;
        }

        const isExpired = this.service.status === 'Expired';
        const colorClass = isExpired ? 'red' : 'green';

        return `
            <div class="min-h-screen bg-slate-50 pb-12">
                <!-- Header -->
                <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
                        <button class="flex items-center gap-2 text-slate-600 hover:text-${hasStaffAccess() ? 'red-600' : 'red-600'}" id="btn-back">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i> Back
                        </button>
                        <div class="font-bold text-slate-800">${this.service.name}</div>
                        <div class="w-8"></div> <!-- Spacer -->
                    </div>
                </div>

                <div class="container mx-auto px-4 py-8">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <!-- Left: Main Content -->
                        <div class="lg:col-span-2 space-y-8">
                            <!-- Title & Status -->
                            <div>
                                <div class="flex items-center gap-3 mb-4">
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-${colorClass}-100 text-${colorClass}-700">
                                        ${this.service.status}
                                    </span>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                        ${this.service.type}
                                    </span>
                                </div>
                                <h1 class="text-3xl font-bold text-slate-900 mb-4">${this.service.name}</h1>
                                <p class="text-lg text-slate-600 leading-relaxed">${this.service.description}</p>
                            </div>

                            <!-- Media / Files Section (Mock) -->
                            <div class="card p-6">
                                <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
                                    <i data-lucide="file-text" class="text-red-500"></i> Service Documents & Media
                                </h3>
                                
                                ${this.renderAttachments()}
                            </div>
                        </div>

                        <!-- Right: Sidebar Info -->
                        <div class="space-y-6">
                            <div class="card p-6 bg-white">
                                <h3 class="font-bold text-slate-900 mb-4">Quick Facts</h3>
                                <dl class="space-y-4">
                                    <div>
                                        <dt class="text-sm text-slate-500">Effective Date</dt>
                                        <dd class="font-medium text-slate-900">${this.service.lastUpdated}</dd>
                                    </div>
                                    ${this.service.expiredDate ? `
                                    <div>
                                        <dt class="text-sm text-slate-500">Expiration Date</dt>
                                        <dd class="font-medium text-red-600">${this.service.expiredDate}</dd>
                                    </div>` : ''}
                                    <div>
                                        <dt class="text-sm text-slate-500">Target Audience</dt>
                                        <dd class="font-medium text-slate-900">${this.service.target}</dd>
                                    </div>
                                </dl>
                            </div>
                            
                            <!-- Help Box -->
                            <div class="card p-6 bg-gradient-to-br from-red-600 to-red-700 text-white border-0">
                                <h3 class="font-bold text-lg mb-2">Need Help?</h3>
                                <p class="text-red-100 text-sm mb-4">Contact our support staff for more details about this service.</p>
                                <button class="w-full py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAttachments() {
        // Mock logic for attachments. In real app, check this.service.files
        if (this.service.files && this.service.files.length > 0) {
            return `<div class="grid grid-cols-2 gap-4">
                ${this.service.files.map(f => `
                    <div class="border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer">
                        <i data-lucide="${f.type === 'pdf' ? 'file' : 'image'}" class="text-slate-400"></i>
                        <span class="text-sm font-medium truncate">${f.name}</span>
                    </div>
                `).join('')}
            </div>`;
        }

        return `
            <div class="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                <i data-lucide="file-x" class="mx-auto h-8 w-8 text-slate-300 mb-2"></i>
                <p class="text-slate-500 text-sm">No PDF or images available for this service.</p>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById('btn-back').addEventListener('click', () => {
            window.history.back();
        });
    }
}

// Simple helper to guess where to go back to (logic can be improved)
function hasStaffAccess() {
    return document.referrer.includes('/staff');
}
