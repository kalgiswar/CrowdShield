import os
import requests
from pathlib import Path

# Configuration
RECORDINGS_DIR = Path(r"c:\Users\kalgi\OneDrive\Desktop\CrowdShield-main\model\vision-model\recordings")
SESSION_API_URL = "http://localhost:8002/upload"
CAMERA_ID = "cam1"
LATITUDE = "0.0"
LONGITUDE = "0.0"

def restore_incidents():
    if not RECORDINGS_DIR.exists():
        print(f"Recordings directory not found: {RECORDINGS_DIR}")
        return

    # Find Fire videos
    videos = sorted(list(RECORDINGS_DIR.glob("Fire_*.mp4")), reverse=True)
    
    # Process only the last 5 to avoid flooding (or all if user wants, but let's stick to recent)
    # User said "really a fire accedent", implies checking specific ones. Let's do top 5.
    videos_to_process = videos[:5]
    
    print(f"Found {len(videos)} Fire videos. Restoring last {len(videos_to_process)}...")

    for video_path in videos_to_process:
        print(f"Restoring {video_path.name}...")
        
        # Infer severity/confidence (Mocking since we don't have the original inference result)
        severity = "Critical"
        confidence = "High (Restored)"
        description = f"Security Alert: Fire detected! (Restored)"

        try:
            with open(video_path, 'rb') as f:
                files = {'file': (video_path.name, f, 'video/mp4')}
                data = {
                    'description': description,
                    'notify_to': 'admin,security',
                    'camera_id': CAMERA_ID,
                    'latitude': LATITUDE,
                    'longitude': LONGITUDE,
                    'severity': severity,
                    'confidence': confidence
                }
                
                print(f"Sending request to {SESSION_API_URL}...")
                response = requests.post(SESSION_API_URL, files=files, data=data)
                
                if response.status_code == 200:
                    print(f"Successfully restored session for {video_path.name}")
                else:
                    print(f"Failed to restore session. Status: {response.status_code}, Response: {response.text}")
                    
        except Exception as e:
            print(f"Error sending to Crowd Shield API: {e}")

if __name__ == "__main__":
    restore_incidents()
