// Filnamn: utils.js

function rensaAllLokalData() {

    visaBekraftelse(
        "Rensa data",
        "Vill du rensa all lokal data? Detta tar bort sparade inställningar, cache och offline-kö.",
        (bekraftat) => {

            if (bekraftat) {

                localStorage.clear();
                sessionStorage.clear();

                visaMeddelande(
                    "Rensat",
                    "All lokal data har rensats.",
                    () => {
                        window.location.href = "index.html";
                    }
                );

            }

        }
    );

}

function skapaID(prefix) {
    return prefix + Date.now();
}

