from ultralytics import YOLO
import os

model_path = r"c:\Users\kalgi\OneDrive\Desktop\CrowdShield-main\model\vision-model\yolov8n.pt"

if os.path.exists(model_path):
    print(f"Loading model: {model_path}")
    model = YOLO(model_path)
    print("Classes:", model.names)
else:
    print(f"Model not found at {model_path}")
