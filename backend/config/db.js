const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Disable mongoose buffering so requests fail fast instead of hanging if not connected
    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout fast if connection cannot be established
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`
⚠️  WARNING: Could not connect to MongoDB Atlas!
This ENOTFOUND or timeout error usually means your MongoDB Atlas cluster is PAUSED or DELETED.
Please log in to https://cloud.mongodb.com and unpause/resume your cluster.
The server will continue running, but database operations will fail until MongoDB is active.
`);
  }
};

module.exports = connectDB;
