from flask_socketio import emit, join_room
from flask import request
from src.SocketIO.socket_instance import socketio  # ⬅️ import from new module
import random

room_image_indices = {} 
active_rooms = {}  # room_id: image_index



@socketio.on("create_room")
def handle_create_room(data):
    room_id = data.get("roomId")
    username = data.get("username")

    print(f"{username} created room {room_id}", flush=True)
    join_room(room_id)

    image_index = random.randint(0, 4)  
    active_rooms[room_id] = image_index

    emit("room_created", {
        "roomId": room_id,
        "username": username,
        "imageIndex": image_index,
    }, to=request.sid)


@socketio.on("join_room")
def handle_join_room(data):
    room_id = data.get("roomId")
    username = data.get("username")

    if room_id not in active_rooms:
        emit("error_join", {"message": "❌ Invalid Room ID"}, to=request.sid)
        return

    join_room(room_id)
    image_index = active_rooms[room_id]

    emit("room_joined", {
        "roomId": room_id,
        "username": username,
        "imageIndex": image_index
    }, to=request.sid)


@socketio.on("game_won")
def handle_game_won(data):
    room_id = data.get("roomId")
    winner = data.get("winner")

    if not room_id or not winner:
        print("❌ Missing roomId or winner in game_won event")
        return

    print(f"🏁 Game won by {winner} in room {room_id}")

    # Notify everyone in the room that the game is over
    emit("game_over", {
        "winner": winner
    }, to=room_id)


@socketio.on("rematch")
def handle_rematch(data):
    room_id = data.get("roomId")

    if not room_id:
        return

    # Pick a new image
    new_image_index = random.randint(0, 4)
    active_rooms[room_id] = new_image_index

    print(f"🔁 Rematch started in room {room_id} with image {new_image_index}", flush=True)

    # Emit rematch event with new image to all users in room
    emit("rematch", {"imageIndex": new_image_index}, to=room_id)


