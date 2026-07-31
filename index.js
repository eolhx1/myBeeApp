// Filnamn: index.js

let map;

function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.menu-btn') && !event.target.closest('.menu-container')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function visaInstallningar() {
    localStorage.removeItem("myBeeApp_url");
    sessionStorage.removeItem("myBeeApp_globalData");
    sessionStorage.removeItem("myBeeApp_bigardar");
    initApp();
}

function initApp() {
    const savedUrl = localStorage.getItem("myBeeApp_url");
    if (!savedUrl) {
        document.getElementById("setup-screen").style.display = "block";
        document.getElementById("main-content").style.display = "none";
        document.getElementById("offline-banner").style.display = "none";
    } else {
        document.getElementById("setup-screen").style.display = "none";
        document.getElementById("main-content").style.display = "block";

        uppdateraOfflineBanner();

        if (!map && typeof L !== 'undefined') {
            map = L.map('map').setView([62.0, 15.0], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
        }

        // Tvinga kartan att anpassa sig efter att den blivit synlig
        if (map) {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        const cachedData = sessionStorage.getItem("myBeeApp_globalData");
        if (cachedData) {
            try {
                let globalData = JSON.parse(cachedData);
                if (globalData.bigardar) {
                    visaBigardar(globalData.bigardar);
                }
            } catch (e) {
                console.error("Kunde inte läsa cache", e);
            }
        } else {
            document.getElementById("bigard-list").innerHTML = "<p>Laddar bigårdar...</p>";
        }

        hamtaAllData();
        if (navigator.onLine) {
            synkaOfflineKoe();
        }
    }
}

function uppdateraOfflineBanner() {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    const banner = document.getElementById("offline-banner");
    const countSpan = document.getElementById("offline-count");

    if (koe.length > 0) {
        countSpan.textContent = `${koe.length} st`;
        banner.style.display = "flex";
    } else {
        banner.style.display = "none";
    }
}

async function synkaOfflineKoe() {
    const WEB_APP_URL = localStorage.getItem("myBeeApp_url");
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");

    if (koe.length === 0) return;

    if (!navigator.onLine) {
        alert("Ingen internetanslutning tillgänglig just nu. Kan inte synka.");
        return;
    }

    const banner = document.getElementById("offline-banner");
    banner.style.backgroundColor = "#f39c12";
    banner.querySelector("span").textContent = "🔄 Synkar osynkad data med molnet...";

    let lyckade = 0;

    while (koe.length > 0) {
        let item = koe[0];
        try {
            let response = await fetch(WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify(item)
            });
            let result = await response.json();

            if (result && (result.status === "success" || result.result === "success")) {
                koe.shift();
                localStorage.setItem("myBeeApp_offlineKoe", JSON.stringify(koe));
                lyckade++;
            } else {
                break;
            }
        } catch (e) {
            console.error("Synkfel:", e);
            break;
        }
    }

    uppdateraOfflineBanner();
    banner.style.backgroundColor = "#e74c3c";

    if (lyckade > 0) {
        alert(`Synkningen klar! ${lyckade} ändring(ar) har skickats till Google Sheets.`);
        hamtaAllData();
    } else {
        alert("Kunde inte synka data. Kontrollera din uppkoppling och försök igen.");
    }
}

function sparaUrl() {
    const url = document.getElementById("url-input").value.trim();
    if (url.startsWith("https://script.google.com")) {
        localStorage.setItem("myBeeApp_url", url);
        initApp();
    } else {
        alert("Ange en giltig Apps Script URL.");
    }
}

async function hamtaAllData() {
    const WEB_APP_URL = localStorage.getItem("myBeeApp_url");

    try {
        let response = await fetch(WEB_APP_URL);
        let data = await response.json();

        if (data.status === "error") {
            console.error("Fel från servern:", data.message);
            return;
        }

        if (!data || !data.bigardar) {
            document.getElementById("bigard-list").innerHTML = "<p>Inga bigårdar tillagda ännu.</p>";
            return;
        }

        sessionStorage.setItem("myBeeApp_globalData", JSON.stringify(data));
        visaBigardar(data.bigardar);

    } catch (error) {
        console.error("Kunde inte hämta data från servern:", error);
        if (!sessionStorage.getItem("myBeeApp_globalData")) {
            document.getElementById("bigard-list").innerHTML = "<p style='color:red;'>Kunde inte hämta data från servern.</p>";
        }
    }
}

function visaBigardar(data) {
    const listContainer = document.getElementById("bigard-list");
    listContainer.innerHTML = "";

    if (map) {
        map.invalidateSize();
        
        // Rensa bort gamla markörer så de inte dubbelrias eller ligger kvar
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
    }

    let markers = [];

    data.forEach(b => {
        const status = b.Status || "Aktiv";
        const isInaktiv = status === "Inaktiv" || status.includes("Inaktiv");

        const card = document.createElement("div");
        card.className = `card ${isInaktiv ? 'inaktiv': ''}`;

        card.onclick = () => {
            window.location.href = `skotsel.html?id=${encodeURIComponent(b.BigardsID)}`;
        };

        card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
        <h3 style="${isInaktiv ? 'text-decoration: line-through; color: #7f8c8d;': ''}">${b.Namn || 'Namnlös bigård'}</h3>
        <p><strong>Typ:</strong> ${b.Typ || '-'}</p>
        <p><strong>Samhällen:</strong> ${b.AntalSamhallen || 0}</p>
        <span class="badge ${isInaktiv ? 'inaktiv': ''}">${status}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
        <button onclick="event.stopPropagation(); window.location.href='bigardsstatus.html?id=${b.BigardsID}';" style="background: #27ae60; color: white; border: none; border-radius: 4px; padding: 0.5rem; cursor: pointer;" title="Visa bigårdsstatus">📊 Status</button>
        <button onclick="event.stopPropagation(); redigeraBigard('${b.BigardsID}');" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.5rem;" aria-label="Ändra bigård">⚙️</button>
        </div>
        </div>
        `;
        listContainer.appendChild(card);

        if (map && b.Latitud && b.Longitud) {
            let lat = parseFloat(b.Latitud.toString().replace(',', '.'));
            let lon = parseFloat(b.Longitud.toString().replace(',', '.'));
            if (!isNaN(lat) && !isNaN(lon)) {
                let latLng = [lat, lon];

                if (isInaktiv) {
                    let grayIcon = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                    L.marker(latLng, {
                        icon: grayIcon
                    }).addTo(map)
                    .bindPopup(`<b>${b.Namn} (Inaktiv)</b><br>${b.Typ}<br><a href="skotsel.html?id=${encodeURIComponent(b.BigardsID)}">Öppna skötselkort</a>`);
                } else {
                    L.marker(latLng).addTo(map)
                    .bindPopup(`<b>${b.Namn}</b><br>${b.Typ}<br><a href="skotsel.html?id=${encodeURIComponent(b.BigardsID)}">Öppna skötselkort</a>`);
                }

                markers.push(latLng);
            }
        }
    });

    if (map && markers.length > 0) {
        let bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, {
            padding: [50, 50], maxZoom: 15
        });
    }
}

function redigeraBigard(id) {
    window.location.href = `ny-bigard.html` + (id ? `?id=${id}`: '');
}

initApp();
