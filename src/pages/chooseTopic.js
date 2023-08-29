import { useState } from 'react';

function ChooseTopic() {
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/generateQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (response.ok) {
        // Redirect to the quiz page
        window.location.href = '/';
      } else {
        console.error('Failed to generate questions.');
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        <h1 className="text-3xl text-center font-bold mb-4">Choose a Quiz Topic</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">
            Start Quiz
          </button>
        </form>
      </div>
    </main>
  );
}

export default ChooseTopic;
