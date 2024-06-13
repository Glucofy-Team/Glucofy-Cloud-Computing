from flask import Flask, jsonify, request
from classification import generate_gi_gl_classification_report
from recommendation import df, desired_categories, generate_meal_plan
from flask import Flask, request, jsonify
from food_data import food_data
from gi_prediction import predict_gi, predict_gl, classify_food

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_plans = generate_meal_plan(df, desired_categories, num_meals=3)
    return jsonify(meal_plans)

#classification
@app.route('/classify', methods=['GET'])
def gi_classification_report():
    report = generate_gi_gl_classification_report()
    return jsonify(report)

#prediction -> 3 functions (gi pred, gl pred, classify)
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        input_data = request.json

        # Extract input features
        calories = input_data.get('calories')
        proteins = input_data.get('proteins')
        carbs = input_data.get('carbs')
        fats = input_data.get('fats')

        if calories is None or proteins is None or carbs is None or fats is None:
            return jsonify({"error": "Missing one or more input features"}), 400

        # Predict Glycemic Index
        gi_value = predict_gi(calories, proteins, carbs, fats)

        # Predict Glycemic Load (Placeholder)
        gl_value = predict_gl(calories, proteins, carbs, fats)

        # Classify Food (Placeholder)
        classification = classify_food(calories, proteins, carbs, fats)

        # Return the results
        return jsonify({
            "glycemic_index": gi_value,
            "glycemic_load": gl_value,
            "classification": classification
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict_backup', methods=['POST'])
def predict():
    data = request.json  
    food_name = data['foodName']

    # Use the external function to get prediction
    response_data = food_data(food_name)

    # Send response in JSON format
    return jsonify(response_data)
   

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
