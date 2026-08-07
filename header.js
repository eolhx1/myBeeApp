// Filnamn: header.js

function laddaHeader(titelText, infoRubrik = '', infoTextHtml = '') {
    const lankStil = "padding: 8px 8px 8px 32px; text-decoration: none; font-size: 1.1rem; color: #ecf0f1; display: block; transition: 0.2s;";

    const menylankar = [
        { url: "index.html", text: "🏠 Hem / Karta" },
        { url: "snabbkoll.html", text: "⚡ Snabbkoll i bigård" },
        { url: "bigardsstatus.html", text: "📊 Bigårdsstatus" },
        { url: "historik.html", text: "📈 Historik & Trender" },
        { url: "drottningar.html", text: "👑 Drottningregister" },
        { url: "foder.html", text: "🪣 Fodring & Vinterfoder" },
        { url: "varroa.html", text: "🔬 Varroastatus & Hälsa" },
        { url: "honung.html", text: "🍯 Honungsskörd" },
        { url: "verktyg.html", text: "🛠️ Biodlarverktyg" },
        { url: "inventarie.html", text: "📦 Inventarie" },
        { url: "ekonomi.html", text: "💰 Kassabok" },
        { url: "odling.html", text: "👑 Drottningodling" },
        { url: "kalender.html", text: "🌸 Drag- & Blomningskalender" },
        { url: "vaxhantering.html", text: "🕯️ Vaxhantering" },
        { url: "sasong.html", text: "📅 Säsongsschema" },
        { url: "ny-bigard.html", text: "➕ Lägg till bigård" }
    ];

    const menyHtmlLankar = menylankar.map(lank => `<a href="${lank.url}" style="${lankStil}">${lank.text}</a>`).join('');

    const aktuellSida = window.location.pathname.split("/").pop() || "index.html";
    let breadcrumbHTML = '';
let infoKnappHtml =
    (infoRubrik && infoTextHtml)
        ? '<button class="info-btn" onclick="oppnaInfoModal()" title="Om sidan">i</button>'
        : '';

let renTitel = titelText.replace(/^[^\w\s]+\s*/, '');
    if (aktuellSida !== "index.html" && aktuellSida !== "") {
        breadcrumbHTML = `
            <div style="display: flex; align-items: center; gap: 0.4rem;">
                <a href="index.html" style="color: white; text-decoration: none;">🏠 Hem</a>
                <span> &gt; </span>
<span id="breadcrumb-text">${renTitel}</span>
            </div>
            ${infoKnappHtml}
        `;
    } else {
        breadcrumbHTML = `
            <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span>🏠 Hem</span>
            </div>
            ${infoKnappHtml}
        `;
    }

    const headerHTML = `
<header>

    <div class="header-top">

        <button
            class="menu-btn"
            onclick="toggleSidebar()"
            style="background: none; border: none; font-size: 1.5rem; color: white; cursor: pointer;"
            aria-label="Meny">
            ☰
        </button>

        <h1
            id="page-header-title"
            style="margin: 0; font-size: 1.2rem; text-align: center;">
            ${titelText}
        </h1>

        <div style="display: flex; align-items: center; gap: 0.5rem;">

            <div
                id="sync-indicator"
                style="display: none; background: #e67e22; color: white; padding: 3px 6px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #d35400;"
                title="Ändringar väntar på synk till molnet">

                💾 <span id="sync-count">0</span>

            </div>

            <button
                onclick="toggleSettingsMenu()"
                style="background: none; border: none; font-size: 1.3rem; cursor: pointer;"
                title="Inställningar"
                aria-label="Inställningar">

                ⚙️

            </button>

        </div>

    </div>

    ${breadcrumbHTML ? `
    <div class="nav-bar">
        ${breadcrumbHTML}
    </div>
    ` : ''}

</header>

    <!-- Sidomeny (Sidebar) -->

    <!-- Sidomeny (Sidebar) -->
<div id="mySidebar" class="sidebar">

<button
    class="modal-close sidebar-close-btn"
    onclick="toggleSidebar()">
    &times;
</button>
       
	   ${menyHtmlLankar}
    </div>

    <!-- Inställningsmodal -->
<div id="settingsModal" class="modal-overlay">
<div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
 <h3 style="margin: 0; color: #2c3e50;">⚙️ Inställningar</h3>

<button
    class="modal-close"
    onclick="toggleSettingsMenu()"
    style="position:absolute; top:12px; right:12px;">
    &times;
</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                    <span>🌙 Mörkt läge (kommer)</span>
                    <input type="checkbox" disabled title="Kommer snart" style="cursor: not-allowed;">
                </div>

                <button onclick="bytUrlSide()" 
				style="background: #e74c3c; color: white; border: none; padding: 0.7rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
				Byt anslutningslänk
				</button>
				
<button onclick="visaUrlSide()"
    style="background: #3498db; color: white; border: none; padding: 0.7rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
    Visa anslutningslänk
</button>		

                <button onclick="rensaAllLokalData()" 
				style="background: #c0392b; color: white; border: none; padding: 0.7rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
				🗑️ Rensa all lokal data
				</button>

            </div>
        </div>
    </div>

<!-- Info-modal -->
${infoRubrik ? `
<div id="info-modal"
     class="modal-overlay"
     onclick="stangInfoModalKlickUtanför(event)"
     style="display:none;">

    <div class="modal-content">

        <button class="modal-close"
                onclick="stangInfoModal()">
            &times;
        </button>

        <h3>${infoRubrik}</h3>

        <div>
            ${infoTextHtml}
        </div>

    </div>

</div>` : ''}

 
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Uppdatera synk-indikatorn direkt när headern har skapats
    if (typeof uppdateraSynkIndikator === 'function') {
        uppdateraSynkIndikator();
    }
}

function toggleSidebar() {

    const sidebar =
        document.getElementById("mySidebar");

    const oppen =
        sidebar.style.width === "250px";

    if (oppen) {

        sidebar.style.width = "0";
        document.body.style.overflow = "";

    } else {

        sidebar.style.width = "250px";
        document.body.style.overflow = "hidden";

    }
}

function toggleSettingsMenu() {
    const modal = document.getElementById("settingsModal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function oppnaInfoModal() {
    let modal = document.getElementById('info-modal');
    if (modal) modal.style.display = 'flex';
}

function stangInfoModal() {
    let modal = document.getElementById('info-modal');
    if (modal) modal.style.display = 'none';
}

function stangInfoModalKlickUtanför(event) {
    if (event.target.id === 'info-modal') {
        stangInfoModal();
    }
}

function bytUrlSide() {
    visaBekraftelse("Byt anslutningslänk", "Vill du byta anslutningslänk? Appen kommer att nollställa aktuell koppling.", (bekraftat) => {
        if (bekraftat) {
            localStorage.removeItem("myBeeApp_url");
            sessionStorage.clear();
            window.location.href = "index.html";
        }
    });
}

function visaUrlSide() {

    let url = localStorage.getItem("myBeeApp_url");

    if (!url) {
        visaMeddelande(
            "Anslutningslänk",
            "Ingen anslutningslänk är sparad."
        );
        return;
    }

    let modalHtml = `
    <div style="word-break: break-all; margin-bottom: 15px;">
        ${url}
    </div>

    <button
        onclick="
    navigator.clipboard.writeText('${url}');
    this.innerHTML='✅ Kopierad';
"
        style="background:#7f8c8d;color:white;border:none;
               padding:8px 12px;border-radius:4px;cursor:pointer;">
        📋 Kopiera
    </button>
    `;

    visaMeddelande(
        "Anslutningslänk",
        modalHtml
    );
}

// ==========================================
// CENTRAL MODAL-MOTOR (DRY-principen)
// ==========================================

function visaAppModal(titel, meddelande, typ = 'alert', bekräftelseCallback = null) {
    let gammalModal = document.getElementById('app-custom-modal');
    if (gammalModal) gammalModal.remove();

    let knapparHtml = '';
    if (typ === 'confirm') {
        knapparHtml = `
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.5rem;">
                <button id="modal-avbryt-btn" style="background: #95a5a6; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-weight: bold;">Avbryt</button>
                <button id="modal-bekräfta-btn" style="background: #e67e22; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
            </div>
        `;
    } else {
        knapparHtml = `
            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                <button id="modal-bekräfta-btn" style="background: #f39c12; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-weight: bold;">OK</button>
            </div>
        `;
    }

const modalHtml = `
<div id="app-custom-modal"
     class="modal-overlay"
     style="display:flex;">
	 
<div class="modal-content">

<button
    class="modal-close"
    id="modal-close-btn">
    &times;
</button>

            <h3>${titel}</h3>

<div style="color: #555; font-size: 0.95rem; line-height: 1.5; margin: 1rem 0;">
    ${meddelande}
</div>

            ${knapparHtml}

        </div>

    </div>
`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
	let closeBtn = document.getElementById('modal-close-btn');

if (closeBtn) {

    closeBtn.onclick = function() {

        document.getElementById('app-custom-modal').remove();

        if (bekräftelseCallback) {
            bekräftelseCallback(false);
        }

    };

}

    document.getElementById('modal-bekräfta-btn').onclick = function() {
        document.getElementById('app-custom-modal').remove();
        if (bekräftelseCallback) bekräftelseCallback(true);
    };

    let avbrytBtn = document.getElementById('modal-avbryt-btn');
    if (avbrytBtn) {
        avbrytBtn.onclick = function() {
            document.getElementById('app-custom-modal').remove();
            if (bekräftelseCallback) bekräftelseCallback(false);
        };
    }
}

// Enkla genvägar (wrappers) för att göra koden superren i andra filer
function visaMeddelande(titel, text, stangCallback = null) {
    visaAppModal(titel, text, 'alert', stangCallback);
}

function visaBekraftelse(titel, text, callback) {
    visaAppModal(titel, text, 'confirm', callback);
}

// ==========================================
// GENERISK SNABBKNAPP
// ==========================================
function laddaSnabbKnapp(ikon, klickFunktion) {

    let gammalKnapp =
        document.getElementById("fab-button");

    if (gammalKnapp) {
        gammalKnapp.remove();
    }

    document.body.insertAdjacentHTML(
        "beforeend",
        `
        <button
            id="fab-button"
            class="fab-button"
            onclick="${klickFunktion}">
            ${ikon}
        </button>
        `
    );

}

