// ============================================
// VALENZUELA FLOODWATCH SYSTEM
// WITH PRIMARY KEY & FOREIGN KEY IMPLEMENTATION
// ============================================

// ==================== DATA MODEL WITH PRIMARY KEY ====================
const DEFAULT_BARANGAYS = [
    { id: 1, name: "Malanday", risk: "HIGH", depth: "0.5 - 1.5 meters", evacCenter: "Malanday National High School", lat: 14.7000, lng: 120.9830 },
    { id: 2, name: "Karuhatan", risk: "MODERATE", depth: "0.2 - 0.8 meters", evacCenter: "Karuhatan Elementary School", lat: 14.6760, lng: 120.9820 },
    { id: 3, name: "Gen T De Leon", risk: "LOW", depth: "0.1 - 0.3 meters", evacCenter: "Gen T De Leon Gymnasium", lat: 14.7150, lng: 120.9980 },
    { id: 4, name: "Marulas", risk: "HIGH", depth: "0.6 - 1.8 meters", evacCenter: "Marulas Covered Court", lat: 14.6550, lng: 120.9720 },
    { id: 5, name: "Ugong", risk: "MODERATE", depth: "0.3 - 0.9 meters", evacCenter: "Ugong Barangay Hall", lat: 14.6830, lng: 120.9580 },
    { id: 6, name: "Canumay", risk: "LOW", depth: "0.1 - 0.4 meters", evacCenter: "Canumay Elementary School", lat: 14.7270, lng: 120.9900 },
    { id: 7, name: "Polo", risk: "HIGH", depth: "0.7 - 1.4 meters", evacCenter: "Polo National High School", lat: 14.6930, lng: 120.9460 }
];

// Global variables
let barangaysData = [];
let mapInstance;
let markerGroup = L.layerGroup();
let adminAuthenticated = false;
let adminPassword = "admin123";

// ==================== FOREIGN KEY RELATIONSHIP ARRAYS ====================
let floodHistory = [];      // FOREIGN KEY: barangayId links to barangays.id
let adminLogs = [];         // FOREIGN KEY: barangayId links to barangays.id

// ==================== PRIMARY KEY & FOREIGN KEY FUNCTIONS ====================

// Generate new PRIMARY KEY (ID)
function generateNewId() {
    const maxId = barangaysData.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
}

// Load relationships from localStorage
function loadRelationships() {
    const storedHistory = localStorage.getItem("floodwatch_history");
    if (storedHistory) floodHistory = JSON.parse(storedHistory);
    
    const storedLogs = localStorage.getItem("floodwatch_admin_logs");
    if (storedLogs) adminLogs = JSON.parse(storedLogs);
}

// Save relationships to localStorage
function saveRelationships() {
    localStorage.setItem("floodwatch_history", JSON.stringify(floodHistory));
    localStorage.setItem("floodwatch_admin_logs", JSON.stringify(adminLogs));
}

// RECORD FUNCTION with FOREIGN KEY
function recordRiskChange(barangayId, oldRisk, newRisk) {
    const barangay = barangaysData.find(b => b.id === barangayId);
    const historyRecord = {
        recordId: floodHistory.length + 1,     // PRIMARY KEY ng history
        barangayId: barangayId,                 // ← FOREIGN KEY (link sa barangay)
        barangayName: barangay ? barangay.name : "Unknown",
        oldRiskLevel: oldRisk,
        newRiskLevel: newRisk,
        changedBy: adminAuthenticated ? "Admin" : "System",
        timestamp: new Date().toISOString(),
        dateReadable: new Date().toLocaleString('en-PH', { hour12: true })
    };
    
    floodHistory.unshift(historyRecord); // Add to beginning (newest first)
    saveRelationships();
    
    // Show notification
    showNotification(`Risk changed: ${oldRisk} → ${newRisk}`, 'info');
    
    // Update history table if modal is open
    if (document.getElementById("historyTableBody") && document.getElementById("historyTabModal").classList.contains('active')) {
        renderHistoryTable();
    }
}

// Log admin action with FOREIGN KEY
function logAdminAction(action, barangayId, details) {
    const logRecord = {
        logId: adminLogs.length + 1,
        adminName: "Admin User",
        actionType: action,
        barangayId: barangayId,
        barangayName: barangayId ? (barangaysData.find(b => b.id === barangayId)?.name || "N/A") : "N/A",
        details: details,
        timestamp: new Date().toISOString(),
        dateReadable: new Date().toLocaleString('en-PH', { hour12: true })
    };
    
    adminLogs.push(logRecord);
    saveRelationships();
}

// Get history ng specific barangay (FILTER BY FOREIGN KEY)
function getBarangayHistory(barangayId) {
    return floodHistory.filter(record => record.barangayId === barangayId);
}

// Show history modal for specific barangay
function showBarangayHistoryModal(barangayId) {
    const barangay = barangaysData.find(b => b.id === barangayId);
    const history = getBarangayHistory(barangayId);
    
    const modalBody = document.getElementById("barangayHistoryBody");
    if (!modalBody) return;
    
    if (history.length === 0) {
        modalBody.innerHTML = `<div class="alert alert-info">No risk change history found for ${barangay.name}.</div>`;
    } else {
        let html = `<h5>History of ${barangay.name}</h5>`;
        html += `<div class="list-group">`;
        history.forEach(record => {
            html += `
                <div class="list-group-item">
                    <small class="text-muted">${record.dateReadable}</small><br>
                    <strong>Changed by:</strong> ${record.changedBy}<br>
                    <strong>Risk change:</strong> 
                    <span class="badge bg-secondary">${record.oldRiskLevel}</span> 
                    → 
                    <span class="badge bg-${record.newRiskLevel === 'HIGH' ? 'danger' : (record.newRiskLevel === 'MODERATE' ? 'warning' : 'success')}">${record.newRiskLevel}</span>
                </div>
            `;
        });
        html += `</div>`;
        modalBody.innerHTML = html;
    }
    
    const historyModal = new bootstrap.Modal(document.getElementById("barangayHistoryModal"));
    historyModal.show();
}

// Render history table in admin panel
function renderHistoryTable() {
    const tbody = document.getElementById("historyTableBody");
    if (!tbody) return;
    
    if (floodHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No risk changes recorded yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = "";
    floodHistory.forEach(record => {
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = `<code>${record.recordId}</code>`;
        row.insertCell(1).innerHTML = `<span class="badge bg-secondary">FK: ${record.barangayId}</span>`;
        row.insertCell(2).innerHTML = `<strong>${record.barangayName}</strong>`;
        row.insertCell(3).innerHTML = `<span class="badge bg-secondary">${record.oldRiskLevel}</span>`;
        row.insertCell(4).innerHTML = `<span class="badge bg-${record.newRiskLevel === 'HIGH' ? 'danger' : (record.newRiskLevel === 'MODERATE' ? 'warning' : 'success')}">${record.newRiskLevel}</span>`;
        row.insertCell(5).innerHTML = record.changedBy;
        row.insertCell(6).innerHTML = `<small>${record.dateReadable}</small>`;
        
        // Click to filter by barangay
        row.style.cursor = "pointer";
        row.onclick = () => showBarangayHistoryModal(record.barangayId);
    });
}

// Clear all history
function clearAllHistory() {
    if (confirm("⚠️ WARNING: This will delete ALL risk change history. Are you sure?")) {
        floodHistory = [];
        saveRelationships();
        renderHistoryTable();
        showNotification("History cleared successfully", "success");
    }
}

// Ensure existing data has IDs (PRIMARY KEY)
function ensureIdsExist() {
    if (barangaysData.length > 0 && !barangaysData[0].id) {
        barangaysData = barangaysData.map((item, index) => ({
            id: index + 1,
            ...item
        }));
        saveData();
    }
}

// ==================== ORIGINAL FUNCTIONS (MODIFIED) ====================

// Load data from localStorage
function loadData() {
    const stored = localStorage.getItem("floodwatch_brgy_data");
    if (stored) {
        barangaysData = JSON.parse(stored);
        ensureIdsExist();
    } else {
        barangaysData = JSON.parse(JSON.stringify(DEFAULT_BARANGAYS));
    }
    
    loadRelationships();
    updateDashboardStats();
    updateDatalist();
    refreshMapMarkers();
    if (document.getElementById("adminTableBody")) renderAdminTable();
    if (document.getElementById("historyTableBody")) renderHistoryTable();
}

function saveData() {
    localStorage.setItem("floodwatch_brgy_data", JSON.stringify(barangaysData));
    updateDashboardStats();
    updateDatalist();
    refreshMapMarkers();
    if (adminAuthenticated) renderAdminTable();
    const resultDiv = document.getElementById("resultCard");
    if (resultDiv) resultDiv.style.display = "none";
    showNotification("Data saved successfully", "success");
}

function updateDashboardStats() {
    let high = barangaysData.filter(b => b.risk === "HIGH").length;
    let moderate = barangaysData.filter(b => b.risk === "MODERATE").length;
    let low = barangaysData.filter(b => b.risk === "LOW").length;
    document.getElementById("highRiskCount").innerText = high;
    document.getElementById("moderateRiskCount").innerText = moderate;
    document.getElementById("lowRiskCount").innerText = low;
}

function updateDatalist() {
    const datalist = document.getElementById("barangaySuggestions");
    if (datalist) {
        datalist.innerHTML = "";
        barangaysData.forEach(b => {
            let opt = document.createElement("option");
            opt.value = b.name;
            datalist.appendChild(opt);
        });
    }
}

function getBarangayByName(name) {
    return barangaysData.find(b => b.name.toLowerCase() === name.toLowerCase());
}

function getBarangayById(id) {
    return barangaysData.find(b => b.id === id);
}

function searchBarangay() {
    const inputVal = document.getElementById("barangaySearchInput").value.trim();
    const found = getBarangayByName(inputVal);
    const resultCard = document.getElementById("resultCard");
    const notFoundDiv = document.getElementById("searchNotFound");
    const viewHistoryBtn = document.getElementById("viewHistoryBtn");
    
    if (found) {
        notFoundDiv.classList.add("d-none");
        document.getElementById("resultBarangayName").innerHTML = `${found.name} <small class="text-muted">(ID: ${found.id})</small>`;
        const riskSpan = document.getElementById("resultRisk");
        riskSpan.innerHTML = `<span class="risk-badge risk-${found.risk.toLowerCase()}">${found.risk}</span>`;
        document.getElementById("resultDepth").innerText = found.depth;
        document.getElementById("resultEvac").innerText = found.evacCenter;
        document.getElementById("resultCoords").innerText = `${found.lat.toFixed(4)}, ${found.lng.toFixed(4)}`;
        resultCard.style.display = "block";
        
        // Show history button
        if (viewHistoryBtn) {
            viewHistoryBtn.style.display = "inline-block";
            viewHistoryBtn.onclick = () => showBarangayHistoryModal(found.id);
        }
        
        if (mapInstance) {
            mapInstance.setView([found.lat, found.lng], 14);
            refreshMapMarkers(true, found.name);
        }
        resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
        notFoundDiv.classList.remove("d-none");
        resultCard.style.display = "none";
        if (viewHistoryBtn) viewHistoryBtn.style.display = "none";
    }
}

function refreshMapMarkers(openPopupFor = false, brgyName = null) {
    if (!mapInstance) return;
    markerGroup.clearLayers();
    barangaysData.forEach(b => {
        let color = b.risk === "HIGH" ? "#dc3545" : (b.risk === "MODERATE" ? "#fd7e14" : "#198754");
        const customIcon = L.divIcon({
            html: `<div style="background-color:${color}; width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 0 4px gray;"></div>`,
            iconSize: [14, 14],
            className: ''
        });
        const marker = L.marker([b.lat, b.lng], { icon: customIcon }).addTo(markerGroup);
        marker.bindPopup(`
            <b>${b.name}</b><br>
            🆔 ID: ${b.id}<br>
            🌊 Risk: ${b.risk}<br>
            📏 Depth: ${b.depth}<br>
            🏥 Evacuation: ${b.evacCenter}
        `);
        if (openPopupFor && brgyName && b.name === brgyName) marker.openPopup();
    });
    markerGroup.addTo(mapInstance);
}

function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    barangaysData.forEach((item, idx) => {
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = `<span class="fw-medium">${item.name}<br><small class="text-muted">ID: ${item.id}</small></span>`;
        
        const riskSelect = document.createElement("select");
        riskSelect.className = "form-select form-select-sm";
        riskSelect.innerHTML = `<option ${item.risk === "HIGH" ? "selected" : ""}>HIGH</option>
                                <option ${item.risk === "MODERATE" ? "selected" : ""}>MODERATE</option>
                                <option ${item.risk === "LOW" ? "selected" : ""}>LOW</option>`;
        
        riskSelect.addEventListener("change", (e) => {
            const oldRisk = barangaysData[idx].risk;
            const newRisk = e.target.value;
            
