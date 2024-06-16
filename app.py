from flask import Flask, jsonify, request
from recommendation import df, desired_categories, generate_meal_plan
from food_data import food_data
from gi_model import predict_gi
from gl_model import predict_gl
import numpy as np  

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_plans = generate_meal_plan(df, desired_categories, num_meals=3)
    return jsonify(meal_plans)

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

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  
    food_name = data['foodName']

    # Use the external function to get prediction
    response_data = food_data(food_name)

    # Send response in JSON format
    return jsonify(response_data)
   

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
