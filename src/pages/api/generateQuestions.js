import { exec } from 'child_process';

export default (req, res) => {
  if (req.method === 'POST') {
    const { topic } = req.body;

    exec(`node scripts/generate-questions.js "${topic}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: 'Failed to generate questions.' });
      }
      console.log(`Output: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      return res.status(200).json({ success: true });
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
