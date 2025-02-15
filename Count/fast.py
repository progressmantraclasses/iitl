import cv2
import numpy as np
import asyncio
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from socketio import AsyncServer, ASGIApp

# Initialize FastAPI
app = FastAPI()

# Initialize Socket.IO
sio = AsyncServer(cors_allowed_origins="*")
socket_app = ASGIApp(sio, app)

# Load YOLO models
people_model = YOLO("yolov8n.pt")  # Fast model for people detection
object_model = YOLO("yolov8x.pt")  # More powerful model for object detection

# Initialize webcam
cap = cv2.VideoCapture(0)

@app.get("/detect")
async def detect_people():
    """Detects people from the webcam in real time."""
    ret, frame = cap.read()
    if not ret:
        return JSONResponse({"error": "Failed to capture image from webcam"})

    results = people_model(frame)

    # Count people (Class ID 0 = 'person')
    person_count = sum(1 for obj in results[0].boxes.cls if int(obj) == 0)

    # Display results on frame
    cv2.putText(frame, f"People Count: {person_count}", (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("People Counting", frame)
    cv2.waitKey(1)  # Process frame quickly

    return JSONResponse({"people_count": person_count})

@app.post("/detect-image")
async def detect_objects(file: UploadFile = File(...)):
    """Detects objects from uploaded images and sends alerts for weapons."""
    contents = await file.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)

    results = object_model(img)
    detections = []

    for result in results:
        for box in result.boxes:
            label = result.names[int(box.cls)]
            confidence = float(box.conf[0])
            detections.append({"label": label, "confidence": confidence})

    print("Detected Objects:", detections)

    # Send alert if weapon detected
    for obj in detections:
        if obj["label"] in ["knife", "gun", "weapon", "blade", "firearm"]:
            alert_message = {"message": f"🚨 {obj['label'].capitalize()} Detected! 🚨"}
            print("Sending alert:", alert_message)
            await sio.emit("receive-alert", alert_message)

    return JSONResponse(detections)

# Run FastAPI with SocketIO
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
