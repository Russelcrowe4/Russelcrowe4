# 🍹 Ultimate AI Cocktailmaschine v7.0

**Produktionsreife, KI-gesteuerte Cocktailmaschine für Raspberry Pi 4 + Arduino Mega (10 Pumpen)**

---

## Features
- Moderne Web-GUI (Touch-optimiert, On-Screen-Keyboard, Modals, Banner, Navigation)
- Flask-Backend mit API für Pumpensteuerung, KI-Cocktail-Generator und Hardwareintegration
- Flexibles Pumpen-Mapping (10 Pumpen, Zutaten frei zuweisbar)
- KI-Logik für neue Rezepte, Empfehlungen, Trend-Analyse
- Vollständige Datenbank: Zutaten, Rezepte, Mapping
- Logging, Monitoring, System-Status, Notfall-Stopp
- Raspberry Pi 4 (2GB RAM ausreichend), Arduino Mega 2560

---

## Hardware
- **Raspberry Pi 4** (2GB RAM oder mehr)
- **Arduino Mega 2560** (USB an Pi)
- **10x Peristaltik-Pumpen 12V DC**
- **10-Kanal Relais-Modul** (Pins 22-31)
- **12V 12A Netzteil**
- **Notfall-Button** (Pin 2)
- **7" Touchscreen** (optional)

---

## Installation (automatisch)

1. **Projekt auf den Pi kopieren**
   ```bash
   git clone <repo-url> ~/cocktailmaschine
   cd ~/cocktailmaschine
   ```
2. **Installationsskript ausführen**
   ```bash
   chmod +x install_and_run.sh
   ./install_and_run.sh
   ```
   - Das Skript installiert alle Abhängigkeiten, richtet Python ein, flasht den Arduino Mega automatisch und startet Backend & Webserver.
   - Die Datei `Cocktail-Code` enthält den Arduino-Sketch und wird automatisch extrahiert.

3. **Weboberfläche öffnen**
   - Im Browser: `http://<raspberrypi-ip>:8080/index.html`

---

## Manuelle Installation (optional)

1. System vorbereiten:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3 python3-pip python3-venv git curl unzip
   ```
2. Python-Umgebung:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install flask flask-cors pyserial
   ```
3. Arduino CLI installieren und Sketch flashen:
   ```bash
   curl -fsSL https://downloads.arduino.cc/arduino-cli/arduino-cli_latest_Linux_ARMv7.tar.gz | tar xz
   sudo mv arduino-cli /usr/local/bin/
   arduino-cli core update-index
   arduino-cli core install arduino:avr
   # Sketch extrahieren und flashen (siehe install_and_run.sh)
   ```
4. Backend starten:
   ```bash
   source venv/bin/activate
   python3 backend.py
   ```
5. Webserver starten:
   ```bash
   python3 -m http.server 8080
   ```

---

## Nutzung
- Web-GUI aufrufen, Cocktails auswählen, Pumpen steuern, KI nutzen
- Systemstatus, Logs und Hardware live überwachen
- Notfall-Stopp jederzeit möglich

---

## Entwickler
- Frontend: `index.html`, `style.css`, `app.js`
- Backend: `backend.py`, `Cocktail-Code` (Arduino & Python)
- Daten: `ingredients.json`, `cocktail_recipes_full.json`, `pump_mapping.json`

---

## Lizenz & Kontakt
- (c) 2025 Russelcrowe4
- Für private und Forschungszwecke
- Kontakt: GitHub @Russelcrowe4

---

## Cybersicherheit
- **Netzwerkzugriff:** Web-UI und Backend sind standardmäßig nur im lokalen Netzwerk erreichbar. Für Internetzugriff Firewall und VPN nutzen.
- **API-Schutz:** Kritische Endpunkte (z.B. Pumpensteuerung) sollten im Produktivbetrieb mit Authentifizierung (Token, Passwort) geschützt werden.
- **Firewall & Ports:** Öffne nur die nötigen Ports (z.B. 8080 für Web, 5000 für API) und beschränke Zugriffe per Firewall (`ufw` oder Router).
- **Reverse Proxy & HTTPS:** Für Internetzugriff Reverse Proxy (z.B. nginx) mit HTTPS-Zertifikat (Let's Encrypt) nutzen, um die Kommunikation zu verschlüsseln.
- **VPN:** Für Fernzugriff auf die Maschine immer VPN bevorzugen (z.B. WireGuard, OpenVPN), niemals ungeschützt ins Internet stellen.
- **Updates:** System, Python-Pakete und Arduino-Sketch regelmäßig aktualisieren.
- **Physische Sicherheit:** Notfall-Button und Hardwarezugang absichern, Pi und Arduino vor Manipulation schützen.
- **Logs & Monitoring:** System- und Fehler-Logs regelmäßig prüfen, ungewöhnliche Aktivitäten erkennen.
