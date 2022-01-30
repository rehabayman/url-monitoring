const mongoose = require('mongoose');
const databaseDev = process.env.DATABASE;
const databaseTest = process.env.DATABASE_TEST;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;

const connect = (isTest = false) => {
  const database = isTest ? databaseTest : databaseDev;
  mongoose.connect(
      `mongodb://${databaseHost}:${databasePort}/${database}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (!err) {
          console.log(`connected to MongoDB on db: ${database}`);
        } else {
          console.log(err);
        }
      },
  );
};

const disconnect = async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.drop();
  }

  await mongoose.connection.close();
};

module.exports = {connect, disconnect};
