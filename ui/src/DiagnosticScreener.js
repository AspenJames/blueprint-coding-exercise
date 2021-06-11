import { useState } from 'react';

import Prompt from './Prompt';

/**
 * DiagnosticScreener renders screener data as a sequential, stepped form and
 * POSTs the data to the backend API service.
 *
 * `form` is a state object whose keys are the `question_id`s, whose values are
 * objects in the form `{ title: '', answer: 0 }`, and whose state is held in
 * the parent component, App. `update` is used to persist new `form` state.
 */
const DiagnosticScreener = ({ answers, displayName, prompt, form, update }) => {
  const [currentStep, setStep] = useState(0);
  const [assessments, setAsmts] = useState();
  // QUESTIONS is an array of the questionIDs.
  const QUESTIONS = Object.keys(form);
  const LAST = QUESTIONS.length - 1;

  // When a user selects a response to a Prompt, `next()` is called with the
  // value of the chosen response. The response is then saved into the `answer`
  // field for the `form` object matching the questionID key. If the current
  // step is the LAST step, we post the answers to the API; else we advance.
  const next = async (response) => {
    let questionID = QUESTIONS[currentStep];
    form[questionID].answer = response;
    update(form);
    if (currentStep < LAST) {
      setStep(currentStep + 1);
    } else {
      const resp = await postAnswers();
      const body = await resp.json();
      setAsmts(body.results);
    };
  };

  const buildPrompt = () => {
    let qID = QUESTIONS[currentStep];
    if (qID) {
      return <>
        <h2 className="text-base">{prompt}</h2>
        <br />
        <Prompt
          text={form[qID].title}
          choices={answers}
          next={next}
        />
        <div className='flex pt-8'>
          {stepper()}
        </div>
      </>;
    };
  };

  const displayAssessments = () => {
    const hasRec = assessments.length > 0;
    const heading = hasRec ? "Recommended assessments:" : "No recommended assessments.";
    return (
      <>
        <h2 className="text-lg">{heading}</h2>
        {hasRec && <p>{assessments.join(', ')}</p>}
        <button
          onClick={handleReset}
          className="block rounded my-4 p-2 bg-indigo-200 hover:bg-green-300"
        >Take again</button>
      </>
    );
  }

  const handleReset = () => {
    setAsmts(undefined);
    setStep(0);
  }

  const postAnswers = async () => {
    const data = {
      answers: QUESTIONS.map(id => ({
        question_id: id,
        value: form[id].answer
      })),
    };
    const resp = await fetch('/api/diagnostic-screener', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // Normally, we would want to check this response and handle any errors. For
    // simplicity, we're just assuming all is good.
    return resp;
  }

  const stepper = () => QUESTIONS.map((_, idx) => {
    let styles = 'flex-auto mx-2 border-2 border-transparent rounded-full text-center';
    if (idx < currentStep) { // idx already visited, fill.
      styles += ' bg-green-300';
    } else if (idx === currentStep) { // currentStep, outline.
      styles += ' border-green-300';
    }
    return (
      <span
        key={idx}
        className={styles}
      >{idx + 1}</span>
    );
  });

  return (
    <div className="p-5 max-w-md mx-auto rounded border-2 border-gray-300 overflow-hidden shadow-lg bg-white bg-opacity-95">
      <h1 className="text-xl font-semibold">{displayName}</h1>
      <br />
      {
        assessments
          ? displayAssessments()
          : buildPrompt()
      }
    </div>
  );
}

export default DiagnosticScreener;
