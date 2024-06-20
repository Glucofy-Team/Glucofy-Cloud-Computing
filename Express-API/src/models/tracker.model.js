const { db } = require('../config/firestore');

const readDataTracker = async (collectionName, docId, subCollectionName) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);
  const snapshot = await docRef.get();

  if (snapshot.empty) {
    throw new Error(`${subCollectionName} not found`);
  }

  const data = [];
  snapshot.forEach((doc) => {
    const docData = doc.data();

    data.push({
      id: doc.id,
      glucose: docData.glucose,
      condition: docData.condition,
      notes: docData.notes,
      datetime: docData.datetime.toDate(),
    });
  });

  return data;
};

const readDataTrackerToday = async (collectionName, docId, subCollectionName) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);
  const snapshot = await docRef.get();

  if (snapshot.empty) {
    throw new Error(`${subCollectionName} not found`);
  }

  const data = [];
  const todayDate = new Date().toISOString().split('T')[0];

  snapshot.forEach((doc) => {
    const docData = doc.data();
    const entryDate = docData.datetime.toDate().toISOString().split('T')[0];

    if (entryDate === todayDate) {
      data.push({
        id: doc.id,
        glucose: docData.glucose,
        condition: docData.condition,
        notes: docData.notes,
        datetime: docData.datetime.toDate(),
      });
    }
  });

  return data;
};

const createDataTracker = async (collectionName, docId, subCollectionName, data) => {
  const docRef = db.collection(collectionName).doc(docId).collection(subCollectionName);
  const newDocRef = docRef.doc();

  await newDocRef.set(data);

  return newDocRef.id;
};

const deleteDataTracker = async (collectionName, userId, subCollectionName, catatanId) => {
  const docRef = db
    .collection(collectionName)
    .doc(userId)
    .collection(subCollectionName)
    .doc(catatanId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`${subCollectionName} not found`);
  }

  await docRef.delete();
};

const calculateAverages = (data) => {
  const dailyAverages = {};
  const weeklyAverages = {};
  const monthlyAverages = {};
  const weeklyThisMonth = {};

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + 6;
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentMonth = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}`;
  };

  const currentMonth = getCurrentMonth();

  data.forEach((entry) => {
    const date = new Date(entry.datetime);
    const day = date.toISOString().split('T')[0];
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = getEndOfWeek(date);
    const week = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!dailyAverages[day]) {
      dailyAverages[day] = [];
    }
    if (!weeklyAverages[week]) {
      weeklyAverages[week] = [];
    }
    if (!monthlyAverages[month]) {
      monthlyAverages[month] = [];
    }

    dailyAverages[day].push(entry.glucose);
    weeklyAverages[week].push(entry.glucose);
    monthlyAverages[month].push(entry.glucose);

    if (month === currentMonth) {
      if (!weeklyThisMonth[week]) {
        weeklyThisMonth[week] = [];
      }
      weeklyThisMonth[week].push(entry.glucose);
    }
  });

  const average = (arr) => Math.round(arr.reduce((sum, value) => sum + value, 0) / arr.length);

  const calculateAverageForPeriods = (periods) => {
    const result = {};
    Object.keys(periods).forEach((period) => {
      result[period] = average(periods[period]);
    });
    return result;
  };

  return {
    daily: calculateAverageForPeriods(dailyAverages),
    weekly: calculateAverageForPeriods(weeklyAverages),
    monthly: calculateAverageForPeriods(monthlyAverages),
    weeklyThisMonth: calculateAverageForPeriods(weeklyThisMonth),
  };
};

module.exports = {
  createDataTracker,
  readDataTracker,
  readDataTrackerToday,
  deleteDataTracker,
  calculateAverages,
};
