// Filnamn: utils.js

function rensaAllLokalData() {
    if (confirm("Är du säker på att du vill rensa all lokalt sparad data? Detta tar bort din sparade länk och all cache.")) {
        localStorage.clear();
        sessionStorage.clear();
        alert("All lokal data har rensats.");
        window.location.href = "index.html";
    }
}

function skapaID(prefix) {
    return prefix + Date.now();
}

