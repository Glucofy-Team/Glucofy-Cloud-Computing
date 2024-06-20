/* eslint-disable dot-notation */
/* eslint-disable radix */
/* eslint-disable arrow-body-style */

const fs = require('fs');
const csv = require('csv-parser');

let results = [];

const loadDataset = async () => {
  return new Promise((resolve, reject) => {
    const newResults = [];
    fs.createReadStream('./dataset/nutrition_food_dataset.csv')
      .pipe(csv())
      .on('data', (data) => newResults.push(data))
      .on('end', () => {
        // Update the global results array with new data
        results = newResults;
        resolve();
      })
      .on('error', reject);
  });
};

// Initial dataset loading
(async () => {
  try {
    await loadDataset();
    console.log('CSV file successfully processed');
  } catch (error) {
    console.error('Error loading initial dataset:', error);
  }
})();

const readDataset = async (name, page, limit) => {
  // Check if dataset is already loaded
  if (results.length === 0) {
    await loadDataset();
  }

  let filteredResults = results;

  if (name) {
    filteredResults = results.filter((item) => item['name'].toLowerCase().includes(name.toLowerCase()));
  }

  const formattedData = filteredResults.map((item, index) => ({
    id: index + 1,
    foodName: item['name'],
    gIndex: parseFloat(item['glycemic_index']),
    gLoad: parseFloat(item['glycemic_load']),
    calories: parseFloat(item['calories (kcal)']),
    proteins: parseFloat(item['proteins (g)']),
    carbs: parseFloat(item['carbohydrates (g)']),
    fats: parseFloat(item['fats (g)']),
    category: item['category'],
  }));

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedResults = formattedData.slice(startIndex, endIndex);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    totalResults: formattedData.length,
    totalPages: Math.ceil(formattedData.length / limit),
    data: paginatedResults,
  };
};

const readSingleData = async (id) => {
  if (results.length === 0) {
    await loadDataset();
  }

  const item = results.find((_, index) => index + 1 === id);

  if (!item) {
    throw new Error(`Item with id ${id} not found`);
  }

  return {
    id,
    foodName: item['name'],
    gIndex: parseFloat(item['glycemic_index']),
    gLoad: parseFloat(item['glycemic_load']),
    calories: parseFloat(item['calories (kcal)']),
    proteins: parseFloat(item['proteins (g)']),
    carbs: parseFloat(item['carbohydrates (g)']),
    fats: parseFloat(item['fats (g)']),
    category: item['category'],
  };
};

module.exports = {
  readDataset,
  readSingleData,
};
