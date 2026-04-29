// Check for URL parameters on load
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Redirect to generator if ?user is present but empty
    if (urlParams.has('user') && !urlParams.get('user')) {
        window.location.href = 'generator.html';
        return;
    }

    let memberId = urlParams.get('id') || urlParams.get('user');
    
    if (memberId) {
        // Strip THP- if present in URL
        memberId = memberId.replace('THP-', '');
        const refCodeInput = document.getElementById('ref-code');
        if (refCodeInput) {
            refCodeInput.value = memberId;
        }

        // Update greeting if referrer is known
        const heroTitle = document.querySelector('.hero h1');
        const referrerDisplay = document.getElementById('referrer-name');
        const referrerInfo = document.getElementById('referrer-info');
        
        if (referrerDisplay && referrerInfo) {
            referrerDisplay.innerText = memberId;
            referrerInfo.style.display = 'block';
        }

        if (heroTitle) {
            heroTitle.innerText = "ร่วมเป็นครอบครัวเดียวกับเรา";
        }
    }
};

function copyToClipboard(id, btnId) {
    const input = document.getElementById(id);
    const btn = document.getElementById(btnId);

    // Select the text
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    // Copy to clipboard
    try {
        navigator.clipboard.writeText(input.value).then(() => {
            handleSuccess(btn);
        }).catch(err => {
            // Fallback for older browsers
            document.execCommand('copy');
            handleSuccess(btn);
        });
    } catch (err) {
        document.execCommand('copy');
        handleSuccess(btn);
    }
}

function handleSuccess(btn) {
    const originalText = btn.innerText;
    btn.innerText = 'คัดลอกแล้ว!';
    btn.classList.add('copied');

    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('copied');
    }, 2000);
}
