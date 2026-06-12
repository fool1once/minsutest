// Data Model (7 barangays)
const DEFAULT_BARANGAYS = [
    { name: "Malanday", risk: "HIGH", depth: "0.5 - 1.5 meters", evacCenter: "Malanday National High School", lat: 14.7000, lng: 120.9830 },
    { name: "Karuhatan", risk: "MODERATE", depth: "0.2 - 0.8 meters", evacCenter: "Karuhatan Elementary School", lat: 14.6760, lng: 120.9820 },
    { name: "Gen T De Leon", risk: "LOW", depth: "0.1 - 0.3 meters", evacCenter: "Gen T De Leon Gymnasium", lat: 14.7150, lng: 120.9980 },
    { name: "Marulas", risk: "HIGH", depth: "0.6 - 1.8 meters", evacCenter: "Marulas Covered Court", lat: 14.6550, lng: 120.9720 },
    { name: "Ugong", risk: "MODERATE", depth: "0.3 - 0.9 meters", evacCenter: "Ugong Barangay Hall", lat: 14.6830, lng: 120.9580 },
    { name: "Canumay", risk: "LOW", depth: "0.1 - 0.4 meters", evacCenter: "Canumay Elementary School", lat: 14.7270, lng: 120.9900 },
    { name: "Polo", risk: "HIGH", depth: "0.7 - 1.4 meters", evacCenter: "Polo National High School", lat: 14.6930, lng: 120.9460 }
];

let barangaysData = [];
let mapInstance;
let markerGroup = L.layerGroup();
let adminAuthenticated = false;
let adminPassword = "admin123";

// Load data from localStorage
function loadData() {
    const stored = localStorage.getItem("floodwatch_brgy_data");
    if (stored) {
        barangaysData = JSON.parse(stored);
    } else {
        barangaysData = JSON.parse(JSON.stringify(DEFAULT_BARANGAYS));
    }
    updateDashboardStats();
    updateDatalist();
    refreshMapMarkers();
    if (document.getElementById("adminTableBody")) renderAdminTable();
}

function saveData() {
    localStorage.setItem("floodwatch_brgy_data", JSON.stringify(barangaysData));
    updateDashboardStats();
    updateDatalist();
    refreshMapMarkers();
    if (adminAuthenticated) renderAdminTable();
    const resultDiv = document.getElementById("resultCard");
    if (resultDiv) resultDiv.style.display = "none";
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
    if (found) {
        notFoundDiv.classList.add("d-none");
        document.getElementById("resultBarangayName").innerText = found.name;
        const riskSpan = document.getElementById("resultRisk");
        riskSpan.innerHTML = `<span class="risk-badge risk-${found.risk.toLowerCase()}">${found.risk}</span>`;
        document.getElementById("resultDepth").innerText = found.depth;
        document.getElementById("resultEvac").innerText = found.evacCenter;
        document.getElementById("resultCoords").innerText = `${found.lat.toFixed(4)}, ${found.lng.toFixed(4)}`;
        resultCard.style.display = "block";
        if (mapInstance) {
            mapInstance.setView([found.lat, found.lng], 14);
            refreshMapMarkers(true, found.name);
        }
        resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
        notFoundDiv.classList.remove("d-none");
        resultCard.style.display = "none";
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
        row.insertCell(0).innerHTML = `<span class="fw-medium">${item.name}</span>`;
        
        const riskSelect = document.createElement("select");
        riskSelect.className = "form-select form-select-sm";
        riskSelect.innerHTML = `<option ${item.risk === "HIGH" ? "selected" : ""}>HIGH</option>
                                <option ${item.risk === "MODERATE" ? "selected" : ""}>MODERATE</option>
                                <option ${item.risk === "LOW" ? "selected" : ""}>LOW</option>`;
        riskSelect.addEventListener("change", (e) => {
            barangaysData[idx].risk = e.target.value;
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
        latInp.addEventListener("change", (e) => { barangaysData[idx].lat = parseFloat(e.target.value) || item.lat; saveData(); });
        const lngInp = document.createElement("input");
        lngInp.type = "number";
        lngInp.step = "0.0001";
        lngInp.className = "form-control form-control-sm";
        lngInp.style.width = "80px";
        lngInp.value = item.lng;
        lngInp.addEventListener("change", (e) => { barangaysData[idx].lng = parseFloat(e.target.value) || item.lng; saveData(); });
        coordDiv.appendChild(latInp);
        coordDiv.appendChild(lngInp);
        row.insertCell(4).appendChild(coordDiv);
        
        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger";
        delBtn.innerHTML = "<i class='bi bi-trash3'></i>";
        delBtn.onclick = () => {
            if (confirm(`Remove ${item.name}?`)) {
                barangaysData.splice(idx, 1);
                saveData();
                renderAdminTable();
            }
        };
        row.insertCell(5).appendChild(delBtn);
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
}

function showAdminModal() {
    if (adminAuthenticated) {
        renderAdminTable();
        const currentAnn = localStorage.getItem("floodwatch_global_announce") || "⚠️ Stay alert: Monitor water levels.";
        if(document.getElementById("globalAnnounceText")) document.getElementById("globalAnnounceText").value = currentAnn;
        adminModal.show();
    } else {
        const pwd = prompt("🔐 Admin Access Required. Enter password:");
        if (pwd === adminPassword) {
            adminAuthenticated = true;
            renderAdminTable();
            const currentAnn = localStorage.getItem("floodwatch_global_announce") || "⚠️ Stay alert: Monitor water levels.";
            if(document.getElementById("globalAnnounceText")) document.getElementById("globalAnnounceText").value = currentAnn;
            adminModal.show();
        } else {
            alert("Invalid password.");
        }
    }
}

function logoutAdmin() {
    adminAuthenticated = false;
    adminModal.hide();
    alert("Admin logged out. Click Admin button to re-enter.");
}

function initMap() {
    mapInstance = L.map('map').setView([14.7000, 120.9830], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
        maxZoom: 18
    }).addTo(mapInstance);
    refreshMapMarkers();
}

function addBarangay() {
    const name = document.getElementById("newBrgyName").value.trim();
    if (!name) return alert("Barangay name required");
    if (barangaysData.some(b => b.name.toLowerCase() === name.toLowerCase())) return alert("Barangay already exists");
    const risk = document.getElementById("newRiskSelect").value;
    const depth = document.getElementById("newDepthInput").value.trim() || "0.2 - 0.5 m";
    const evac = document.getElementById("newEvacInput").value.trim() || "Barangay Evacuation Center";
    let lat = parseFloat(document.getElementById("newLatInput").value);
    let lng = parseFloat(document.getElementById("newLngInput").value);
    if (isNaN(lat)) lat = 14.70;
    if (isNaN(lng)) lng = 120.98;
    barangaysData.push({ name, risk, depth, evacCenter: evac, lat, lng });
    saveData();
    document.getElementById("newBrgyName").value = "";
    document.getElementById("newDepthInput").value = "";
    document.getElementById("newEvacInput").value = "";
    if (adminAuthenticated) renderAdminTable();
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initMap();
    loadAnnouncement();

    window.adminModal = new bootstrap.Modal(document.getElementById("adminModal"), { backdrop: 'static', keyboard: false });
    
    document.getElementById("adminAccessBtn").addEventListener("click", showAdminModal);
    document.getElementById("logoutAdminHeaderBtn")?.addEventListener("click", logoutAdmin);
    document.getElementById("logoutAdminTabBtn")?.addEventListener("click", logoutAdmin);
    
    document.getElementById("searchBtnAction").addEventListener("click", searchBarangay);
    document.getElementById("barangaySearchInput").addEventListener("keypress", (e) => { if (e.key === "Enter") searchBarangay(); });
    
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
        } else alert("Minimum 4 characters");
    });
    
    const storedPass = localStorage.getItem("floodwatch_admin_pass");
    if (storedPass) adminPassword = storedPass;
});
