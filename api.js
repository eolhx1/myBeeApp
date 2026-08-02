// Filnamn: api.js - Central funktion för molnanrop och offline-kö

// ==========================================
// 1. ANSLUTNING & KONFIGURATION
// ==========================================

// Hämtar sparad webbapp-länk (Google Apps Script URL) från lokal lagring
function hamtaAppUrl() {
    return localStorage.getItem("myBeeApp_url");
}


// ==========================================
// 2. OFFLINE-KÖ & LAGRING
// ==========================================

// Sparar ner data i den lokala kön om enheten är offline eller om anslutningen misslyckas
function sparaTillOfflineKoe(newItem) {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    koe.push(newItem);
    localStorage.setItem("myBeeApp_offlineKoe", JSON.stringify(koe));
    
    // Uppdatera synk-indikatorn direkt när något läggs till i kön
    if (typeof uppdateraSynkIndikator === 'function') {
        uppdateraSynkIndikator();
    }
}


// ==========================================
// 3. MOLNANROP & SPARANDE
// ==========================================

// Skickar data till molnet (Google Sheets) eller lägger i offline-kö vid avbrott
async function skickaDataTillMolnet(sheetNamn, formData, efterFolgandeUrl = "index.html") {
    const WEB_APP_URL = hamtaAppUrl();
    
    if (!WEB_APP_URL) {
        alert("Ingen anslutningslänk hittades.");
        return false;
    }

    // Kontrollera om enheten är offline direkt innan anrop
    if (!navigator.onLine) {
        sparaTillOfflineKoe(formData);
        alert("Ingen internettäckning! Informationen har sparats lokalt i kö och synkas automatiskt senare.");
        window.location.href = efterFolgandeUrl;
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
            alert("Ändringarna har sparats till molnet!");
            window.location.href = efterFolgandeUrl;
            return true;
        } else {
            throw new Error(result.message || "Okänt fel från servern");
        }
    } catch (error) {
        console.warn("Kunde inte nå servern, sparar lokalt i kö...", error);
        sparaTillOfflineKoe(formData);
        alert("Tappade anslutningen till molnet. Informationen är sparad lokalt i kö och synkas senare!");
        window.location.href = efterFolgandeUrl;
        return true;
    }
}


// ==========================================
// 4. GRÄNSSNITT & SYNK-INDIKATOR
// ==========================================

// Uppdaterar synk-räknaren i sidhuvudet baserat på hur många poster som ligger i kön
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

// Lyssnar av om enheten återigen får internetanslutning och tömmer i så fall kön automatiskt
window.addEventListener('online', async () => {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    if (koe.length === 0) return;
    
    const WEB_APP_URL = hamtaAppUrl();
    if (!WEB_APP_URL) return;

    // Skicka köad data i bakgrunden till servern
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

// Kör en kontroll direkt när scriptet och DOM har laddats in
document.addEventListener("DOMContentLoaded", uppdateraSynkIndikator);
