// Filnamn: header.js

function laddaHeader(titelTekst, breadcrumbHTML = '') {
    // Gemensam stil för meny-länkarna
    const lankStil = "padding: 8px 8px 8px 32px; text-decoration: none; font-size: 1.1rem; color: #ecf0f1; display: block; transition: 0.2s;";

    // Lista över sidor i menyn
    const menylankar = [{
        url: "index.html",
        text: "🏠 Hem / Karta"
    },
        {
            url: "historik.html",
            text: "📈 Historik & Trender"
        },
        {
            url: "drottningar.html",
            text: "👑 Drottningregister"
        },
                {
            url: "foder.html",
            text: "🪣 Fodring & Vinterfoder"
        },
        {
            url: "varroa.html",
            text: "🔬 Varroastatus & Hälsa"
        },


        {
            url: "honung.html",
            text: "🍯 Honungsskörd"
        },
        {
            url: "verktyg.html",
            text: "🛠️ Biodlarverktyg"
        },
        {
            url: "inventarie.html",
            text: "📦 Inventarie"
        },

        {
            url: "ekonomi.html",
            text: "💰 Kassabok"
        },
        {
            url: "odling.html",
            text: "👑 Drottningodling"
        },
        {
            url: "vaxhantering.html",
            text: "🕯️ Vaxhantering"
        },

        {
            url: "sasong.html",
            text: "📅 Säsongsschema"
        },
        {
            url: "ny-bigard.html",
            text: "➕ Lägg till bigård"
        }];

    // Bygg HTML för länkarna automatiskt via en loop
    const menyHtmlLankar = menylankar.map(lank => `<a href="${lank.url}" style="${lankStil}">${lank.text}</a>`).join('');

    const headerHTML = `
    <header style="display: flex; justify-content: space-between; align-items: center; background-color: #f39c12; color: white; padding: 1rem; position: sticky; top: 0; z-index: 1000;">
    <button class="menu-btn" onclick="toggleSidebar()" style="background: none; border: none; font-size: 1.5rem; color: white; cursor: pointer;" aria-label="Meny">☰</button>
    <h1 id="page-header-title" style="margin: 0; font-size: 1.2rem; text-align: center;">${titelTekst}</h1>
    <button onclick="toggleSettingsMenu()" style="background: none; border: none; font-size: 1.3rem; cursor: pointer;" title="Inställningar" aria-label="Inställningar">⚙️</button>
    </header>

    <!-- Sidomeny (Sidebar) -->
    <div id="mySidebar" class="sidebar" style="height: 100%; width: 0; position: fixed; z-index: 2000; top: 0; left: 0; background-color: #2c3e50; overflow-x: hidden; transition: 0.3s; padding-top: 60px; box-shadow: 2px 0 5px rgba(0,0,0,0.5);">
    <a href="javascript:void(0)" class="close-btn" onclick="toggleSidebar()" style="position: absolute; top: 15px; right: 25px; font-size: 36px; color: white; text-decoration: none;">&times;</a>
    ${menyHtmlLankar}
    </div>

    <!-- Inställningsmodal -->
    <div id="settingsModal" style="display: none; position: fixed; z-index: 3000; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
    <div style="background: white; padding: 1.5rem; border-radius: 8px; width: 90%; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: #333;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
    <h3 style="margin: 0; color: #2c3e50;">⚙️ Inställningar</h3>
    <button onclick="toggleSettingsMenu()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">❌</button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
    <span>🌙 Mörkt läge (kommer)</span>
    <input type="checkbox" disabled title="Kommer snart" style="cursor: not-allowed;">
    </div>

    <button onclick="bytUrlSide()" style="background: #e74c3c; color: white; border: none; padding: 0.7rem; border-radius: 4px; cursor: pointer; font-weight: bold;">Byt anslutningslänk</button>
    </div>
    </div>
    </div>

    ${breadcrumbHTML ? `<div class="nav-bar" style="background: #e67e22; color: white; padding: 0.5rem 1rem; font-size: 0.9rem; text-align: left;" > ${breadcrumbHTML}</div>`: ''}
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    sidebar.style.width = sidebar.style.width === "250px" ? "0": "250px";
}

function toggleSettingsMenu() {
    const modal = document.getElementById("settingsModal");
    modal.style.display = modal.style.display === "flex" ? "none": "flex";
}

function bytUrlSide() {
    if (confirm("Vill du byta anslutningslänk? Appen kommer att nollställa aktuell koppling.")) {
        localStorage.removeItem("myBeeApp_url");
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}