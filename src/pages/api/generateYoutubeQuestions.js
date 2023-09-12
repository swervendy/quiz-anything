/* eslint-disable import/no-anonymous-default-export */
import { connectToDB } from '../../lib/db';
import { generateYoutubeTriviaQuestions } from '../../scripts/generate-youtube-questions';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { uuid } = req.body;

  // Basic input validation
  if (!uuid) {
    return res.status(400).json({ error: 'UUID is required.' });
  }

  try {
    const db = await connectToDB();
    const youtubeTranscriptsCollection = db.collection('youtubeTranscripts');

    // Fetch the transcript for the given UUID
    const transcriptData = await youtubeTranscriptsCollection.findOne({ uuid });

    if (!transcriptData || !transcriptData.transcript) {
      return res.status(404).json({ error: 'Transcript not found for the given UUID.' });
    }

    const questions = await generateYoutubeTriviaQuestions(transcriptData.transcript);

    const questionsCollection = db.collection('youtubeQuestions');

    // Remove any existing questions for the given UUID
    await questionsCollection.deleteOne({ uuid });

    // Insert the new questions
    await questionsCollection.insertOne({ 
      uuid, 
      questions, 
      createdAt: new Date()
    });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};