// app.js - ausgelagertes JavaScript aus html

// Navigation: Seitenwechsel
const navItems = document.querySelectorAll('.nav-item');
const pageContents = document.querySelectorAll('.page-content');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Navigation aktiv setzen
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // Seiteninhalt wechseln
        const page = item.getAttribute('data-page');
        pageContents.forEach(pc => {
            if (pc.id === page) {
                pc.classList.add('active');
            } else {
                pc.classList.remove('active');
            }
        });
        // Menü schließen (bei mobiler Ansicht)
        closeNav();
    });
});

// Overlay/Sidebar öffnen/schließen
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

function openNav() {
    navMenu.classList.add('open');
    navOverlay.classList.add('active');
}
function closeNav() {
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
}
if (menuBtn) menuBtn.addEventListener('click', openNav);
if (navClose) navClose.addEventListener('click', closeNav);
if (navOverlay) navOverlay.addEventListener('click', closeNav);

// Banner schließen
const bannerClose = document.getElementById('bannerClose');
const systemBanner = document.getElementById('systemBanner');
if (bannerClose && systemBanner) {
    bannerClose.addEventListener('click', () => {
        systemBanner.style.display = 'none';
    });
}

// Dummy-Handler für Header-Buttons
const emergencyBtn = document.getElementById('emergencyBtn');
const statusBtn = document.getElementById('statusBtn');
const logoutBtn = document.getElementById('logoutBtn');

if (emergencyBtn) emergencyBtn.addEventListener('click', () => {
    alert('🚨 Notfall-Stopp ausgelöst! (Demo)');
});
if (statusBtn) statusBtn.addEventListener('click', () => {
    alert('📊 Systemstatus anzeigen (Demo)');
});
if (logoutBtn) logoutBtn.addEventListener('click', () => {
    alert('🚪 Logout (Demo)');
});

// Initialisierung: Ladebildschirm ausblenden
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.style.display = 'none';
});

// --- Pumpensteuerung: API-Integration ---
// Globale Konstante für API-Token (muss mit backend.py übereinstimmen)
const API_TOKEN = "CHANGE_ME_SECURE_TOKEN";

// Hilfsfunktion für API-Requests mit Token
async function apiRequest(url, options = {}) {
    if (!options.headers) options.headers = {};
    options.headers['X-API-Token'] = API_TOKEN;
    return fetch(url, options);
}

async function initializeAllPumps() {
    showBanner('Alle Pumpen werden initialisiert...');
    try {
        // Beispiel: Alle Pumpen nacheinander einschalten (ID 1-10)
        for (let i = 1; i <= 10; i++) {
            await apiRequest(`/api/pump_on/${i}`, { method: 'POST' });
            await new Promise(r => setTimeout(r, 200)); // kleine Pause
            await apiRequest(`/api/pump_off/${i}`, { method: 'POST' });
        }
        showBanner('✅ Alle Pumpen initialisiert!');
    } catch (e) {
        showBanner('❌ Fehler bei Initialisierung!');
    }
}

async function calibrateAllPumps() {
    showBanner('Alle Pumpen werden kalibriert...');
    try {
        // Beispiel: Jede Pumpe für 2 Sekunden laufen lassen
        for (let i = 1; i <= 10; i++) {
            await apiRequest(`/api/pump_timer/${i}/2`, { method: 'POST' });
            await new Promise(r => setTimeout(r, 2200));
        }
        showBanner('✅ Kalibrierung abgeschlossen!');
    } catch (e) {
        showBanner('❌ Fehler bei Kalibrierung!');
    }
}

async function testAllPumps() {
    showBanner('Pumpen-Test läuft...');
    try {
        // Beispiel: Alle Pumpen kurz einschalten
        for (let i = 1; i <= 10; i++) {
            await apiRequest(`/api/pump_on/${i}`, { method: 'POST' });
            await new Promise(r => setTimeout(r, 500));
            await apiRequest(`/api/pump_off/${i}`, { method: 'POST' });
        }
        showBanner('✅ Pumpen-Test abgeschlossen!');
    } catch (e) {
        showBanner('❌ Fehler beim Pumpen-Test!');
    }
}

async function emergencyStopAllPumps() {
    showBanner('🛑 Notfall-Stopp wird ausgeführt...');
    try {
        await apiRequest('/api/emergency_stop', { method: 'POST' });
        showBanner('🛑 Alle Pumpen gestoppt!');
    } catch (e) {
        showBanner('❌ Fehler beim Notfall-Stopp!');
    }
}

// Hilfsfunktion: Banner anzeigen
function showBanner(msg) {
    const banner = document.getElementById('systemBanner');
    const text = document.getElementById('bannerText');
    if (banner && text) {
        text.textContent = msg;
        banner.style.display = 'block';
    }
}

// Virtuelle Tastatur (On-Screen Keyboard) für Touchscreen
// Minimalistisches Keyboard-Overlay für alle .form-control[type=text], [type=number], [type=password]

let keyboardOverlay = null;
let currentInput = null;

function createKeyboard() {
    if (keyboardOverlay) return;
    keyboardOverlay = document.createElement('div');
    keyboardOverlay.className = 'onscreen-keyboard';
    keyboardOverlay.innerHTML = `
        <div class="keyboard-row">
            <button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button><button>7</button><button>8</button><button>9</button><button>0</button>
        </div>
        <div class="keyboard-row">
            <button>Q</button><button>W</button><button>E</button><button>R</button><button>T</button><button>Z</button><button>U</button><button>I</button><button>O</button><button>P</button>
        </div>
        <div class="keyboard-row">
            <button>A</button><button>S</button><button>D</button><button>F</button><button>G</button><button>H</button><button>J</button><button>K</button><button>L</button><button>ß</button>
        </div>
        <div class="keyboard-row">
            <button>Y</button><button>X</button><button>C</button><button>V</button><button>B</button><button>N</button><button>M</button><button>,</button><button>.</button><button>-</button>
        </div>
        <div class="keyboard-row">
            <button class="keyboard-btn-wide" data-action="space">Leertaste</button>
            <button class="keyboard-btn-wide" data-action="backspace">←</button>
            <button class="keyboard-btn-wide" data-action="close">Schließen</button>
        </div>
    `;
    document.body.appendChild(keyboardOverlay);
    keyboardOverlay.addEventListener('mousedown', e => e.preventDefault());
    keyboardOverlay.addEventListener('touchstart', e => e.preventDefault());
    keyboardOverlay.addEventListener('click', onKeyboardClick);
}

function showKeyboard(input) {
    createKeyboard();
    keyboardOverlay.style.display = 'block';
    currentInput = input;
    // Positionierung unten mittig
    keyboardOverlay.style.position = 'fixed';
    keyboardOverlay.style.left = '50%';
    keyboardOverlay.style.bottom = '0';
    keyboardOverlay.style.transform = 'translateX(-50%)';
    keyboardOverlay.style.zIndex = 5000;
}

function hideKeyboard() {
    if (keyboardOverlay) keyboardOverlay.style.display = 'none';
    currentInput = null;
}

function onKeyboardClick(e) {
    if (!currentInput) return;
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'space') {
        currentInput.value += ' ';
    } else if (action === 'backspace') {
        currentInput.value = currentInput.value.slice(0, -1);
    } else if (action === 'close') {
        hideKeyboard();
    } else {
        currentInput.value += btn.textContent;
    }
    currentInput.dispatchEvent(new Event('input'));
}

// Automatisch Tastatur bei Fokus auf Textfeld anzeigen
function enableOnScreenKeyboard() {
    document.querySelectorAll('.form-control[type="text"], .form-control[type="number"], .form-control[type="password"], input[type="text"], input[type="number"], input[type="password"]')
        .forEach(input => {
            input.addEventListener('focus', () => showKeyboard(input));
            input.addEventListener('blur', () => setTimeout(hideKeyboard, 200));
        });
}
window.addEventListener('DOMContentLoaded', enableOnScreenKeyboard);

// --- KI-Cocktail-Generator: Demo-Modus für JSFiddle/ohne Backend ---
async function generateAIRecipe() {
    // Prüfe, ob Backend erreichbar ist (optional, für Demo immer Dummy)
    // Demo-Objekt:
    const demoCocktail = {
        name: "Demo AI Creation",
        category: "AI-Kreation",
        alcohol: true,
        ingredients: [
            {name: "Gin", amount: 40, unit: "ml"},
            {name: "Limettensaft", amount: 20, unit: "ml"},
            {name: "Tonic Water", amount: 100, unit: "ml"}
        ]
    };
    showCocktailModal(demoCocktail);
}

function showCocktailModal(cocktail) {
    // Modal-Container erzeugen
    let modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.innerHTML = `
        <div class="modal">
            <h2 style="color: var(--ai-cyan); margin-top:0;">🍹 ${cocktail.name}</h2>
            <div style="margin-bottom:1em; color:var(--text-muted);">Kategorie: ${cocktail.category} ${cocktail.alcohol ? '| Alkoholisch' : '| Alkoholfrei'}</div>
            <ul style="margin-bottom:1.2em;">
                ${cocktail.ingredients.map(i => `<li>${i.amount} ${i.unit} ${i.name}</li>`).join('')}
            </ul>
            <button class="action-btn ai full-width" onclick="this.closest('.modal-container').remove()">Schließen</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });
}

// --- Push-Benachrichtigungen für kritische Zutaten ---
// Service Worker für Push registrieren
if ('serviceWorker' in navigator) {
    window.addEventListener('DOMContentLoaded', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Service Worker registriert:', reg);
        }).catch(err => {
            console.warn('Service Worker Fehler:', err);
        });
    });
}

// Berechtigung für Benachrichtigungen anfragen
async function requestNotificationPermission() {
    if ('Notification' in window) {
        let perm = Notification.permission;
        if (perm === 'default') {
            perm = await Notification.requestPermission();
        }
        return perm === 'granted';
    }
    return false;
}

// Funktion: Push-Benachrichtigung anzeigen
async function notifyCriticalIngredient(ingredientName) {
    const granted = await requestNotificationPermission();
    if (!granted) return;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification('Zutat kritisch!', {
                body: `Die Zutat "${ingredientName}" ist fast leer!`,
                icon: 'https://cdn-icons-png.flaticon.com/512/2738/2738897.png',
                vibrate: [200, 100, 200],
                tag: 'critical-ingredient'
            });
        });
    } else {
        new Notification('Zutat kritisch!', {
            body: `Die Zutat "${ingredientName}" ist fast leer!`
        });
    }
}
// Beispiel: notifyCriticalIngredient('Gin');

// Platzhalter für weitere Funktionen (z.B. Toasts, Modals)
// ...
