const mongoose = require('mongoose');
const MockModel = require('./localDb');

const createModelProxy = (modelName, schema) => {
  let mongooseModel;
  try {
    mongooseModel = mongoose.model(modelName, schema);
  } catch (e) {
    mongooseModel = mongoose.model(modelName);
  }

  const mockModel = new MockModel(modelName);

  return new Proxy(function() {}, {
    // Handle calls to the model class itself
    get(target, prop) {
      const useMock = process.env.USE_MOCK_DB === 'true' || mongoose.connection.readyState !== 1;
      const activeModel = useMock ? mockModel : mongooseModel;

      const value = activeModel[prop];
      if (typeof value === 'function') {
        return value.bind(activeModel);
      }
      return value;
    },

    // Handle new Model() if any controller uses it
    construct(target, args) {
      const useMock = process.env.USE_MOCK_DB === 'true' || mongoose.connection.readyState !== 1;
      if (useMock) {
        // Return a new MockDocument directly
        const MockDocClass = mockModel.create.bind(mockModel);
        // Create an instance structure
        const doc = {
          ...args[0],
          save: async function() {
            return await mockModel.create(this);
          }
        };
        return doc;
      } else {
        const MongooseModel = mongoose.model(modelName);
        return new MongooseModel(...args);
      }
    }
  });
};

module.exports = createModelProxy;
