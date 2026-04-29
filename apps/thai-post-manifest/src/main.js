import { calculateCheckDigit, formatTrackingNumber } from './tracking.js';

// --- PRICING DATA ---
const rates = {
  EMS: { tiers: [[10, 32], [20, 32], [100, 37], [250, 42], [500, 52], [1000, 67], [2000, 97]], ar: 12 },
  REG: { tiers: [[10, 18], [20, 19], [100, 24], [250, 30], [500, 36], [1000, 53], [2000, 75]], ar: 3 },
  ECO: { tiers: [[10, 20], [20, 20], [100, 22], [250, 26], [500, 30], [1000, 40], [2000, 60]], ar: 3 },
  PARCEL: { base: 25, baseWeight: 1000, perKg: 20, ar: 3 }
};

const REMOTE_ALWAYS_ZIPCODES = new Set([
  '20150', '21160', '23000', '23120', '23170', '50250', '50310', '50350', '55130', '55220', '57170', '57180', '57260', '57310', '57340', '58000', '58110', '58120', '58130', '58140', '58150', '63150', '63170',
  '71180', '71240', '81210', '82000', '83000', '83100', '83110', '83120', '83130', '83150', '84140', '84310', '85000', '91000',
  '91110', '92110', '92120', '94000', '94110', '94120', '94130', '94140', '94150', '94160', '94170', '94180', '94190', '94220', '94230', '95000', '95110', '95120', '95130', '95140', '95150', '95160', '95170',
  '96000', '96110', '96120', '96130', '96140', '96150', '96160', '96170', '96180', '96190', '96210', '96220'
]);

const REMOTE_ISLAND_ZIPCODES = new Set([
  '20120', '81130', '81150', '82160', '84220', '84280', '84320', '84330', '84360'
]);

// --- APP STATE ---
let shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
let history = [JSON.parse(JSON.stringify(shipments))];
let historyIndex = 0;
let currentServiceTab = 'EMS';

// --- DOM ELEMENTS ---
const prefixInput = document.getElementById('prefix');
const digitsInput = document.getElementById('digits');
const digitsEndInput = document.getElementById('digits-end');
const batchCountInput = document.getElementById('batch-count');
const bulkToggle = document.getElementById('bulk-mode-toggle');
const batchEndGroup = document.getElementById('batch-end-group');

const recipientInput = document.getElementById('recipient');
const destInput = document.getElementById('destination');
const weightInput = document.getElementById('weight');
const feeInput = document.getElementById('fee');
const feeUnitLabel = document.getElementById('fee-unit-label');
const previewEl = document.getElementById('tracking-preview');
const shipmentList = document.getElementById('shipment-list');
const printList = document.getElementById('print-list');

const optAR = document.getElementById('opt-ar');
const optInsurance = document.getElementById('opt-insurance');
const insuranceVal = document.getElementById('insurance-val');
const optRemote = document.getElementById('opt-remote');

const addBtn = document.getElementById('add-btn');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const printBtn = document.getElementById('print-btn');
const nextNumBtn = document.getElementById('next-num-btn');
const serviceTitle = document.getElementById('service-title');

// --- HELPERS ---
function getServiceType(p) {
  p = p.toUpperCase();
  if (p.startsWith('E')) return 'EMS';
  if (p.startsWith('R')) return 'REG';
  if (p.startsWith('P')) return 'PARCEL';
  if (p.startsWith('O')) return 'ECO';
  return 'EMS';
}

function calculateBaseFee(type, weight, options = {}) {
    let baseFee = 0;
    if (type === 'PARCEL') {
        baseFee = rates.PARCEL.base;
        if (weight > rates.PARCEL.baseWeight) {
            baseFee += Math.ceil((weight - rates.PARCEL.baseWeight) / 1000) * rates.PARCEL.perKg;
        }
    } else {
        const serviceTable = rates[type];
        if (serviceTable && serviceTable.tiers) {
            for (let [tier, price] of serviceTable.tiers) {
                if (weight <= tier) {
                    baseFee = price;
                    break;
                }
                baseFee = price;
            }
        }
    }

    if (options.ar && rates[type]) baseFee += rates[type].ar;
    
    // Insurance
    if (options.insurance && type === 'EMS') {
        const v = options.insuranceVal || 0;
        if (v <= 20000) baseFee += 15 + Math.ceil(v / 500) * 5;
        else baseFee += 215 + Math.ceil((v - 20000) / 500) * 10;
    }
    return baseFee;
}

function isRemoteArea(zip, isIsland = false) {
    if (REMOTE_ALWAYS_ZIPCODES.has(zip)) return true;
    if (REMOTE_ISLAND_ZIPCODES.has(zip) && isIsland) return true;
    return false;
}

function updateHistory() {
  if (historyIndex < history.length - 1) history = history.slice(0, historyIndex + 1);
  history.push(JSON.parse(JSON.stringify(shipments)));
  historyIndex++;
  if (history.length > 50) { history.shift(); historyIndex--; }
  localStorage.setItem('shipments', JSON.stringify(shipments));
  updateHistoryButtons();
}

function updateHistoryButtons() {
  undoBtn.disabled = historyIndex === 0;
  redoBtn.disabled = historyIndex === history.length - 1;
  undoBtn.style.opacity = undoBtn.disabled ? '0.5' : '1';
  redoBtn.style.opacity = redoBtn.disabled ? '0.5' : '1';
}

function updateSummary() {
  const filtered = shipments.filter(s => s.serviceType === currentServiceTab);
  
  const totalItems = filtered.length;
  const totalWeight = filtered.reduce((s, x) => s + parseFloat(x.weight || 0), 0);
  const totalFee = filtered.reduce((s, x) => s + parseFloat(x.fee || 0), 0);
  
  document.getElementById('total-items').textContent = totalItems;
  document.getElementById('total-weight').textContent = totalWeight.toLocaleString();
  document.getElementById('total-fee').textContent = totalFee.toLocaleString();
  
  document.getElementById('print-total-weight').textContent = totalWeight.toLocaleString();
  document.getElementById('print-total-fee').textContent = totalFee.toLocaleString();

  // Update Tab Counts
  ['EMS', 'REG', 'ECO', 'PARCEL'].forEach(svc => {
      const count = shipments.filter(s => s.serviceType === svc).length;
      document.getElementById(`count-${svc.toLowerCase()}`).textContent = count;
  });
}

function renderShipments() {
  shipmentList.innerHTML = '';
  printList.innerHTML = '';

  const filtered = shipments.map((s, originalIdx) => ({ ...s, originalIdx }))
                           .filter(s => s.serviceType === currentServiceTab);

  filtered.forEach((s, displayIdx) => {
    const i = s.originalIdx;
    const zipMatch = s.destination.match(/\d{5}/);
    const zip = zipMatch ? zipMatch[0] : null;
    const isAlwaysRemote = zip && REMOTE_ALWAYS_ZIPCODES.has(zip);
    const isIslandPotential = zip && REMOTE_ISLAND_ZIPCODES.has(zip);
    const isActuallyRemote = isAlwaysRemote || (isIslandPotential && s.isIsland);

    const baseFee = calculateBaseFee(s.serviceType, s.weight, s.options || {});
    const isPriceNormalWithSurcharge = parseFloat(s.fee) === (baseFee + 20);
    const priceClass = (!isActuallyRemote && isPriceNormalWithSurcharge) ? 'price-warn' : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${displayIdx + 1}</td>
      <td class="editable-cell" contenteditable="true" data-field="recipient" data-index="${i}" data-placeholder="ระบุนามผู้รับ...">${s.recipient || ''}</td>
      <td class="editable-cell" data-index="${i}">
        <div contenteditable="true" data-field="destination" data-index="${i}" data-placeholder="ระบุปลายทาง..." style="outline:none; width: 100%;">
            ${highlightPostcode(s.destination, isActuallyRemote)}
        </div>
        ${isIslandPotential ? `<label class="island-check"><input type="checkbox" ${s.isIsland ? 'checked' : ''} onchange="toggleIsland(${i}, this.checked)"> เป็นเกาะ</label>` : ''}
      </td>
      <td class="tracking-cell">
        <div style="font-size: 0.85rem; color: #6b7280; margin-bottom: 2px;">${s.serviceType}</div>
        <div style="font-weight: 600;">${s.trackingFormatted}</div>
      </td>
      <td>${s.weight} กรัม</td>
      <td class="editable-cell ${priceClass}" contenteditable="true" data-field="fee" data-index="${i}" title="${priceClass ? 'พื้นที่ปกติ แต่มีการบวกเพิ่ม 20 บาท?' : ''}">${s.fee} ฿</td>
      <td><button class="btn-icon delete-btn" data-index="${i}">ลบ</button></td>
    `;
    shipmentList.appendChild(tr);

    const ptr = document.createElement('tr');
    ptr.innerHTML = `
      <td>${displayIdx + 1}</td>
      <td>${s.recipient || ''}</td>
      <td>${s.destination || ''}${s.isIsland ? ' (เกาะ)' : ''}</td>
      <td style="font-family: monospace;">${s.trackingFormatted}</td>
      <td>${s.weight}</td>
      <td>${s.fee}</td>
      <td></td>
    `;
    printList.appendChild(ptr);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.currentTarget.dataset.index;
      shipments.splice(idx, 1);
      updateHistory();
      renderShipments();
      updateSummary();
    };
  });

  document.querySelectorAll('.editable-cell[contenteditable="true"]').forEach(cell => {
    cell.oninput = (e) => {
        const field = e.target.dataset.field;
        const idx = e.target.dataset.index;
        const val = e.target.innerText.replace(' ฿', '').trim();
        shipments[idx][field] = val;
        localStorage.setItem('shipments', JSON.stringify(shipments));
    };
    
    cell.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    };

    cell.onblur = (e) => {
        const field = e.target.dataset.field;
        const idx = e.target.dataset.index;
        const s = shipments[idx];
        
        let needsRender = false;
        if (field === 'fee') {
            const oldFee = s.fee;
            applySmartPricing(idx);
            if (s.fee !== oldFee) needsRender = true;
        } else if (field === 'destination') {
            applySmartPricing(idx);
            needsRender = true;
        }
        
        updateSummary();
        updateHistory();
        if (needsRender) renderShipments();
    }
  });
}

function highlightPostcode(text, isRemote) {
    if (!text) return '';
    return text.replace(/(\d{5})/, (match) => {
        return isRemote ? `<span class="remote-highlight">${match}</span>` : match;
    });
}

window.toggleIsland = (i, checked) => {
    shipments[i].isIsland = checked;
    applySmartPricing(i);
    renderShipments();
    updateSummary();
    updateHistory();
};

function applySmartPricing(i) {
    const s = shipments[i];
    const zipMatch = s.destination.match(/\d{5}/);
    const zip = zipMatch ? zipMatch[0] : null;
    const isActuallyRemote = zip && isRemoteArea(zip, s.isIsland);
    const base = calculateBaseFee(s.serviceType, s.weight, s.options || {});
    const currentFee = parseFloat(s.fee);

    if (isActuallyRemote && currentFee === base) {
        s.fee = base + 20;
    }
}

function updatePreview() {
  const p = prefixInput.value.trim().toUpperCase() || 'XX';
  const d = digitsInput.value.trim();
  const type = getServiceType(p);
  const w = parseFloat(weightInput.value) || 0;
  
  document.getElementById('opt-insurance-row').style.display = (type === 'EMS') ? 'flex' : 'none';
  document.getElementById('insurance-detail').style.display = (optInsurance.checked && type === 'EMS') ? 'flex' : 'none';

  if (d.length === 8 && !isNaN(d)) {
    const cd = calculateCheckDigit(d);
    previewEl.textContent = formatTrackingNumber(p, d, cd);
    previewEl.style.color = 'var(--primary-color)';
  } else {
    previewEl.textContent = `${p.padEnd(2, 'X')} ${d.padEnd(8, '_').substring(0, 4)} ${d.padEnd(8, '_').substring(4, 8)} ? TH`;
    previewEl.style.color = '#ccc';
  }

  // Remote Detection & Badge
  const destinationZip = destInput.value.match(/\d{5}/);
  const zip = destinationZip ? destinationZip[0] : null;
  const badge = document.getElementById('remote-status-badge');
  
  const isAlwaysRemote = zip && REMOTE_ALWAYS_ZIPCODES.has(zip);
  const isIslandPotential = zip && REMOTE_ISLAND_ZIPCODES.has(zip);
  
  if (isAlwaysRemote || isIslandPotential) {
      optRemote.checked = true;
      badge.classList.remove('hidden');
      badge.querySelector('span:last-child').textContent = isAlwaysRemote ? 'บวกพื้นที่ห่างไกล (+20 ฿)' : 'พบรหัสพื้นที่เกาะ (+20 ฿)';
  } else {
      optRemote.checked = false;
      badge.classList.add('hidden');
  }

  const base = calculateBaseFee(type, w, { 
    ar: optAR.checked, 
    insurance: optInsurance.checked, 
    insuranceVal: parseFloat(insuranceVal.value) 
  });
  
  let total = base;
  if (optRemote.checked) total += 20;
  
  feeInput.value = total;
}

function syncBatchInputs(source) {
    const startNum = parseInt(digitsInput.value);
    if (!startNum) return;

    if (source === 'end') {
        const endNum = parseInt(digitsEndInput.value);
        if (endNum >= startNum) {
            batchCountInput.value = endNum - startNum + 1;
        } else {
            batchCountInput.value = '';
        }
    } else if (source === 'count') {
        const count = parseInt(batchCountInput.value);
        if (count > 0) {
            digitsEndInput.value = (startNum + count - 1).toString().padStart(8, '0');
        } else {
            digitsEndInput.value = '';
        }
    }
}

// --- EVENT HANDLERS ---
bulkToggle.onchange = (e) => {
    const isBulk = e.target.checked;
    batchEndGroup.style.display = isBulk ? 'block' : 'none';
    feeUnitLabel.style.display = isBulk ? 'inline' : 'none';
    document.querySelectorAll('.single-only').forEach(el => el.style.display = isBulk ? 'none' : 'block');
    if (isBulk) syncBatchInputs('count');
};

prefixInput.oninput = (e) => {
  const thaiMap = {
    'พ': 'R', '่': 'J', 'ำ': 'E', 'ร': 'I', 'น': 'O', 'ย': 'P',
    'ะ': 'T', 'ั': 'Y', 'ี': 'U', 'เ': 'G', 'ห': 'H', 'ก': 'D',
    'ด': 'F', 'ส': 'L', 'ว': 'K', 'ง': 'O', 'ผ': 'Z', 'ป': 'X'
  };
  let m = '';
  for (let c of e.target.value) m += thaiMap[c] || c;
  e.target.value = m.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 2);
  updatePreview();
};

digitsInput.oninput = (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
  updatePreview();
  if (bulkToggle.checked) syncBatchInputs('count');
};

digitsEndInput.oninput = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
    syncBatchInputs('end');
};

batchCountInput.oninput = (e) => {
    syncBatchInputs('count');
};

weightInput.oninput = updatePreview;
optAR.onchange = updatePreview;
optInsurance.onchange = updatePreview;
insuranceVal.oninput = updatePreview;

destInput.oninput = (e) => {
  updatePreview();
};

addBtn.onclick = (e) => {
  e.preventDefault();
  const p = prefixInput.value.trim().toUpperCase();
  const startD = digitsInput.value.trim();
  const type = getServiceType(p);
  const w = parseFloat(weightInput.value) || 0;
  
  if (bulkToggle.checked) {
      // BATCH ADD
      const endD = digitsEndInput.value.trim();
      if (p.length !== 2 || startD.length !== 8 || endD.length !== 8) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      
      const startNum = parseInt(startD);
      const endNum = parseInt(endD);
      if (endNum < startNum) return alert('เลขสิ้นสุดต้องมากกว่าเลขเริ่มต้น');
      
      const count = endNum - startNum + 1;
      if (count > 100 && !confirm(`คุณกำลังจะเพิ่ม ${count} รายการ ต้องการดำเนินการต่อหรือไม่?`)) return;

      for (let i = startNum; i <= endNum; i++) {
          const d = i.toString().padStart(8, '0');
          const cd = calculateCheckDigit(d);
          shipments.push({
              recipient: '',
              destination: '',
              serviceType: type,
              weight: w,
              options: { ar: optAR.checked, insurance: optInsurance.checked, insuranceVal: parseFloat(insuranceVal.value) },
              isIsland: false,
              trackingFormatted: formatTrackingNumber(p, d, cd),
              fee: feeInput.value || 0
          });
      }
      digitsInput.value = (endNum + 1).toString().padStart(8, '0');
  } else {
      // SINGLE ADD
      if (p.length !== 2 || startD.length !== 8) return alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      const cd = calculateCheckDigit(startD);
      
      shipments.push({
          recipient: recipientInput.value || '',
          destination: destInput.value || '',
          serviceType: type,
          weight: w,
          options: { ar: optAR.checked, insurance: optInsurance.checked, insuranceVal: parseFloat(insuranceVal.value) },
          isIsland: optRemote.checked && REMOTE_ISLAND_ZIPCODES.has(destInput.value.match(/\d{5}/)?.[0]),
          trackingFormatted: formatTrackingNumber(p, startD, cd),
          fee: feeInput.value || 0
      });
      digitsInput.value = (parseInt(startD) + 1).toString().padStart(8, '0');
      recipientInput.value = '';
      destInput.value = '';
  }

  // Switch to the tab of the service just added
  if (currentServiceTab !== type) {
      currentServiceTab = type;
      document.querySelectorAll('.service-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.service === type);
      });
      serviceTitle.textContent = `จัดการรายการ: ${type}`;
  }

  updateHistory();
  renderShipments();
  updateSummary();
  updatePreview();
  if (bulkToggle.checked) syncBatchInputs('count');
};

undoBtn.onclick = () => {
  if (historyIndex > 0) {
    historyIndex--;
    shipments = JSON.parse(JSON.stringify(history[historyIndex]));
    localStorage.setItem('shipments', JSON.stringify(shipments));
    renderShipments();
    updateSummary();
    updateHistoryButtons();
  }
};

redoBtn.onclick = () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    shipments = JSON.parse(JSON.stringify(history[historyIndex]));
    localStorage.setItem('shipments', JSON.stringify(shipments));
    renderShipments();
    updateSummary();
    updateHistoryButtons();
  }
};

printBtn.onclick = () => {
  const filtered = shipments.filter(s => s.serviceType === currentServiceTab);
  if (filtered.length) window.print();
  else alert(`ไม่มีรายการในหมวด ${currentServiceTab} สำหรับพิมพ์`);
};

nextNumBtn.onclick = () => {
  const v = digitsInput.value;
  if (v.length === 8) {
    digitsInput.value = (parseInt(v) + 1).toString().padStart(8, '0');
    updatePreview();
    if (bulkToggle.checked) syncBatchInputs('count');
  }
};

// Service Tabs Switching
document.querySelectorAll('.service-tab').forEach(tab => {
    tab.onclick = () => {
        currentServiceTab = tab.dataset.service;
        document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        serviceTitle.textContent = `จัดการรายการ: ${currentServiceTab}`;
        renderShipments();
        updateSummary();
    };
});

// Initial setup
updatePreview();
renderShipments();
updateSummary();
updateHistoryButtons();
