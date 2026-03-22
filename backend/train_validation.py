import os
import shutil
import random

# your current folders
image_dir = "raw_annotation_data/images"
label_dir = "raw_annotation_data/labels"

# new folders
os.makedirs("dataset/images/train", exist_ok=True)
os.makedirs("dataset/images/val", exist_ok=True)
os.makedirs("dataset/labels/train", exist_ok=True)
os.makedirs("dataset/labels/val", exist_ok=True)

images = [f for f in os.listdir(image_dir) if f.endswith(".jpg")]
random.shuffle(images)

split_ratio = 0.8
split_index = int(len(images) * split_ratio)

train_images = images[:split_index]
val_images = images[split_index:]

def move_files(image_list, split):
    for img in image_list:
        label = img.replace(".jpg", ".txt")

        shutil.copy(os.path.join(image_dir, img), f"dataset/images/{split}/{img}")
        shutil.copy(os.path.join(label_dir, label), f"dataset/labels/{split}/{label}")

move_files(train_images, "train")
move_files(val_images, "val")

print("Dataset split completed successfully!")