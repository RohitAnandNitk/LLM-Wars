from flask import Blueprint, request, jsonify
from src.Controllers.guess_controller import get_guess , check_clue_fairness
import asyncio
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


@guess_routes.route("/check_clue", methods=["POST"])
def check_clue():
    data = request.get_json()
    clue = data.get("clue")
    company = data.get("company")
    model = data.get("model")
    print(f"Checking clue fairness: {clue} for company: {company} using model: {model}")
    if not clue or not company:
        return jsonify({"error": "Missing clue or company"}), 400

    try:
        is_fair = check_clue_fairness(clue, company, model)
        return jsonify({"fair": is_fair})
    except Exception as e:
        print("❌ Clue verification failed:", e)
        return jsonify({"error": "Clue verification failed"}), 500