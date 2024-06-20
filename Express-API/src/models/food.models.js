const { db } = require('../config/firestore');

const readDataFood = async (collectionName, docId, subCollectionName, name = '') => {
  let docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);

  if (name) {
    /* eslint-disable no-param-reassign */
    name = name.toLowerCase();

    /* eslint-disable prefer-template */
    docRef = docRef.where('foodName', '>=', name).where('foodName', '<=', name + '\uf8ff');
  }

  const snapshot = await docRef.get();

  if (snapshot.empty) {
    throw new Error(`${subCollectionName} not found`);
  }

  const data = [];

  snapshot.forEach((doc) => {
    const docData = doc.data();

    data.push({
      id: doc.id,
      ...docData,
      datetime: docData.datetime.toDate(),
    });
  });

  return data;
};

const readDataFoodToday = async (collectionName, docId, subCollectionName) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);
  const snapshot = await docRef.get();

  if (snapshot.empty) {
    throw new Error(`${subCollectionName} not found`);
  }

  const data = [];
  const todayDate = new Date().toISOString().split('T')[0];
  let totalCalories = 0;

  snapshot.forEach((doc) => {
    const docData = doc.data();
    const entryDate = docData.datetime.toDate().toISOString().split('T')[0];

    if (entryDate === todayDate) {
      data.push({
        id: doc.id,
        ...docData,
        datetime: docData.datetime.toDate(),
      });
      totalCalories += docData.calories;
    }
  });

  return {
    totalCalories,
    data,
  };
};

const readSingleDataFood = async (collectionName, docId, subCollectionName, foodId) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName).doc(foodId);
  const doc = await docRef.get();

  if (doc.empty) {
    throw new Error(`${collectionName} not found`);
  }

  const docData = doc.data();

  return {
    id: doc.id,
    ...docData,
    datetime: docData.datetime.toDate(),
  };
};

const createDataFood = async (collectionName, docId, subCollectionName, data) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);
  const newDocRef = docRef.doc();

  const newData = {
    ...data,
    foodName: data.foodName.toLowerCase(),
  };

  await newDocRef.set(newData);

  return newDocRef.id;
};

const deleteDataFood = async (collectionName, userId, subCollectionName, foodId) => {
  const docRef = db
    .collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .doc(foodId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`${subCollectionName} not found`);
  }

  await docRef.delete();
};

module.exports = {
  createDataFood,
  readDataFood,
  readDataFoodToday,
  readSingleDataFood,
  deleteDataFood,
};
