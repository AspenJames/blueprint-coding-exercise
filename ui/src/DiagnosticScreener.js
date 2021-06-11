function DiagnosticScreener({ answers, displayName, prompt, questions }) {
  return (
    <>
      <h1>{displayName}</h1>
      <h2>{prompt}</h2>
      <p>Answers:</p>
      <ul>
        {answers.map(a =>
          <li key={a.value} data-value={a.value}>{a.title}</li>
        )}
      </ul>
      <p>Questions:</p>
      <ul>
        {questions.map(q =>
          <li key={q.question_id} data-id={q.question_id}>{q.title}</li>
        )}
      </ul>
    </>
  )
}

export default DiagnosticScreener;
