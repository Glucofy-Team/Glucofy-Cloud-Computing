from flask import Flask, jsonify, request
from classification import generate_gi_classification_report, generate_gl_classification_report
from recommendation import df, desired_categories, generate_meal_plan
from flask import Flask, request, jsonify
from food_data import food_data

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_plans = generate_meal_plan(df, desired_categories, num_meals=3)
    return jsonify(meal_plans)


@app.route('/gi_class', methods=['GET'])
def gi_classification_report():
    report = generate_gi_classification_report()
    return jsonify(report)

@app.route('/gl_class', methods=['GET'])
def gl_classification_report():
    report = generate_gl_classification_report()
    return jsonify(report)

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
