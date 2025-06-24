const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoURL = process.env.MONGODB_URI;

let _db;

const initDb = async () => {
  if (_db) {
    console.log('Database is already initialized!');
    return _db;
  }

  try {
    const client = await MongoClient.connect(mongoURL);
    _db = client;
    console.log('Database connected successfully!');
    return _db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized! Call initDb first.');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};