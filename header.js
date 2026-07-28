// Filnamn: header.js

function laddaHeader(titelTekst, breadcrumbHTML = '') {
    // Skapa HTML-strukturen för header, sidomeny och inställningsknapp (kugghjul)
    const headerHTML = `
        <header style="display: flex; justify-content: space-between; align-items: center; background-color: #f39c12; color: white; padding: 1rem; position: sticky; top: 0; z-index: 1000;">
            <button class="menu-btn" onclick="toggleSidebar()" style="background: none; border: none; font-size: 1.5rem; color: white; cursor: pointer;" aria-label="Meny">☰</button>
            <h1 id="page-header-title" style="margin: 0; font-size: 1.2rem; text-align: center;">${titelTekst}</h1>
            <button onclick="bytUrlSide()" style="background: none; border: none; font-size: 1.3rem; cursor: pointer;" title="Inställningar / Byt anslutningslänk" aria-label="Inställningar">⚙️</button>
        </header>

        <!-- Sidomeny (Sidebar) -->
        <div id="mySidebar" class="sidebar" style="height: 100%; width: 0; position: fixed; z-index: 2000; top: 0; left: 0; background-color: #2c3e50; overflow-x: hidden; transition: 0.3s; padding-top: 60px; box-shadow: 2px 0 5px rgba(0,0,0,0.5);">
            <a href="javascript:void(0)" class="close-btn" onclick="toggleSidebar()" style="position: absolute; top: 15px; right: 25px; font-size: 36px; color: white; text-decoration: none;">&times;</a>
            <a href="index.html" style="padding: 8px 8px 8px 32px; text-decoration: none; font-size: 1.1rem; color: #ecf0f1; display: block; transition: 0.2s;">🏠 Hem / Karta</a>
            <a href="ny-bigard.html" style="padding: 8px 8px 8px 32px; text-decoration: none; font-size: 1.1rem; color: #ecf0f1; display: block; transition: 0.2s;">➕ Lägg till bigård</a>
        </div>

        ${breadcrumbHTML ? `<div class="nav-bar" style="background: #e67e22; color: white; padding: 0.5rem 1rem; font-size: 0.9rem;">${breadcrumbHTML}</div>` : ''}
    `;

    // Infoga headern i början av body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// Funktion för att öppna/stänga sidebaren
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Global hjälpfunktion för att nollställa URL när man klickar på kugghjulet
function bytUrlSide() {
    if (confirm("Vill du byta anslutningslänk? Appen kommer att nollställa aktuell koppling.")) {
        localStorage.removeItem("myBeeApp_url");
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}
