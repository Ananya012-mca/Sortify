import tensorflow as tf

model = tf.keras.models.load_model("waste_classification_model.h5")

val_data = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255
).flow_from_directory(
    "dataset/val",
    target_size=(224,224),
    batch_size=32,
    class_mode="categorical"
)

loss, accuracy = model.evaluate(val_data)
print(f"Validation Accuracy: {accuracy * 100:.2f}%")

