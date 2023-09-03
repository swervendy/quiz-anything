import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { topic, uuid } = req.body;

    // Basic input validation
    if (!topic || !uuid) {
      return res.status(400).json({ error: 'Topic and UUID are required.' });
    }

    const db = await connectToDB();
    const topicsCollection = db.collection('topics');

    try {
      await topicsCollection.insertOne({
        uuid,
        topicName: topic,
        createdAt: new Date()
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Failed to store topic in the database:', error);
      return res.status(500).json({ error: 'Failed to store topic in the database.' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
