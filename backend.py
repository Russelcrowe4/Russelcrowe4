from flask import Flask, request, jsonify
from flask_cors import CORS
from Cocktail_Code import SimplifiedArduinoController
import threading
import json
import random
from collections import defaultdict
from functools import wraps

app = Flask(__name__)
CORS(app)

# Arduino Controller initialisieren (Port ggf. anpassen)
arduino = SimplifiedArduinoController(port='/dev/ttyUSB0', baudrate=9600)

# Verbindung im Hintergrund aufbauen
threading.Thread(target=arduino.connect, daemon=True).start()

# Hilfsfunktion: Lade Zutaten und Rezepte
with open('ingredients.json', encoding='utf-8') as f:
    INGREDIENTS = json.load(f)
with open('cocktail_recipes_full.json', encoding='utf-8') as f:
    RECIPES = json.load(f)

# Erzeuge Wissensgraph: Zutaten-Ko-Vorkommen
co_occurrence = defaultdict(lambda: defaultdict(int))
for recipe in RECIPES:
    ingr_names = [i['name'] for i in recipe['ingredients']]
    for i in ingr_names:
        for j in ingr_names:
            if i != j:
                co_occurrence[i][j] += 1

def generate_new_cocktail():
    # 1. Wähle Basis (Spirituose oder Mixer)
    base = random.choice([i for i in INGREDIENTS if i['type'] in ['spirit', 'liqueur']])
    # 2. Wähle 2-4 weitere Zutaten, die oft mit der Basis vorkommen, aber noch keine bekannte Kombi sind
    candidates = sorted(co_occurrence[base['name']].items(), key=lambda x: -x[1])
    used = set([base['name']])
    new_ingredients = [base]
    for name, _ in candidates:
        if name not in used and len(new_ingredients) < random.randint(3,5):
            # Füge Zutat hinzu
            match = next((i for i in INGREDIENTS if i['name'] == name), None)
            if match:
                new_ingredients.append(match)
                used.add(name)
    # 3. Mengen heuristisch zuweisen
    result_ingredients = []
    for ingr in new_ingredients:
        if ingr['type'] == 'spirit':
            amount = random.randint(30, 50)
        elif ingr['type'] == 'liqueur':
            amount = random.randint(10, 30)
        elif ingr['type'] == 'mixer':
            amount = random.randint(40, 100)
        elif ingr['type'] == 'citrus':
            amount = random.randint(10, 30)
        elif ingr['type'] == 'sweetener':
            amount = random.randint(5, 20)
        else:
            amount = random.randint(5, 30)
        result_ingredients.append({'name': ingr['name'], 'amount': amount, 'unit': 'ml'})
    # 4. Name generieren
    name = f"AI Creation #{random.randint(1000,9999)}"
    return {'name': name, 'ingredients': result_ingredients, 'category': 'AI-Kreation', 'alcohol': any(i['type']=='spirit' for i in new_ingredients)}

API_TOKEN = "CHANGE_ME_SECURE_TOKEN"  # Sicheres Token setzen!

def require_api_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-API-Token')
        if token != API_TOKEN:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/pump_on/<int:pump_id>', methods=['POST'])
@require_api_token
def pump_on(pump_id):
    result = arduino.turn_on_pump(pump_id)
    return jsonify({'result': result})

@app.route('/api/pump_off/<int:pump_id>', methods=['POST'])
@require_api_token
def pump_off(pump_id):
    result = arduino.turn_off_pump(pump_id)
    return jsonify({'result': result})

@app.route('/api/pump_timer/<int:pump_id>/<int:duration>', methods=['POST'])
@require_api_token
def pump_timer(pump_id, duration):
    result = arduino.pump_with_timer(pump_id, duration)
    return jsonify({'result': result})

@app.route('/api/all_pumps_off', methods=['POST'])
@require_api_token
def all_pumps_off():
    result = arduino.stop_all_pumps()
    return jsonify({'result': result})

@app.route('/api/emergency_stop', methods=['POST'])
@require_api_token
def emergency_stop():
    result = arduino.emergency_stop()
    return jsonify({'result': result})

@app.route('/api/emergency_reset', methods=['POST'])
@require_api_token
def emergency_reset():
    result = arduino.emergency_reset()
    return jsonify({'result': result})

@app.route('/api/status', methods=['GET'])
def status():
    result = arduino.get_status()
    return jsonify({'result': result})

@app.route('/api/generate_cocktail', methods=['GET'])
def api_generate_cocktail():
    cocktail = generate_new_cocktail()
    return jsonify({'cocktail': cocktail})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
