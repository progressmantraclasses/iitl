import cv2
import os
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("yolov8n.pt")  # Pretrained YOLOv8 model
# Path to downloaded images
image_folder = "people_images"
# Process each image
for subfolder in os.listdir(image_folder):  # Loop through each category folder
    folder_path = os.path.join(image_folder, subfolder)
    if os.path.isdir(folder_path):
        for image_file in os.listdir(folder_path):
            image_path = os.path.join(folder_path, image_file)
            # Load image
            image = cv2.imread(image_path)
            # Run YOLOv8 detection
            results = model(image)

            # Count people (Class ID 0 is for 'person')
            person_count = sum(1 for obj in results[0].boxes.cls if int(obj) == 0)

            # Display results
            cv2.putText(image, f"People Count: {person_count}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow("People Counting", image)
            cv2.waitKey(1000)  # Display each image for 1 second

            print(f"👥 {image_file}: {person_count} people detected.")

cv2.destroyAllWindows()
