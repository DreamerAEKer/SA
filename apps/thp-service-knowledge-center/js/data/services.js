
export const services = [
    // --- Domestic Services ---
    {
        id: 'ems-th',
        name: 'EMS Thailand',
        type: 'Domestic',
        status: 'Active',
        description: 'The fastest domestic delivery service. Delivers within 1-2 business days with real-time tracking via Track & Trace. Maximum weight 20kg. Coverage: Nationwide.',
        target: 'Both',
        lastUpdated: '2026-01-01',
        files: [{ name: 'EMS_Rate_2026.pdf', type: 'pdf', url: '#' }]
    },
    {
        id: 'eco-post',
        name: 'Eco-Post',
        type: 'Domestic',
        status: 'Active',
        description: 'Economy service for small items and e-commerce. Trackable status (Acceptance, Delivery). Max weight 2kg. delivery 3-7 days.',
        target: 'Customer',
        lastUpdated: '2025-06-15'
    },
    {
        id: 'registered-domestic',
        name: 'Registered Mail',
        type: 'Domestic',
        status: 'Active',
        description: 'Secure delivery with signature upon receipt. Limited tracking. Max weight 2kg. Identification required for pickup if delivery fails.',
        target: 'Customer',
        lastUpdated: '2024-12-01'
    },
    {
        id: 'logispost',
        name: 'Logispost',
        type: 'Domestic',
        status: 'Active',
        description: 'Delivery for large, heavy, or bulky items (20kg - 200kg). Includes furniture, motorcycles, and appliances. No door-to-door (Pickup at office) unless "Plus" service is added.',
        target: 'Both',
        lastUpdated: '2025-09-10'
    },

    // --- International Services ---
    {
        id: 'ems-world',
        name: 'EMS World',
        type: 'International',
        status: 'Active',
        description: 'Premium international express delivery. 3-5 business days to major destinations. Full tracking. Merchandise insurance included up to 3,000 THB.',
        target: 'Both',
        lastUpdated: '2026-01-10',
        files: [{ name: 'EMS_World_Zones.pdf', type: 'pdf', url: '#' }]
    },
    {
        id: 'epacket',
        name: 'ePacket',
        type: 'International',
        status: 'Active',
        description: 'Files and small packets up to 2kg. Designed for cross-border e-commerce. End-to-end tracking for select countries. Cheaper than EMS.',
        target: 'Customer',
        lastUpdated: '2025-11-20'
    },
    {
        id: 'courier-post',
        name: 'Courier Post',
        type: 'International',
        status: 'Active',
        description: 'The fastest international service (2-4 days). Delivered by global partners (DHL/UPS). Premium customs handling. Door-to-door.',
        target: 'Staff',
        lastUpdated: '2025-08-05'
    },

    // --- Promotions / Expired ---
    {
        id: 'promo-ny-2025',
        name: 'New Year Discount 2025',
        type: 'Domestic',
        status: 'Expired',
        description: '25% off EMS domestic shipping for packages under 1kg. Valid from Dec 15, 2024 to Jan 15, 2025.',
        target: 'Customer',
        lastUpdated: '2024-12-10',
        expiredDate: '2025-01-15'
    },
    {
        id: 'promo-11-11',
        name: '11.11 Double Day Sale',
        type: 'International',
        status: 'Expired',
        description: 'Flat rate for ePacket to USA and Japan. Promotional period ended.',
        target: 'Customer',
        lastUpdated: '2024-11-01',
        expiredDate: '2024-11-12'
    },
    {
        id: 'flood-relief-2024',
        name: 'Flood Relief Aid Shipping',
        type: 'Domestic',
        status: 'Expired',
        description: 'Free shipping for donation boxes to flood-affected areas in Northern Thailand.',
        target: 'Staff',
        lastUpdated: '2024-09-01',
        expiredDate: '2024-10-31'
    }
];

export const getServices = () => {
    return services;
};
