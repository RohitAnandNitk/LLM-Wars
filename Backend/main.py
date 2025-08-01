from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from src.Routes.guess_routes import guess_routes
from src.SocketIO.socket_instance import socketio  # ⬅️ import from new module

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://llm-wars.vercel.app"], supports_credentials=True)

# Attach app to socketio AFTER Flask app setup
socketio.init_app(app)

# Register routes
app.register_blueprint(guess_routes, url_prefix="/api")

# Import socket handlers AFTER socketio is ready
import src.Controllers.socket_events  # ⬅️ Make sure this is AFTER socketio is initialized

if __name__ == "__main__":
    socketio.run(app, debug=True)
