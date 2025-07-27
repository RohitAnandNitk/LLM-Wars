from flask import Blueprint, request, jsonify
from src.Controllers.guess_controller import get_guess

guess_routes = Blueprint("guess_routes", __name__)

@guess_routes.route("/guess", methods=["POST"])
def guess_company():
    print("Received request to guess company")
    data = request.get_json()
    message = data.get("message", "")
    model = data.get("model", "openai")
    print(f"Message: {message}, Model: {model}")
    guess = get_guess(message, model)
    return jsonify({"guess": guess})
