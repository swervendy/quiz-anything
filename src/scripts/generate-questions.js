import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const shape = [{
  "question": "Who is Luke Skywalker's father?",
  "answer": "Darth Vader",
  "wrongAnswers": ["Obi-Wan Kenobi", "Emperor Palpatine", "Yoda"]
}];

export const generateTriviaQuestions = async (userTopic = 'default topic') => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user", 
      content: `
        generate 10 trivia questions about ${userTopic}. include wrong answers
        format the response as JSON in the shape of: ${JSON.stringify(shape)}
      `
    }],
  });

  const questions = JSON.parse(completion.choices[0].message.content);
  return questions;
};

if (require.main === module) {
  (async () => {
    const userTopic = process.argv[2];
    const questions = await generateTriviaQuestions(userTopic);
    console.log(JSON.stringify(questions, null, 2));
  })();
}