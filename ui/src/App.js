import { useEffect, useState } from 'react';

import DiagnosticScreener from './DiagnosticScreener';
import background from './undraw_Hiking_re_k0bc.svg';

function App() {
  const [answers, setAnswers] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  // Fetch the screener from the API.
  useEffect(() => {
    (async () => {
      try {
        // Requests to /api/* are proxied to the API service in the
        // nginx/ui.conf configuration.
        const resp = await fetch("/api/diagnostic-screener/abcd-123", {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!resp.ok) {
          throw new Error("fetch err");
        }

        const { content } = await resp.json();
        // The JSON returned contains an array of sections, but we assume length
        // 1 for this exercise.
        const screener = content.sections[0];
        setAnswers(screener.answers);
        setDisplayName(content.display_name);
        setQuestions(screener.questions);
        setPrompt(screener.title);
      } catch (err) {
        // Handle error in production application, log here for simplicity.
        console.error(err);
      }
    })();
  }, []);

  return (
    <div
      className="h-screen bg-right-bottom bg-no-repeat bg-contain md:bg-auto"
      style={{ backgroundImage: `url(${background})`, opacity: '75%' }}
    >
      <header
        className="mx-auto p-4 sm:p-6 bg-gradient-to-b from-indigo-800 to-indigo-400 flex justify-between"
      >
        <a
          className="text-white text-xl sm:text-2xl" href="https://github.com/aspenjames/blueprint-coding-exercise"
        >
          <h1>Blueprint Exercise</h1>
        </a>
        <a
          className="text-white text-xl sm:text-2xl" href="https://aspenjames.dev"
        >
          <h2>Aspen James</h2>
        </a>
      </header>
      <main
        className="pt-2 container md:conatiner-md mx-auto"
      >
        <DiagnosticScreener
          answers={answers}
          displayName={displayName}
          prompt={prompt}
          questions={questions}
        />
      </main>
    </div>
  );
}

export default App;
