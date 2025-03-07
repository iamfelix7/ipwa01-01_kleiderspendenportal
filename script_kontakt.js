    // Zeigt Pop-up-Fenster an, wenn Kontaktformular abgeschickt wurde
    const kontaktForm = document.getElementById('kontaktForm');
    if (kontaktForm) {
        kontaktForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Pop-up anzeigen
            const successPopupKontakt = new bootstrap.Modal(document.getElementById('successPopupKontakt'));
            successPopupKontakt.show();

            // Nach 4 Sekunden auf die Startseite umleiten
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 4000);
        });
    }
