import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# -----------------------------
# Configuration
# -----------------------------
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10   # 10 is enough for >70%

# -----------------------------
# Data Generators
# -----------------------------
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

val_gen = ImageDataGenerator(rescale=1./255)

train_data = train_gen.flow_from_directory(
    "dataset/train",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_data = val_gen.flow_from_directory(
    "dataset/val",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

# -----------------------------
# MobileNetV2 Base Model
# -----------------------------
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Freeze base model
base_model.trainable = False

# -----------------------------
# Custom Classification Head
# -----------------------------
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
output = Dense(train_data.num_classes, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

# -----------------------------
# Compile
# -----------------------------
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# -----------------------------
# Train
# -----------------------------
model.fit(
    train_data,
    epochs=EPOCHS,
    validation_data=val_data
)

# -----------------------------
# Save Model
# -----------------------------
model.save("waste_classification_model.h5")
print("✅ MobileNet model trained and saved!")
