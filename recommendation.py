# -*- coding: utf-8 -*-
"""Copy of food recommendation.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1koW9SghRxMu8yFUoFaaXdl5XLA6bTQ3X

### **Import Library**
"""
from flask import Flask, jsonify
import pandas as pd
import numpy as np

"""### **Load Data**"""

df = pd.read_csv("https://raw.githubusercontent.com/Glucofy-Team/Glucofy-Machine-Learning/main/data/(modified)%20nutrition%20food%20dataset.csv")

df.head()

df.info()

"""### **Category Mapping**"""

category_mapping = {
    'Vegetables': ['Vegetables', 'Greens', 'Mushrooms'],
    'Grains and Starches': ['Grains'],
    'Meat and Alternative': ['Meat', 'Seafood', 'Nuts'],
    'Beverages': ['Beverages'],
    'Fruits': ['Fruits']
}

def map_category(original_category):
    for desired_category, original_categories in category_mapping.items():
        if original_category in original_categories:
            return desired_category
    return None

df['desired_category'] = df['category'].apply(map_category)

df = df.dropna(subset=['desired_category'])

features = ['glycemic_index', 'glycemic_load', 'calories (kcal)', 'proteins (g)', 'carbohydrates (g)', 'fats (g)']

def euclidean_distance(row, gi, gl):
    return np.sqrt((row['glycemic_index'] - gi)**2 + (row['glycemic_load'] - gl)**2)

def recommend_foods(selected_food, df, num_recommendations=5):
    gi = selected_food['glycemic_index'].values[0]
    gl = selected_food['glycemic_load'].values[0]

    # Filter berdasarkan kriteria glycemic_index dan glycemic_load
    filtered_df = df[(df['glycemic_index'] <= 55) & (df['glycemic_load'] <= 10)].copy()

    # Hitung jarak Euclidean
    filtered_df['distance'] = filtered_df.apply(lambda row: euclidean_distance(row, gi, gl), axis=1)

    # Sortir berdasarkan jarak dan pilih num_recommendations teratas
    recommended_foods = filtered_df.sort_values('distance').head(num_recommendations)

    return recommended_foods

def generate_meal_plan(df, desired_categories, num_meals=3):
    meal_plans = []
    for _ in range(num_meals):
        meal = {}
        for category in desired_categories:
            category_items = df[df['desired_category'] == category]
            if not category_items.empty:
                selected_item = category_items.sample(1)
                recommended_items = recommend_foods(selected_item, category_items, num_recommendations=1)
                if not recommended_items.empty:
                    meal[category] = recommended_items.iloc[0].to_dict()
                else:
                    meal[category] = selected_item.iloc[0].to_dict()
            else:
                meal[category] = None
        meal_plans.append(meal)

    return meal_plans

desired_categories = ['Vegetables', 'Grains and Starches', 'Meat and Alternative', 'Beverages', 'Fruits']
