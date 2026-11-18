const mongoose =ports = require('mongoose');

// Apna asli MongoDB Atlas connection string yahan quotes ke andar paste kar dein
// (Jaise: "mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority")
const MONGO_URI = "YAHAN_APNA_ASLI_MONGODB_ATLAS_CONNECTION_STRING_PASTE_KREIN";

async function clearDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Direct 'users' collection ke saare documents delete kar do
    const result = await mongoose.connection.collection('users').deleteMany({});
    console.log(`Success! Deleted ${result.deletedCount} users from the database.`);

    process.exit();
  } catch (error) {
    console.error("Error clearing users:", error);
    process.exit(1);
  }
}

clearDatabase();