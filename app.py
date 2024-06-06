from flask import Flask, jsonify, request
from classification import generate_gi_classification_report, generate_gl_classification_report
from recommendation import df, desired_categories, generate_meal_plan

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_plans = generate_meal_plan(df, desired_categories, num_meals=3)
    return jsonify(meal_plans)


@app.route('/gi_classification_report', methods=['GET'])
def gi_classification_report():
    report = generate_gi_classification_report()
    return jsonify(report)

@app.route('/gl_classification_report', methods=['GET'])
def gl_classification_report():
    report = generate_gl_classification_report()
    return jsonify(report)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # place holder input data
    category = data['category']
    food_name = data['food_name']
    calories = float(data['calories'])
    proteins = float(data['proteins'])
    carbs = float(data['carbs'])
    fats = float(data['fats'])

    # process input placeholder
    # processed_data = placeholder(category, food_name, calories, proteins, carbs, fats)
    # prediction = placeholder(processed_data)
    
    prediction = "This is a placeholder prediction"

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
