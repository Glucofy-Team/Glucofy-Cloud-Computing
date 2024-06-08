const { db } = require('../config/firestore');

const readSingleData = async (collectionName, docId) => {
  const docRef = db.collection(collectionName).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    throw new Error(`${collectionName} not found`);
  }

  return { id: doc.id, ...doc.data() };
};

const createData = async (collectionName, data) => {
  const docRef = db.collection(collectionName).doc();
  await docRef.set(data);

  return data;
};

const updateData = async (collectionName, docId, data) => {
  const docRef = db.collection(collectionName).doc(docId);
  await docRef.update(data);
};

const deleteData = async (collectionName, docId) => {
  const docRef = db.collection(collectionName).doc(docId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error(`${collectionName} not found`);
  }

  await docRef.delete();
};

const findDataByEmail = async (email) => {
  const snapshot = await db.collection('users').where('email', '==', email).get();
  if (snapshot.empty) {
    return null;
  }

  let user = null;
  snapshot.forEach((doc) => {
    user = { id: doc.id, ...doc.data() };
  });

  return user;
};

module.exports = {
  readSingleData,
  createData,
  updateData,
  deleteData,
  findDataByEmail,
};
