import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# URL dataset
csv_url = 'https://raw.githubusercontent.com/Glucofy-Team/Glucofy-Machine-Learning/main/data/(modified)%20nutrition%20food%20dataset.csv'

# Load and preprocess the dataset (this part is usually done offline)
df = pd.read_csv(csv_url)

# Define functions to categorize glycemic index and glycemic load
def categorize_gi_new(gi):
    if gi <= 50:
        return 'Low'
    elif gi <= 70:
        return 'Medium'
    else:
        return 'High'

def categorize_gl_new(gl):
    if gl <= 9:
        return 'Low'
    elif gl <= 19:
        return 'Medium'
    else:
        return 'High'

# Create columns for glycemic index and glycemic load categories
df['gi_category'] = df['glycemic_index'].apply(categorize_gi_new)
df['gl_category'] = df['glycemic_load'].apply(categorize_gl_new)

# Split features and labels
X = df[['glycemic_index', 'glycemic_load']]
y_gi = df['gi_category']
y_gl = df['gl_category']

# Encode labels
label_encoder_gi = LabelEncoder()
y_gi_encoded = label_encoder_gi.fit_transform(y_gi)

label_encoder_gl = LabelEncoder()
y_gl_encoded = label_encoder_gl.fit_transform(y_gl)

# Split data
X_train, X_test, y_gi_train, y_gi_test = train_test_split(X, y_gi_encoded, test_size=0.2, random_state=42)
X_train, X_test, y_gl_train, y_gl_test = train_test_split(X, y_gl_encoded, test_size=0.2, random_state=42)

# Scale data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Create and train the glycemic index model
model_gi = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(2,)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])
model_gi.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model_gi.fit(X_train, y_gi_train, epochs=50, batch_size=32, validation_split=0.2)

# Evaluate glycemic index model
gi_loss, gi_accuracy = model_gi.evaluate(X_test, y_gi_test)
#print(f"Glycemic Index Model Accuracy: {gi_accuracy * 100:.2f}%")

# Create and train the glycemic load model
model_gl = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu', input_shape=(2,)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])
model_gl.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model_gl.fit(X_train, y_gl_train, epochs=50, batch_size=32, validation_split=0.2)

# Evaluate glycemic load model
gl_loss, gl_accuracy = model_gl.evaluate(X_test, y_gl_test)
print(f"Glycemic Load Model Accuracy: {gl_accuracy * 100:.2f}%")

def food_data(food_name):
    try:
        # Read the CSV file
        df = pd.read_csv(csv_url)

        # Search for the row that matches the input food name
        food_data = df[df['name'].str.lower() == food_name.lower()]

        # Check if the food data is found
        if not food_data.empty:
            # Convert the row to a dictionary
            food_data = food_data.to_dict(orient='records')[0]

            # Extract glycemic index and glycemic load
            glycemic_index = food_data['glycemic_index']
            glycemic_load = food_data['glycemic_load']

            # Prepare input for prediction
            new_data = np.array([[glycemic_index, glycemic_load]])
            new_data_scaled = scaler.transform(new_data)

            # Predict glycemic index category
            gi_new_prediction = model_gi.predict(new_data_scaled)
            gi_new_pred_class = np.argmax(gi_new_prediction, axis=1)
            gi_new_pred_label = label_encoder_gi.inverse_transform(gi_new_pred_class)

            # Predict glycemic load category
            gl_new_prediction = model_gl.predict(new_data_scaled)
            gl_new_pred_class = np.argmax(gl_new_prediction, axis=1)
            gl_new_pred_label = label_encoder_gl.inverse_transform(gl_new_pred_class)

            # Prepare the response in the desired format
            return {
                "food_name": food_data['name'],
                "g_index": glycemic_index,
                "g_load": glycemic_load,
                "gi_category": gi_new_pred_label[0],
                "gl_category": gl_new_pred_label[0],
                "calories": food_data['calories (kcal)'],
                "carbs": food_data['carbohydrates (g)'],
                "fats": food_data['fats (g)'],
                "proteins": food_data['proteins (g)'],
                "category": food_data['category']
            }
        else:
            # If food is not found, return a message
            return {"message": "Food not found"}
    except Exception as e:
        return {"error": str(e)}