from ultralytics import YOLO
import os

class WeaponDetector:
    def __init__(self, model_path=None):
        """
        Initialize the WeaponDetector model.
        
        Args:
            model_path (str): Path to the YOLO weights file. 
                              If None, defaults to the specific path provided.
        """
        if model_path is None:
            # Construct absolute path to the weights
            current_dir = os.path.dirname(os.path.abspath(__file__))
            custom_path = os.path.join(current_dir, 'Weapons-and-Knives-Detector-with-YOLOv8', 'runs', 'detect', 'Normal', 'weights', 'best.pt')
            
            if os.path.exists(custom_path):
                model_path = custom_path
            else:
                print(f"Warning: Custom weapon detection model not found at {custom_path}")
                print("Falling back to standard 'yolov8n.pt'. Note: This will not be specialized for weapons.")
                model_path = "yolov8n.pt"

        print(f"Loading Weapon Detection Model from: {model_path}")
        self.model = YOLO(model_path)
        
    def detect(self, frame, conf_threshold=0.4):
        """
        Detect weapons in a frame.

        Args:
            frame (numpy.ndarray): Input image/frame.
            conf_threshold (float): Confidence threshold for detection.

        Returns:
            list: List of detections.
        """
        # Run inference
        results = self.model(frame, verbose=False)
        
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                conf = float(box.conf[0])
                
                if conf >= conf_threshold:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    cls_id = int(box.cls[0])
                    label = self.model.names[cls_id]
                    
                    detections.append({
                        "bbox": [x1, y1, x2, y2],
                        "confidence": conf,
                        "class_id": cls_id,
                        "label": label
                    })
        
        return detections
