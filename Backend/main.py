from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from src.Routes.guess_routes import guess_routes
from src.SocketIO.socket_instance import socketio  # ⬅️ import from new module

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://llm-wars.vercel.app"], supports_credentials=True)

# Attach app to socketio AFTER Flask app setup
socketio.init_app(app, cors_allowed_origins="*")  # Allow all CORS for sockets in production

# Register routes
app.register_blueprint(guess_routes, url_prefix="/api")

# Import socket handlers AFTER socketio is ready
import src.Controllers.socket_events  # ⬅️ Make sure this is AFTER socketio is initialized

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
