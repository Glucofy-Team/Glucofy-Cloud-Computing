from flask import Flask, jsonify, request
from gi_model import predict_gi
from gl_model import predict_gl
import numpy as np  
from diabetes_gpt2 import hitGenAI

app = Flask(__name__)

@app.route('/', methods=['GET'])
def main():
    return jsonify({"message": "Welcome to Glucofy Machine Learning API! We apologize for it is not publicly accessible.",
})

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        if 'message' not in data:
            return jsonify({"error": "Missing 'message' in request data"}), 400
        
        message = data['message']

        replyAI = hitGenAI(message)

        # Return the AI reply in JSON format
        return jsonify({"reply": replyAI})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#prediction -> 3 functions (gi pred, gl pred, classify)
@app.route('/predict_new_data', methods=['POST'])
def predict_new_data():
    try:
        # Get JSON data from the request
        data = request.json

        # Extract input features
        food_name = data['foodName']
        category = data['category']
        calories = data['calories']
        proteins = data['proteins']
        carbs = data['carbs']
        fats = data['fats']

        if calories is None or proteins is None or carbs is None or fats is None:
            return jsonify({"error": "Missing one or more input features"}), 400

        # Predict Glycemic Index
        gi_value, gi_category = predict_gi(calories, proteins, carbs, fats)

        # Predict Glycemic Load (Placeholder)
        gl_value, gl_category = predict_gl(calories, proteins, carbs, fats, gi_value)

        # Return the results
        response_data = {
            "food_name": food_name,
            "gi_value": gi_value,
            "gl_value": gl_value,
            "gi_category": gi_category,
            "gl_category": gl_category,
            "calories": calories,
            "carbs": carbs,
            "fats": fats,
            "proteins": proteins,
            "category": category
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
   
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
