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

    # Broadcast to all in the room
    emit("game_over", {
        "winner": winner
    }, to=room_id)


