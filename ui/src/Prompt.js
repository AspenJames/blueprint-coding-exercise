/**
 * Prompt renders a single question prompt of a DiagnosticScreener.
 * choices: array of {title: string, value: int}
 * text: question string
 * next: function to call with selected answer value
 */
function Prompt({ choices, text, next }) {
  const buildAnswer = (ans) => {
    return (
      <button
        key={ans.title}
        onClick={(e) => handle(e, ans.value)}
        className="block rounded my-2 p-2 bg-indigo-200 hover:bg-green-300"
      >
        {ans.title}
      </button>
    );
  };
  const handle = (e, v) => {
    // Remove 'focus' outline after click.
    e.target.blur();
    next(v);
  };
  return (
    <>
      <div
        className="h-16 sm:h-10"
      >
        <p className="text-lg italic">{text}</p>
      </div>
      <br />
      {choices.map(buildAnswer)}
    </>
  );
}

export default Prompt;
