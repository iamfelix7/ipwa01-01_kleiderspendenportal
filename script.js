// Wenn Abholung ausgewählt, die Felder Straße + Hausnummer, PLZ und Abholort anzeigen
document.addEventListener('DOMContentLoaded', function() {
    const lieferOption = document.getElementById('lieferOption');
    const abholAdresse = document.getElementById('abholAdresse');
    const plzAdresse = document.getElementById('plzAdresse');
    const abholOrt = document.getElementById('abholOrt');

    lieferOption.addEventListener('change', function() {
        if (lieferOption.value === 'abholung') {
            abholAdresse.style.display = 'block';
            plzAdresse.style.display = 'block';
            abholOrt.style.display = 'block';
        } else {
            abholAdresse.style.display = 'none';
            plzAdresse.style.display = 'none';
            abholOrt.style.display = 'none';
        }
    });

    // Bilder Karussell
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new bootstrap.Carousel(carousel, {
            interval: 15000 // 15 Sekunden
        });
    });

    // PLZ Echtzeit-Prüfung - prüft, ob PLZ mit 54 beginnt
    document.getElementById('plz').addEventListener('input', function() {
		const plzInput = this.value;
		const plzPattern = /^[0-9]{5}$/;
		const startsWithRequired = plzInput.startsWith('54');
		const formatValid = plzPattern.test(plzInput);
		
		// Fehlermeldung, wenn Validierung nicht erfolgreich
		const plzError = document.getElementById('plzError');
		if (plzInput.length > 0 && !formatValid) {
			plzError.textContent = 'Bitte geben Sie eine gültige 5-stellige PLZ ein.';
			plzError.style.display = 'block';
		} else if (plzInput.length == 5 && !startsWithRequired) {
			plzError.textContent = 'Die Abholung ist nur in PLZ-Gebieten, die mit 54 beginnen, möglich.';
			plzError.style.display = 'block';
		} else {
			plzError.style.display = 'none';
		}
        checkFormCompletion();
    });
    
    // Prüfen ob alle Felder ausgefüllt sind
    document.querySelectorAll('#spendenForm input, #spendenForm select').forEach(function(element) {
        element.addEventListener('input', checkFormCompletion);
    });
    
    // Funktion zur Prüfung der Formular-Vollständigkeit
    function checkFormCompletion() {
        var spendenArt = document.getElementById('spendenArt').value;
        var zielRegion = document.getElementById('zielRegion').value;
        var lieferOption = document.getElementById('lieferOption').value;
		var datenschutzAkzeptiert = document.getElementById('datenschutz')?.checked || false;
        var submitButton = document.getElementById('submitButton');
        
        if (lieferOption === 'abholung') {
            var strasse = document.getElementById('strasse').value;
            var plz = document.getElementById('plz').value;
            var ort = document.getElementById('ort').value;
            var plzValid = plz.startsWith('54');
            
            // Hinweis anzeigen, wenn PLZ nicht mit 54 beginnt
            document.getElementById('plzError').style.display = plzValid ? 'none' : 'block';
            
            // Aktiviere Button nur wenn alle Felder ausgefüllt, PLZ gültig und Datenschutz akzeptiert
            submitButton.disabled = !(spendenArt && zielRegion && strasse && plzValid && ort && datenschutzAkzeptiert);
        } else {
            // Bei Abgabe an der Geschäftsstelle nur prüfen, ob Art der Kleidung und Zielregion angegeben wurden, sowie Datenschutz akzeptiert
            submitButton.disabled = !(spendenArt && zielRegion && datenschutzAkzeptiert);
        }
    }
    
    // Initial prüfen
    checkFormCompletion();

    // Zeigt Pop-up-Fenster an, wenn das Spendenformular erfolgreich abgeschickt wurde
    document.getElementById('spendenForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Spendendaten für die Zusammenfassung sammeln
        var spendenArt = document.getElementById('spendenArt').value;
        var zielRegionElement = document.getElementById('zielRegion');
        var zielRegionText = zielRegionElement.options[zielRegionElement.selectedIndex].text;
        var lieferOptionElement = document.getElementById('lieferOption');
        var lieferOptionText = lieferOptionElement.options[lieferOptionElement.selectedIndex].text;
        
        // Datum und Uhrzeit formatieren
        var now = new Date();
        var dateTimeStr = now.toLocaleDateString() + ' um ' + now.toLocaleTimeString();
        
        // Zusammenfassung der Spende
        document.getElementById('summary-art').textContent = spendenArt;
        document.getElementById('summary-zielregion').textContent = zielRegionText;
        document.getElementById('summary-lieferoption').textContent = lieferOptionText;
        document.getElementById('summary-datetime').textContent = dateTimeStr;
        
        // Bei Abholung auch die Adresse anzeigen, wo das Sammlerfahrzeug die Spende abholt
        if (lieferOptionElement.value === 'abholung') {
            var strasse = document.getElementById('strasse').value;
            var plz = document.getElementById('plz').value;
            var ort = document.getElementById('ort').value;
            document.getElementById('summary-adresse').textContent = strasse + ', ' + plz + ' ' + ort;
            document.getElementById('summary-adresse-container').style.display = 'list-item';
        } else {
            document.getElementById('summary-adresse-container').style.display = 'none';
        }

        var successPopup = new bootstrap.Modal(document.getElementById('successPopup'));
        successPopup.show();

        // Redirect auf Startseite nach 10 Sekunden
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 10000);
    });
});