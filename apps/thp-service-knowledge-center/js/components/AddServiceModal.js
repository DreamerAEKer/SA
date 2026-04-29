
import { store } from '../store.js';

export default class AddServiceModal {
    constructor(onClose) {
        this.onClose = onClose; // Callback to refresh parent view
    }

    render() {
        return `
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" id="modal-overlay">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                    <div class="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <h2 class="text-xl font-bold text-slate-800">Add New Service</h2>
                        <button id="modal-close" class="text-slate-400 hover:text-red-500 transition-colors">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>
                    
                    <form id="add-service-form" class="p-6 space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Service Name *</label>
                                <input type="text" name="name" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Type *</label>
                                <select name="type" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500">
                                    <option value="Domestic">Domestic</option>
                                    <option value="International">International</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Description *</label>
                            <textarea name="description" rows="4" required class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"></textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Target Audience</label>
                                <select name="target" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500">
                                    <option value="Customer">Customer</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-slate-700">Status</label>
                                <select name="status" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500">
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </div>

                        <!-- File Upload -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-700">Attachments (PDF / Images)</label>
                            <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
                                <input type="file" id="file-upload" multiple accept=".pdf,.png,.jpg,.jpeg" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                                <i data-lucide="upload-cloud" class="mx-auto h-8 w-8 text-slate-400 mb-2"></i>
                                <p class="text-sm text-slate-600">Click to upload or drag and drop</p>
                                <p class="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 5MB</p>
                                <div id="file-list" class="mt-4 space-y-2 text-left hidden"></div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" id="btn-cancel" class="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">Cancel</button>
                            <button type="submit" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-lg shadow-red-500/30">Save Service</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const overlay = document.getElementById('modal-overlay');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('btn-cancel');
        const form = document.getElementById('add-service-form');
        const fileInput = document.getElementById('file-upload');
        const fileList = document.getElementById('file-list');

        const closeModal = () => {
            overlay.remove();
        };

        const handleFiles = () => {
            const files = Array.from(fileInput.files);
            if (files.length > 0) {
                fileList.innerHTML = files.map(f => `
                    <div class="text-xs flex items-center gap-2 text-slate-700 bg-white p-2 border rounded">
                        <i data-lucide="paperclip" class="w-3 h-3"></i> ${f.name}
                    </div>
                `).join('');
                fileList.classList.remove('hidden');
                if (window.lucide) window.lucide.createIcons();
            } else {
                fileList.classList.add('hidden');
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const files = fileInput.files;

            // Process files
            const processedFiles = [];
            for (let i = 0; i < files.length; i++) {
                processedFiles.push({
                    name: files[i].name,
                    type: files[i].name.split('.').pop().toLowerCase(),
                    // In a real app we'd upload to server. Here we store name/metadata.
                    // For small demo, we could store Base64 but localStorage has limits. 
                    // Let's just mock the storage of the file reference.
                    url: URL.createObjectURL(files[i]) // Works for session only
                });
            }

            const newService = {
                id: 'svc-' + Date.now(),
                name: formData.get('name'),
                type: formData.get('type'),
                description: formData.get('description'),
                target: formData.get('target'),
                status: formData.get('status'),
                lastUpdated: new Date().toISOString().split('T')[0],
                expiredDate: formData.get('status') === 'Expired' ? new Date().toISOString().split('T')[0] : null,
                files: processedFiles
            };

            store.addService(newService);
            closeModal();
            if (this.onClose) this.onClose();
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        fileInput.addEventListener('change', handleFiles);
        form.addEventListener('submit', handleSubmit);
    }
}
