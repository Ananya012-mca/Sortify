import os
import shutil
import random

SOURCE_DIR = r"C:\Users\Administrator\Downloads\trashnet-master\trashnet-master\data\dataset-resized\dataset-resized"
DEST_DIR = "dataset"

CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
SPLIT_RATIO = 0.8  # 80% train, 20% val

for cls in CLASSES:
    src = os.path.join(SOURCE_DIR, cls)
    images = os.listdir(src)
    random.shuffle(images)

    split_point = int(len(images) * SPLIT_RATIO)

    train_imgs = images[:split_point]
    val_imgs = images[split_point:]

    for img in train_imgs:
        shutil.copy(
            os.path.join(src, img),
            os.path.join(DEST_DIR, "train", cls, img)
        )

    for img in val_imgs:
        shutil.copy(
            os.path.join(src, img),
            os.path.join(DEST_DIR, "val", cls, img)
        )

print("✅ Dataset split completed successfully!")
