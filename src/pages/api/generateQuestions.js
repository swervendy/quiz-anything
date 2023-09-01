import { exec } from 'child_process';
import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { topic, uuid } = req.body;

    exec(`node scripts/generate-questions.js "${topic}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: 'Failed to generate questions.' });
      }
      console.log(`Output: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      let questions;
      try {
        questions = JSON.parse(stdout);
      } catch (parseError) {
        console.error('Failed to parse questions:', parseError);
        return res.status(500).json({ error: 'Failed to parse generated questions.' });
      }

      const db = await connectToDB();
      const questionsCollection = db.collection('questions');
      const topicsCollection = db.collection('topics');

      try {
        await questionsCollection.insertOne({ 
          uuid, 
          questions, 
          createdAt: new Date(), 
          topic 
        });

        await topicsCollection.insertOne({
          uuid,
          topicName: topic,
          createdAt: new Date()
        });

        return res.status(200).json({ success: true });
      } catch (dbError) {
        console.error('Failed to store data in the database:', dbError);
        return res.status(500).json({ error: 'Failed to store data in the database.' });
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
