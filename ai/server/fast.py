import cv2
import uvicorn
import numpy as np
import threading
from fastapi import FastAPI
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from ultralytics import YOLO

# Initialize both servers
fastapi_app = FastAPI()
flask_app = Flask(__name__)
socketio = SocketIO(flask_app, cors_allowed_origins="*")

# Load YOLO models
people_model = YOLO("yolov8n.pt")  # Fast model for people detection
object_model = YOLO("yolov8x.pt")  # More powerful model for object detection

# Initialize webcam
cap = cv2.VideoCapture(0)

@fastapi_app.get("/detect")
def detect_people():
    """Detects people from the webcam in real time."""
    ret, frame = cap.read()
    if not ret:
        return {"error": "Failed to capture image from webcam"}

    results = people_model(frame)

    # Count people (Class ID 0 = 'person')
    person_count = sum(1 for obj in results[0].boxes.cls if int(obj) == 0)

    # Display results on frame
    cv2.putText(frame, f"People Count: {person_count}", (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("People Counting", frame)
    cv2.waitKey(1)  # Process frame quickly

    return {"people_count": person_count}

@flask_app.route("/detect", methods=["POST"])
def detect_objects():
    """Detects objects from uploaded images and sends alerts for weapons."""
    file = request.files["image"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    results = object_model(img)
    detections = []

    for result in results:
        for box in result.boxes:
            label = result.names[int(box.cls)]
            confidence = float(box.conf[0])
            detections.append({"label": label, "confidence": confidence})

    print("Detected Objects:", detections)  # Debugging

    # Send alert if weapon detected
    for obj in detections:
        if obj["label"] in ["knife", "gun", "weapon", "blade", "firearm"]:
            alert_message = {"message": f"🚨 {obj['label'].capitalize()} Detected! 🚨"}
            print("Sending alert:", alert_message)
            socketio.emit("receive-alert", alert_message)

    return jsonify(detections)

def run_fastapi():
    """Runs FastAPI for real-time people detection."""
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8000)

def run_flask():
    """Runs Flask-SocketIO for object detection and alerts."""
    socketio.run(flask_app, host="0.0.0.0", port=5001, debug=True)

if __name__ == "__main__":
    # Start both servers in parallel threads
    threading.Thread(target=run_fastapi).start()
    threading.Thread(target=run_flask).start()
