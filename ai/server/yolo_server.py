from flask import Flask, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow frontend connection

# Load YOLO model
model = YOLO("yolov8x.pt")  # Use a more powerful model

@app.route("/detect", methods=["POST"])
def detect_objects():
    file = request.files["image"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    results = model(img)
    detections = []

    for result in results:
        for box in result.boxes:
            label = result.names[int(box.cls)]
            confidence = float(box.conf[0])
            detections.append({"label": label, "confidence": confidence})

    print("Detected Objects:", detections)  # Debugging

    # Check for a weapon and send an alert if detected
    for obj in detections:
        if obj["label"] in ["knife", "gun", "weapon", "blade", "firearm"]:
            alert_message = {"message": f"🚨 {obj['label'].capitalize()} Detected! 🚨"}
            print("Sending alert:", alert_message)
            socketio.emit("receive-alert", alert_message)  # Send alert to frontend

    return jsonify(detections)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
