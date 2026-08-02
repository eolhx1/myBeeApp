// Filnamn: api.js - Central funktion för molnanrop och offline-kö

// ==========================================
// 1. ANSLUTNING & KONFIGURATION
// ==========================================

function hamtaAppUrl() {
    return localStorage.getItem("myBeeApp_url");
}


// ==========================================
// 2. OFFLINE-KÖ & LAGRING
// ==========================================

function sparaTillOfflineKoe(newItem) {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    koe.push(newItem);
    localStorage.setItem("myBeeApp_offlineKoe", JSON.stringify(koe));
    
    if (typeof uppdateraSynkIndikator === 'function') {
        uppdateraSynkIndikator();
    }
}


// ==========================================
// 3. MOLNANROP & SPARANDE
// ==========================================

async function skickaDataTillMolnet(sheetNamn, formData, efterFolgandeUrl = "index.html") {
    const WEB_APP_URL = hamtaAppUrl();
    
    if (!WEB_APP_URL) {
        if (typeof visaAppModal === 'function') {
            visaAppModal("Saknas anslutning", "Ingen anslutningslänk hittades.");
        } else {
            alert("Ingen anslutningslänk hittades.");
        }
        return false;
    }

    if (!navigator.onLine) {
        sparaTillOfflineKoe(formData);
        
        // Använder snygg app-modal istället för standard alert
        let meddelande = "Ingen internettäckning! Informationen har sparats lokalt i kö och synkas automatiskt senare.";
        if (typeof visaAppModal === 'function') {
            visaAppModal("Offline-läge", meddelande, 'alert', () => {
                window.location.href = efterFolgandeUrl;
            });
        } else {
            alert(meddelande);
            window.location.href = efterFolgandeUrl;
        }
        return true;
    }

    try {
        let response = await fetch(`${WEB_APP_URL}?sheet=${sheetNamn}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(formData)
        });
        
        let result = await response.json();
        
        if (result && (result.status === "success" || result.result === "success")) {
            sessionStorage.removeItem("myBeeApp_globalData");
            
            // Snygg bekräftelseruta vid lyckad sparad data
            let meddelande = "Ändringarna har sparats till molnet!";
            if (typeof visaAppModal === 'function') {
                visaAppModal("Klart!", meddelande, 'alert', () => {
                    window.location.href = efterFolgandeUrl;
                });
            } else {
                alert(meddelande);
                window.location.href = efterFolgandeUrl;
            }
            return true;
        } else {
            throw new Error(result.message || "Okänt fel från servern");
        }
    } catch (error) {
        console.warn("Kunde inte nå servern, sparar lokalt i kö...", error);
        sparaTillOfflineKoe(formData);
        
        let meddelande = "Tappade anslutningen till molnet. Informationen är sparad lokalt i kö och synkas senare!";
        if (typeof visaAppModal === 'function') {
            visaAppModal("Anslutningsproblem", meddelande, 'alert', () => {
                window.location.href = efterFolgandeUrl;
            });
        } else {
            alert(meddelande);
            window.location.href = efterFolgandeUrl;
        }
        return true;
    }
}


// ==========================================
// 4. GRÄNSSNITT & SYNK-INDIKATOR
// ==========================================

function uppdateraSynkIndikator() {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    let indikator = document.getElementById("sync-indicator");
    let countSpan = document.getElementById("sync-count");
    
    if (indikator && countSpan) {
        if (koe.length > 0) {
            countSpan.textContent = koe.length;
            indikator.style.display = "inline-block";
        } else {
            indikator.style.display = "none";
        }
    }
}


// ==========================================
// 5. AUTOMATISK SYNK VID ÅTERUPPKOPPLING
// ==========================================

window.addEventListener('online', async () => {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    if (koe.length === 0) return;
    
    const WEB_APP_URL = hamtaAppUrl();
    if (!WEB_APP_URL) return;

    try {
        let response = await fetch(`${WEB_APP_URL}?action=syncQueue`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(koe)
        });
        let result = await response.json();
        if (result && (result.status === "success" || result.result === "success")) {
            localStorage.removeItem("myBeeApp_offlineKoe");
            sessionStorage.removeItem("myBeeApp_globalData");
            uppdateraSynkIndikator();
            console.log("Offline-kön har synkats automatiskt med molnet!");
        }
    } catch (e) {
        console.error("Kunde inte synka kö automatiskt vid uppkoppling:", e);
    }
});


// ==========================================
// 6. INITIALISERING
// ==========================================

document.addEventListener("DOMContentLoaded", uppdateraSynkIndikator);
