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
  const now = new Date();

  // Define the offset for UTC+8
  const offset = 8 * 60 * 60 * 1000;

  // Get current date in UTC
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();

  // Define the start and end of today in UTC+8
  const todayStart = new Date(Date.UTC(utcYear, utcMonth, utcDate) + offset);
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  let totalGlucose = 0;
  let count = 0;

  snapshot.forEach((doc) => {
    const docData = doc.data();
    const entryDate = docData.datetime.toDate();

    if (entryDate >= todayStart && entryDate < todayEnd) {
      const glucose = docData.glucose;
      totalGlucose += glucose;
      count += 1;

      data.push({
        id: doc.id,
        glucose: docData.glucose,
        condition: docData.condition,
        notes: docData.notes,
        datetime: entryDate,
      });
    }
  });

  const averageGlucose = count > 0 ? Math.round(totalGlucose / count) : 0;

  return {
    average: averageGlucose,
    data,
  };
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

  const formatWeeklyKey = (start, end) => {
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();
    const year = start.getFullYear();
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    if (startMonth === endMonth) {
      const monthName = monthNames[startMonth];
      return `${startDay} ${monthName} ${year} - ${endDay} ${monthName} ${year}`;
    }

    const startMonthName = monthNames[startMonth];
    const endMonthName = monthNames[endMonth];
    return `${startDay} ${startMonthName} ${year} - ${endDay} ${endMonthName} ${year}`;
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

  /* eslint-disable arrow-body-style */
  const sortObjectByDate = (obj, parseFn) => {
    return Object.fromEntries(
      Object.entries(obj).sort(([a], [b]) => {
        const aDate = parseFn(a);
        const bDate = parseFn(b);
        return aDate - bDate;
      }),
    );
  };

  const parseWeeklyKey = (key) => {
    /* eslint-disable no-unused-vars */
    const [startStr, endStr] = key.split(' - ');
    const startDate = new Date(startStr.split('-').reverse().join('-'));
    return startDate;
  };

  const formatWeeklyThisMonth = (weeklyObj) => {
    const formatted = {};
    Object.keys(weeklyObj).forEach((key) => {
      const [startStr, endStr] = key.split(' - ');
      const start = new Date(startStr.split('-').reverse().join('-'));
      const end = new Date(endStr.split('-').reverse().join('-'));
      const formattedKey = formatWeeklyKey(start, end);
      formatted[formattedKey] = weeklyObj[key];
    });
    return formatted;
  };

  const parseDate = (key) => {
    const [start, end] = key.split(' - ');
    const [startDay, startMonth, startYear] = start.split(' ');
    const [endDay, endMonth, endYear] = end.split(' ');

    /* eslint-disable object-property-newline */
    const monthNames = {
      Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
      Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11,
    };

    const startDate = new Date(startYear, monthNames[startMonth], startDay);
    return startDate;
  };

  const convertToArray = (obj) => {
    return Object.entries(obj).map(([key, value]) => ({ date: key, glucose: value }));
  };

  return {
    daily: convertToArray(
      sortObjectByDate(calculateAverageForPeriods(dailyAverages), (key) => new Date(key)),
    ),
    weekly: convertToArray(
      sortObjectByDate(calculateAverageForPeriods(weeklyAverages), parseWeeklyKey),
    ),
    monthly: convertToArray(
      sortObjectByDate(calculateAverageForPeriods(monthlyAverages), (key) => new Date(`${key}-01`)),
    ),
    weeklyThisMonth: convertToArray(sortObjectByDate(calculateAverageForPeriods(
      formatWeeklyThisMonth(weeklyThisMonth),
    ), parseDate)),
  };
};

module.exports = {
  createDataTracker,
  readDataTracker,
  readDataTrackerToday,
  deleteDataTracker,
  calculateAverages,
};
