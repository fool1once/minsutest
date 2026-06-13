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

// Show notification
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    const bgColor = type === 'success' ? '#28a745' : (type === 'error' ? '#dc3545' : '#17a2b8');
    toast.innerHTML = `
        <div style="background: ${bgColor}; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
            <i class="bi bi-${type === 'success' ? 'check-circle' : (type === 'error' ? 'x-circle' : 'info-circle')}"></i>
            <span style="margin-left: 10px;">${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// RECORD FUNCTION with FOREIGN KEY
function recordRiskChange(barangayId, oldRisk, newRisk) {
    const barangay = barangaysData.find(b => b.id === barangayId);
    const historyRecord = {
        recordId: floodHistory.length + 1,
        barangayId: barangayId,
        barangayName: barangay ? barangay.name : "Unknown",
        oldRiskLevel: oldRisk,
        newRiskLevel: newRisk,
        changedBy: adminAuthenticated ? "Admin" : "System",
        timestamp: new Date().toISOString(),
        dateReadable: new Date().toLocaleString('en-PH', { hour12: true })
    };
    
    floodHistory.unshift(historyRecord);
    saveRelationships();
    
    showNotification(`Risk changed: ${oldRisk} → ${newRisk}`, 'info');
    
    if (document.getElementById("historyTableBody") && document.getElementById("historyTabModal")?.classList?.contains('active')) {
        renderHistoryTable();
    }
}

// Log admin action
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

// Get history ng specific barangay
function getBarangayHistory(barangayId) {
    return floodHistory.filter(record => record.barangayId === barangayId);
}

// Show history modal
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

// Render history table
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

// Ensure existing data has IDs
function ensureIdsExist() {
    if (barangaysData.length > 0 && !barangaysData[0].id) {
        barangaysData = barangaysData.map((item, index) => ({
            id: index + 1,
            ...item
        }));
        saveData();
    }
}

// ==================== ORIGINAL FUNCTIONS ====================

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

// ==================== MAP FUNCTION (WORKING) ====================
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
        
        if (openPopupFor && brgyName && b.name === brgyName) {
            marker.openPopup();
        }
    });
    
    markerGroup.addTo(mapInstance);
}

function initMap() {
    mapInstance = L.map('map').setView([14.7000, 120.9830], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
        maxZoom: 18
    }).addTo(mapInstance);
    refreshMapMarkers();
}

// ==================== ADMIN FUNCTIONS ====================
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
            
            // Record with FOREIGN KEY
            recordRiskChange(item.id, oldRisk, newRisk);
            logAdminAction("UPDATE_RISK", item.id, `Changed risk from ${oldRisk} to ${newRisk}`);
            
            barangaysData[idx].risk = newRisk;
            saveData();
        });
        row.insertCell(1).appendChild(riskSelect);
        
        const depthInput = document.createElement("input");
        depthInput.type = "text";
        depthInput.className = "form-control form-control-sm";
        depthInput.value = item.depth;
        depthInput.addEventListener("change", (e) => {
            barangaysData[idx].depth = e.target.value;
            saveData();
        });
        row.insertCell(2).appendChild(depthInput);
        
        const evacInput = document.createElement("input");
        evacInput.type = "text";
        evacInput.className = "form-control form-control-sm";
        evacInput.value = item.evacCenter;
        evacInput.addEventListener("change", (e) => {
            barangaysData[idx].evacCenter = e.target.value;
            saveData();
        });
        row.insertCell(3).appendChild(evacInput);
        
        const coordDiv = document.createElement("div");
        coordDiv.className = "d-flex gap-1";
        const latInp = document.createElement("input");
        latInp.type = "number";
        latInp.step = "0.0001";
        latInp.className = "form-control form-control-sm";
        latInp.style.width = "80px";
        latInp.value = item.lat;
        latInp.addEventListener("change", (e) => { 
            barangaysData[idx].lat = parseFloat(e.target.value) || item.lat; 
            saveData(); 
        });
        const lngInp = document.createElement("input");
        lngInp.type = "number";
        lngInp.step = "0.0001";
        lngInp.className = "form-control form-control-sm";
        lngInp.style.width = "80px";
        lngInp.value = item.lng;
        lngInp.addEventListener("change", (e) => { 
            barangaysData[idx].lng = parseFloat(e.target.value) || item.lng; 
            saveData(); 
        });
        coordDiv.appendChild(latInp);
        coordDiv.appendChild(lngInp);
        row.insertCell(4).appendChild(coordDiv);
        
        const actionsCell = row.insertCell(5);
        
        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger me-1";
        delBtn.innerHTML = "<i class='bi bi-trash3'></i>";
        delBtn.onclick = () => {
            if (confirm(`Remove ${item.name}?`)) {
                logAdminAction("DELETE_BARANGAY", item.id, `Deleted barangay: ${item.name}`);
                barangaysData.splice(idx, 1);
                saveData();
                renderAdminTable();
            }
        };
        actionsCell.appendChild(delBtn);
        
        const historyBtn = document.createElement("button");
        historyBtn.className = "btn btn-sm btn-info";
        historyBtn.innerHTML = "<i class='bi bi-clock-history'></i>";
        historyBtn.onclick = () => showBarangayHistoryModal(item.id);
        actionsCell.appendChild(historyBtn);
    });
}

function loadAnnouncement() {
    const stored = localStorage.getItem("floodwatch_global_announce");
    const defaultMsg = "⚠️ Current situation: Intermittent rains expected. Stay tuned for barangay updates. Keep emergency kits ready.";
    const announcementText = stored ? stored : defaultMsg;
    const announcementHtml = `<div class="alert announcement-banner d-flex align-items-center p-3 shadow-sm">
                                <i class="bi bi-megaphone-fill fs-4 me-3"></i>
                                <div class="fw-medium">${announcementText}</div>
                              </div>`;
    document.getElementById("announcementArea").innerHTML = announcementHtml;
    const textarea = document.getElementById("globalAnnounceText");
    if (textarea) textarea.value = announcementText;
}

function saveAnnouncementMessage(msg) {
    localStorage.setItem("floodwatch_global_announce", msg);
    loadAnnouncement();
    showNotification("Announcement published!", "success");
}

function showAdminModal() {
    if (adminAuthenticated) {
        renderAdminTable();
        renderHistoryTable();
        const currentAnn = localStorage.getItem("floodwatch_global_announce") || "⚠️ Stay alert: Monitor water levels.";
        if(document.getElementById("globalAnnounceText")) document.getElementById("globalAnnounceText").value = currentAnn;
        adminModal.show();
    } else {
        const pwd = prompt("🔐 Admin Access Required. Enter password:");
        if (pwd === adminPassword) {
            adminAuthenticated = true;
            renderAdminTable();
            renderHistoryTable();
            const currentAnn = localStorage.getItem("floodwatch_global_announce") || "⚠️ Stay alert: Monitor water levels.";
            if(document.getElementById("globalAnnounceText")) document.getElementById("globalAnnounceText").value = currentAnn;
            adminModal.show();
            showNotification("Welcome Admin!", "success");
        } else {
            alert("Invalid password.");
        }
    }
}

function logoutAdmin() {
    adminAuthenticated = false;
    adminModal.hide();
    showNotification("Admin logged out", "info");
}

function addBarangay() {
    const name = document.getElementById("newBrgyName").value.trim();
    if (!name) return alert("Barangay name required");
    if (barangaysData.some(b => b.name.toLowerCase() === name.toLowerCase())) return alert("Barangay already exists");
    
    const newId = generateNewId();
    const risk = document.getElementById("newRiskSelect").value;
    const depth = document.getElementById("newDepthInput").value.trim() || "0.2 - 0.5 m";
    const evac = document.getElementById("newEvacInput").value.trim() || "Barangay Evacuation Center";
    let lat = parseFloat(document.getElementById("newLatInput").value);
    let lng = parseFloat(document.getElementById("newLngInput").value);
    if (isNaN(lat)) lat = 14.70;
    if (isNaN(lng)) lng = 120.98;
    
    barangaysData.push({ id: newId, name, risk, depth, evacCenter: evac, lat, lng });
    
    logAdminAction("ADD_BARANGAY", newId, `Added new barangay: ${name} with ${risk} risk`);
    recordRiskChange(newId, "N/A", risk);
    
    saveData();
    
    document.getElementById("newBrgyName").value = "";
    document.getElementById("newDepthInput").value = "";
    document.getElementById("newEvacInput").value = "";
    document.getElementById("newLatInput").value = "";
    document.getElementById("newLngInput").value = "";
    
    if (adminAuthenticated) renderAdminTable();
    showNotification(`Barangay ${name} added!`, "success");
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initMap();
    loadAnnouncement();

    window.adminModal = new bootstrap.Modal(document.getElementById("adminModal"), { backdrop: 'static', keyboard: false });
    
    document.getElementById("adminAccessBtn").addEventListener("click", showAdminModal);
    document.getElementById("logoutAdminHeaderBtn")?.addEventListener("click", logoutAdmin);
    document.getElementById("logoutAdminTabBtn")?.addEventListener("click", logoutAdmin);
    document.getElementById("clearHistoryBtn")?.addEventListener("click", clearAllHistory);
    
    document.getElementById("searchBtnAction").addEventListener("click", searchBarangay);
    document.getElementById("barangaySearchInput").addEventListener("keypress", (e) => { 
        if (e.key === "Enter") searchBarangay(); 
    });
    
    document.getElementById("addBrgyAdminBtn")?.addEventListener("click", addBarangay);
    
    document.getElementById("saveAnnounceBtn")?.addEventListener("click", () => {
        const newMsg = document.getElementById("globalAnnounceText").value;
        if (newMsg) saveAnnouncementMessage(newMsg);
        else alert("Message cannot be empty");
    });
    
    document.getElementById("changeAdminPassBtn")?.addEventListener("click", () => {
        const newPwd = document.getElementById("newAdminPassword").value.trim();
        if (newPwd.length >= 4) {
            adminPassword = newPwd;
            localStorage.setItem("floodwatch_admin_pass", adminPassword);
            alert("Admin password updated successfully.");
            document.getElementById("newAdminPassword").value = "";
            showNotification("Password changed!", "success");
        } else alert("Minimum 4 characters");
    });
    
    const storedPass = localStorage.getItem("floodwatch_admin_pass");
    if (storedPass) adminPassword = storedPass;
});
