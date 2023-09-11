import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const [topic, setTopic] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [webURL, setWebURL] = useState('');
  const router = useRouter();
  const [userUUID, setUserUUID] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Topic');

  useEffect(() => {
    const storedUUID = localStorage.getItem('userUUID');

    if (storedUUID) {
      setUserUUID(storedUUID);
    } else {
      storeUUIDInDB();
    }
  }, []);

  const storeUUIDInDB = async () => {
    // ... (rest of the code remains unchanged)
  };

  const handleSubmit = async (e) => {
    // ... (rest of the code remains unchanged)
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-20">
      <h1 className="text-4xl font-bold mb-3">Quiz Anything</h1>
      <p className="text-xl mb-6">Make a quiz about any topic</p>
      <div className="mb-4 flex space-x-4">
        <button onClick={() => setActiveTab('Topic')} className={activeTab === 'Topic' ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'px-4 py-2 rounded'}>Topic</button>
        <button onClick={() => setActiveTab('YouTube')} className={activeTab === 'YouTube' ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'px-4 py-2 rounded'}>YouTube</button>
        <button onClick={() => setActiveTab('URL')} className={activeTab === 'URL' ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'px-4 py-2 rounded'}>URL</button>
        <button onClick={() => setActiveTab('Upload')} className={activeTab === 'Upload' ? 'bg-blue-500 text-white px-4 py-2 rounded' : 'px-4 py-2 rounded'}>Upload (Coming Soon)</button>
      </div>
      {activeTab === 'Topic' && (
        <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button type="submit" disabled={isLoading} className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">
              {isLoading ? (
                <>
                  <div className="loader inline-block mr-2"></div>
                  Building your quiz
                </>
              ) : (
                'Start Quiz'
              )}
            </button>
          </form>
        </div>
      )}
      {activeTab === 'YouTube' && (
        <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
          <form className="w-full">
            <input
              type="text"
              placeholder="Enter a YouTube URL"
              value={youtubeURL}
              onChange={(e) => setYoutubeURL(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">Start Quiz</button>
          </form>
        </div>
      )}
      {activeTab === 'URL' && (
        <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
          <form className="w-full">
            <input
              type="text"
              placeholder="Enter a web URL"
              value={webURL}
              onChange={(e) => setWebURL(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">Start Quiz</button>
          </form>
        </div>
      )}
      {activeTab === 'Upload' && (
        <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
          <p className="text-xl">Coming Soon</p>
        </div>
      )}
    </main>
  );
}

export default Index;