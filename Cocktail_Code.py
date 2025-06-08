import serial
import time
import glob

class SimplifiedArduinoController:
    def __init__(self, port=None, baudrate=9600):
        self.baudrate = baudrate
        self.ser = None
        self.connected = False
        self.pump_states = [False]*10
        self.emergency = False
        if port is None:
            # Automatische Suche nach typischen Arduino-Ports
            possible_ports = glob.glob('/dev/ttyACM*') + glob.glob('/dev/ttyUSB*')
            if possible_ports:
                self.port = possible_ports[0]
                print(f"Automatisch gefundenen Port verwendet: {self.port}")
            else:
                self.port = '/dev/ttyUSB0'  # Fallback
                print("Kein Arduino-Port gefunden, Standard-Port wird verwendet.")
        else:
            self.port = port
        self.connect()

    def connect(self):
        try:
            self.ser = serial.Serial(self.port, self.baudrate, timeout=2)
            self.connected = True
            print(f"Arduino verbunden an {self.port} @ {self.baudrate}")
        except Exception as e:
            print(f"Fehler beim Verbinden: {e}")
            self.connected = False

    def send_command(self, cmd):
        if not self.connected or not self.ser:
            return "Nicht verbunden"
        try:
            self.ser.write((cmd + '\n').encode())
            time.sleep(0.1)
            response = self.ser.readline().decode().strip()
            return response or "OK"
        except Exception as e:
            return f"Fehler: {e}"

    def turn_on_pump(self, pump_id):
        if 1 <= pump_id <= 10:
            resp = self.send_command(f"ON {pump_id}")
            self.pump_states[pump_id-1] = True
            return resp
        return "Ungültige Pumpen-ID"

    def turn_off_pump(self, pump_id):
        if 1 <= pump_id <= 10:
            resp = self.send_command(f"OFF {pump_id}")
            self.pump_states[pump_id-1] = False
            return resp
        return "Ungültige Pumpen-ID"

    def pump_with_timer(self, pump_id, duration):
        if 1 <= pump_id <= 10:
            resp = self.send_command(f"TIMER {pump_id} {duration}")
            self.pump_states[pump_id-1] = True
            time.sleep(min(duration, 2))
            self.pump_states[pump_id-1] = False
            return resp
        return "Ungültige Pumpen-ID"

    def stop_all_pumps(self):
        resp = self.send_command("ALL_OFF")
        self.pump_states = [False]*10
        return resp

    def emergency_stop(self):
        resp = self.send_command("EMERGENCY_STOP")
        self.emergency = True
        self.pump_states = [False]*10
        return resp

    def emergency_reset(self):
        resp = self.send_command("EMERGENCY_RESET")
        self.emergency = False
        return resp

    def get_status(self):
        return {
            'connected': self.connected,
            'pump_states': self.pump_states,
            'emergency': self.emergency
        }
