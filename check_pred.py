import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import DepthwiseConv2D

class CustomDepthwiseConv2D(DepthwiseConv2D):
    def __init__(self, **kwargs):
        if 'groups' in kwargs:
            kwargs.pop('groups')
        super().__init__(**kwargs)

model_path=os.path.join(r'd:\Projects\waste_classification_ml\waste_classification_ml\backend','waste_classification_model.h5')
model=load_model(model_path, custom_objects={'DepthwiseConv2D': CustomDepthwiseConv2D})
print('output shape', model.output_shape)
x=np.random.rand(1,224,224,3)
pred=model.predict(x)
print('pred sum',pred.sum(), 'pred', pred)
