// api.js - Central funktion för molnanrop och offline-kö

function hamtaAppUrl() {
    return localStorage.getItem("myBeeApp_url");
}

function sparaTillOfflineKoe(newItem) {
    let koe = JSON.parse(localStorage.getItem("myBeeApp_offlineKoe") || "[]");
    koe.push(newItem);
    localStorage.setItem("myBeeApp_offlineKoe", JSON.stringify(koe));
}

async function skickaDataTillMolnet(sheetNamn, formData, efterFolgandeUrl = "index.html") {
    const WEB_APP_URL = hamtaAppUrl();
    
    if (!WEB_APP_URL) {
        alert("Ingen anslutningslänk hittades.");
        return false;
    }

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
