const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const db = new Firestore({
  projectId: 'glucofy',
  keyFilename: path.join(__dirname, './key.json'),
  databaseId: 'glucofydb',
});

module.exports = { db };
