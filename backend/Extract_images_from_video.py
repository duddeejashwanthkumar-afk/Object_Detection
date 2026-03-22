import cv2
import os

video_path = "Video_Project.mp4"   # your video file
output_folder = "frames"

os.makedirs(output_folder, exist_ok=True)

cap = cv2.VideoCapture(video_path)

frame_count = 0
save_count = 0
interval = 15   # save every 5th frame (important)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_count % interval == 0:
        filename = os.path.join(output_folder, f"frame_{save_count}.jpg")
        cv2.imwrite(filename, frame)
        save_count += 1

    frame_count += 1

cap.release()

print(f"Extracted {save_count} frames")