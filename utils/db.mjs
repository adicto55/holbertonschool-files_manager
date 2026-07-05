import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    // useUnifiedTopology prevents a deprecation warning in the console
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.dbName = database;

    // Connect to the server
    this.client.connect().catch((err) => {
      console.error('MongoDB Connection Error:', err);
    });
  }

  isAlive() {
    // Safely check if the connection to MongoDB is active
    if (this.client && this.client.topology) {
      return this.client.topology.isConnected();
    }
    return false;
  }

  async nbUsers() {
    return this.client.db(this.dbName).collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db(this.dbName).collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
