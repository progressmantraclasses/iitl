from flask import Flask, request, jsonify
import cv2
import numpy as np
from ultralytics import YOLO
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="https://safecrowd.vercel.app")  # Allow frontend connection

# Load YOLO model
model = YOLO("yolov8n.pt")  # Use YOLOv8 Nano (lighter model)

@app.route("/detect", methods=["POST"])
def detect_objects():
    file = request.files["image"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    results = model(img)
    detections = []
    person_count = 0
    weapon_detected = False

    for result in results:
        for box in result.boxes:
            label = result.names[int(box.cls)]
            confidence = float(box.conf[0])
            detections.append({"label": label, "confidence": confidence})
            
            # Count persons in the image
            if label == "person":
                person_count += 1
                
            
            # Check if a weapon is detected
            if label in ["knife", "gun", "weapon", "blade", "firearm"]:
                weapon_detected = True
    
    print("Detected Objects:", detections)  # Debugging
    print("Total Persons Detected:", person_count)  # Debugging
    
    if person_count > 0:
        alert_message = {
            "person_count": person_count
        }
        print("Sending alert:", alert_message)
        socketio.emit("receive-alert", alert_message) 

    # Send an alert if a weapon is detected
    if weapon_detected:
        alert_message = {
            "message": "🚨  Weapon Detected! 🚨",
            "person_count": person_count
        }
        print("Sending alert:", alert_message)
        socketio.emit("receive-alert", alert_message)  # Send alert to frontend
    
    # Always return person count even if no weapon is detected
    return jsonify({"detections": detections, "person_count": person_count})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5001, debug=True)
