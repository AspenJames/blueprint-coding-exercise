import background from './undraw_Hiking_re_k0bc.svg'

function App() {
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
      </main>
    </div>
  );
}

export default App;
