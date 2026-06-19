const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

let DATA_DIR = path.join(__dirname, '..', 'data');
const ORIGINAL_DATA_DIR = path.join(__dirname, '..', 'data');

// If running on Vercel, use /tmp/data which is writeable
if (process.env.VERCEL) {
  DATA_DIR = path.join('/tmp', 'data');
}

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (error) {
  console.warn('Warning: Could not create local data directory, falling back to /tmp/data:', error.message);
  DATA_DIR = path.join('/tmp', 'data');
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('Critical: Could not create fallback /tmp/data directory:', err.message);
  }
}

const getFilePath = (collectionName) => path.join(DATA_DIR, `${collectionName.toLowerCase()}s.json`);
const getOriginalFilePath = (collectionName) => path.join(ORIGINAL_DATA_DIR, `${collectionName.toLowerCase()}s.json`);

const readData = (collectionName) => {
  const filePath = getFilePath(collectionName);
  // Try reading from the active writeable DATA_DIR first
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.error(`Error reading ${collectionName} mock data from ${filePath}:`, error);
    }
  }

  // Fallback to reading the original read-only template data
  const originalFilePath = getOriginalFilePath(collectionName);
  if (fs.existsSync(originalFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(originalFilePath, 'utf8'));
    } catch (error) {
      console.error(`Error reading original template ${collectionName} data:`, error);
    }
  }

  return [];
};

const writeData = (collectionName, data) => {
  const filePath = getFilePath(collectionName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${collectionName} mock data:`, error);
  }
};

// Generates a random 24-character hex ID (similar to MongoDB ObjectId)
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

class MockDocument {
  constructor(data, collectionName) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = generateId();
    }
    this.createdAt = this.createdAt || new Date().toISOString();
    this.updatedAt = this.updatedAt || new Date().toISOString();

    // Define save method
    this.save = async function () {
      const records = readData(collectionName);
      const index = records.findIndex(r => String(r._id) === String(this._id));
      
      // Hash password if this is a User document and password is changing
      if (collectionName === 'User' && this.password && !this.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }

      const docData = JSON.parse(JSON.stringify(this));
      if (index >= 0) {
        records[index] = docData;
      } else {
        records.push(docData);
      }
      writeData(collectionName, records);
      return this;
    };

    // User-specific instance method
    if (collectionName === 'User') {
      this.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
    }
  }
}

class MockQuery {
  constructor(promise) {
    this.promise = promise;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }

  select(fields) {
    // No-op for mock, just chain
    return this;
  }

  sort(fields) {
    // Simple sort support if needed, but no-op is fine for dev
    return this;
  }

  populate(fields) {
    this.promise = this.promise.then(data => {
      if (!data) return data;
      
      const populateDoc = (doc) => {
        if (!doc) return doc;
        const fieldsArray = typeof fields === 'string' ? fields.split(' ') : [];
        fieldsArray.forEach(field => {
          if (doc[field]) {
            if (field === 'user') {
              const users = readData('User');
              doc.user = users.find(u => String(u._id) === String(doc.user)) || doc.user;
            }
            if (field === 'benefit') {
              const benefits = readData('Benefit');
              doc.benefit = benefits.find(b => String(b._id) === String(doc.benefit)) || doc.benefit;
            }
          }
        });
        return doc;
      };

      if (Array.isArray(data)) {
        return data.map(populateDoc);
      } else {
        return populateDoc(data);
      }
    });
    return this;
  }
}

class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  find(query = {}) {
    const executeFind = async () => {
      let records = readData(this.collectionName);
      
      // Simple filter matching
      if (Object.keys(query).length > 0) {
        records = records.filter(record => {
          return Object.entries(query).every(([key, val]) => {
            if (val && typeof val === 'object') {
              if ('$in' in val && Array.isArray(val.$in)) {
                return val.$in.map(String).includes(String(record[key]));
              }
              return true; // ignore other complex operators for now
            }
            return String(record[key]) === String(val);
          });
        });
      }

      return records.map(r => new MockDocument(r, this.collectionName));
    };

    return new MockQuery(executeFind());
  }

  findOne(query = {}) {
    const executeFindOne = async () => {
      const records = readData(this.collectionName);
      const record = records.find(r => {
        return Object.entries(query).every(([key, val]) => String(r[key]) === String(val));
      });
      return record ? new MockDocument(record, this.collectionName) : null;
    };

    return new MockQuery(executeFindOne());
  }

  findById(id) {
    const executeFindById = async () => {
      const records = readData(this.collectionName);
      const record = records.find(r => String(r._id) === String(id));
      return record ? new MockDocument(record, this.collectionName) : null;
    };

    return new MockQuery(executeFindById());
  }

  async create(data) {
    const doc = new MockDocument(data, this.collectionName);
    await doc.save();
    return doc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const records = readData(this.collectionName);
    const index = records.findIndex(r => String(r._id) === String(id));
    if (index === -1) return null;

    let record = records[index];
    
    // Handle $push (e.g. adding to timeline or documents list)
    if (update.$push) {
      for (const [key, val] of Object.entries(update.$push)) {
        record[key] = record[key] || [];
        record[key].push(val);
      }
    }
    
    // Handle $set
    if (update.$set) {
      Object.assign(record, update.$set);
    } else {
      // standard fields update
      const cleanUpdate = { ...update };
      delete cleanUpdate.$push;
      delete cleanUpdate.$set;
      Object.assign(record, cleanUpdate);
    }

    record.updatedAt = new Date().toISOString();
    records[index] = record;
    writeData(this.collectionName, records);

    return new MockDocument(record, this.collectionName);
  }

  async countDocuments(query = {}) {
    const records = await this.find(query);
    return records.length;
  }

  async insertMany(docs) {
    const results = [];
    for (const doc of docs) {
      const created = await this.create(doc);
      results.push(created);
    }
    return results;
  }

  // Schema definition mock (to prevent Mongoose Schema errors)
  static Schema = class {
    constructor() {}
    pre() {}
    index() {}
    methods = {};
  };

  static model(name) {
    return new MockModel(name);
  }
}

module.exports = MockModel;
