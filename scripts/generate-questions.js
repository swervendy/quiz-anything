require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const shape = [{
  "question": "Who is Luke Skywalker's father?",
  "answer": "Darth Vader",
  "wrongAnswers": ["Obi-Wan Kenobi", "Emperor Palpatine", "Yoda"]
}];

(async function run() {
  const userTopic = process.argv[2] || 'default topic';

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user", 
      content: `
        generate 10 trivia questions about ${userTopic}. include wrong answers
        format the response as JSON in the shape of: ${JSON.stringify(shape)}
      `
    }],
  });

  const questions = JSON.parse(completion.data.choices[0].message.content);

  console.log(JSON.stringify(questions, null, 2));
})();