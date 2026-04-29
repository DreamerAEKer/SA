
export default class Portal {
    constructor(router) {
        this.router = router;
    }

    async render() {
        return `
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200">
                <style>
                    .portal-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        padding: 2rem;
                        background: radial-gradient(circle at top right, #fff0f0 0%, transparent 40%),
                                    radial-gradient(circle at bottom left, #f0f4ff 0%, transparent 40%);
                    }
                    .brand-title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: var(--thp-red);
                        margin-bottom: 0.5rem;
                        text-align: center;
                    }
                    .brand-subtitle {
                        color: var(--text-secondary);
                        margin-bottom: 3rem;
                        font-size: 1.125rem;
                        text-align: center;
                    }
                    .choice-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                        max-width: 800px;
                        width: 100%;
                    }
                    .choice-card {
                        background: rgba(255,255,255,0.8);
                        backdrop-filter: blur(12px);
                        border-radius: var(--radius-xl);
                        padding: 2.5rem;
                        text-align: center;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        border: 1px solid rgba(255,255,255,0.6);
                        cursor: pointer;
                        box-shadow: var(--shadow-lg);
                        position: relative;
                        overflow: hidden;
                    }
                    .choice-card:hover {
                        transform: translateY(-8px);
                        box-shadow: var(--shadow-premium);
                        border-color: var(--thp-red-light);
                    }
                    .choice-card::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 4px;
                        background: linear-gradient(90deg, var(--thp-red), var(--thp-red-light));
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                    .choice-card:hover::before {
                        opacity: 1;
                    }
                    .icon-circle {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: #FFF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem;
                        box-shadow: var(--shadow-md);
                        color: var(--thp-red);
                    }
                    .card-title {
                        font-size: 1.5rem;
                        margin-bottom: 0.5rem;
                        color: var(--text-primary);
                    }
                    .card-desc {
                        color: var(--text-secondary);
                        font-size: 0.95rem;
                    }
                </style>

                <div class="portal-container animate-fade-in">
                    <h1 class="brand-title">THP Service Knowledge Center</h1>
                    <p class="brand-subtitle">Centralized information hub for Thailand Post services</p>
                    
                    <div class="choice-grid">
                        <!-- Customer Choice -->
                        <div class="choice-card" id="btn-customer">
                            <div class="icon-circle">
                                <i data-lucide="user" width="40" height="40"></i>
                            </div>
                            <h2 class="card-title">Customer</h2>
                            <p class="card-desc">Browse services, check rates, and find shipping information.</p>
                        </div>

                        <!-- Staff Choice -->
                        <div class="choice-card" id="btn-staff">
                            <div class="icon-circle">
                                <i data-lucide="briefcase" width="40" height="40"></i>
                            </div>
                            <h2 class="card-title">Staff</h2>
                            <p class="card-desc">Access internal service details, operation guides, and updates.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterRender() {
        document.getElementById('btn-customer').addEventListener('click', () => {
            this.router.navigateTo('/customer');
        });

        document.getElementById('btn-staff').addEventListener('click', () => {
            this.router.navigateTo('/staff');
        });
    }
}
