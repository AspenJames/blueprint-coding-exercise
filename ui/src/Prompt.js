/**
 * Prompt renders a single question prompt of a DiagnosticScreener.
 * choices: array of {title: string, value: int}
 * text: question string
 * next: function to call with selected answer value
 */
function Prompt({ choices, text, next }) {
  const buildAnswer = (ans) => {
    return (
      <>
        <button
          key={ans.title}
          onClick={() => next(ans.value)}
        >
          {ans.title}
        </button>
        <br />
      </>
    );
  };
  return (
    <>
      <p>{text}</p>
      <br />
      {choices.map(buildAnswer)}
    </>
  );
}

export default Prompt;
