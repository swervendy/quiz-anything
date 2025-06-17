import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'GET') {
    const { uuid } = req.query;

    // Basic input validation
    if (!uuid) {
      return res.status(400).json({ error: 'UUID is required.' });
    }

    const db = await connectToDB();
    const collection = db.collection('questions');
    const data = await collection.findOne({ uuid });

    if (data && Array.isArray(data.questions)) {
      return res.status(200).json(data.questions);
    } else {
      return res.status(404).json({ error: 'Questions not found for the given UUID.' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
