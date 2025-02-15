import cv2
from deepface import DeepFace

# Open webcam
video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    # Recognize face using DeepFace
    try:
        result = DeepFace.find(img_path=frame, db_path="images", enforce_detection=False)
        if len(result) > 0 and not result[0].empty:
            name = result[0]["identity"].iloc[0].split("/")[-2]  # Extract folder name (VIP/Criminal)
        else:
            name = "Unknown"
    except:
        name = "Unknown"

    # Display name on frame
    cv2.putText(frame, name, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Face Recognition", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
video_capture.release()
cv2.destroyAllWindows()
