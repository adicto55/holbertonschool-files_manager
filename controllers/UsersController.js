import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Connect to the DB collection
    const db = dbClient.client.db(dbClient.dbName);
    const usersCollection = db.collection('users');

    // 2. Check if the email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // 3. Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // 4. Save the new user to the database
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
    });

    // 5. Return the newly created user (with auto-generated MongoDB ID)
    return res.status(201).json({
      id: result.insertedId,
      email,
    });
  }
}

export default UsersController;
