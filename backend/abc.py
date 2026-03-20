import numpy as np
from tensorflow.keras.layers import Input, LSTM, Embedding, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Data
eng = ["hello", "good morning"]
kan = ["ಹಲೋ", "ಶುಭೋದಯ"]

# Tokenizers
et, kt = Tokenizer(), Tokenizer()
et.fit_on_texts(eng)
kt.fit_on_texts(kan)

# Sequences
enc_in = pad_sequences(et.texts_to_sequences(eng))
dec_in = pad_sequences(kt.texts_to_sequences(kan))
dec_out = np.expand_dims(dec_in, -1)

# Encoder
enc_inputs = Input(shape=(None,))
enc_emb = Embedding(len(et.word_index)+1, 32)(enc_inputs)
_, state_h, state_c = LSTM(32, return_state=True)(enc_emb)

# Decoder
dec_inputs = Input(shape=(None,))
dec_emb = Embedding(len(kt.word_index)+1, 32)(dec_inputs)
dec_lstm = LSTM(32, return_sequences=True)
dec_outputs = dec_lstm(dec_emb, initial_state=[state_h, state_c])
dec_dense = Dense(len(kt.word_index)+1, activation="softmax")
dec_outputs = dec_dense(dec_outputs)

# Training model
model = Model([enc_inputs, dec_inputs], dec_outputs)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")

model.fit([enc_in, dec_in], dec_out, epochs=50, verbose=0)
print("Model trained successfully")

# Inference models
encoder_model = Model(enc_inputs, [state_h, state_c])

dec_state_h = Input(shape=(32,))
dec_state_c = Input(shape=(32,))
dec_states_inputs = [dec_state_h, dec_state_c]

dec_inf_outputs = dec_lstm(dec_emb, initial_state=dec_states_inputs)
dec_inf_outputs = dec_dense(dec_inf_outputs)
decoder_model = Model(
    [dec_inputs] + dec_states_inputs,
    dec_inf_outputs
)

# Translate function
index_to_word = {v: k for k, v in kt.word_index.items()}

def translate(text):
    seq = pad_sequences(et.texts_to_sequences([text]))
    h, c = encoder_model.predict(seq, verbose=0)
    target = np.zeros((1, 1))
    output = decoder_model.predict([target, h, c], verbose=0)
    word_id = np.argmax(output[0, -1])
    return index_to_word.get(word_id, "")

# Test
print("hello ->", translate("hello"))
print("good morning ->", translate("good morning"))
print("good->",translate("good"))