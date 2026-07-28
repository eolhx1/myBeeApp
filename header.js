// header.js - Genererar gemensam header och meny för alla sidor
function laddaHeader(sidRubrik, breadcrumbHtml) {
    const headerHTML = `
        <header>
            <div class="menu-container">
                <button class="menu-btn" onclick="toggleAppMenu()">☰</button>
                <ul id="appDropdownMenu" class="dropdown-menu">
                    <li><a href="index.html">Hem / Översikt</a></li>
                    <li><a href="ny-bigard.html">Lägg till ny bigård</a></li>
                    <li><a href="#" onclick="rensaAppUrl(); return false;">Byt anslutningslänk</a></li>
                </ul>
            </div>
            <div class="header-title">${sidRubrik}</div>
        </header>
        <div class="nav-bar" style="justify-content: flex-start; gap: 0.5rem;">
            ${breadcrumbHtml}
        </div>
    `;

    // Sätt in cachen/headern i början av body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

function toggleAppMenu() {
    const menu = document.getElementById("appDropdownMenu");
    if (menu) {
        menu.classList.toggle("show");
    }
}

// Stäng menyn om man klickar utanför
window.addEventListener('click', function(event) {
    if (!event.target.matches('.menu-btn') && !event.target.closest('.menu-container')) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

function rensaAppUrl() {
    localStorage.removeItem("myBeeApp_url");
    // Om sidan har en egen init-funktion, anropa den, annars ladda om
    if (typeof initApp === 'function') {
        initApp();
    } else if (typeof initForm === 'function') {
        initForm();
    } else {
        location.reload();
    }
}
