import { useState } from 'react';

import Prompt from './Prompt';

/**
 * DiagnosticScreener renders screener data as a sequential, stepped form and
 * POSTs the data to the backend API service.
 *
 * `form` is a state object whose keys are the `question_id`s, and whose values
 * are objects in the form `{ title: '', answer: 0 }`.
 */
const DiagnosticScreener = ({ answers, displayName, prompt, questions, form, update }) => {
  const [currentStep, setStep] = useState(0);
  const [assessments, setAsmts] = useState();
  // STEPS is an array of the questionIDs.
  const STEPS = Object.keys(form);
  const LAST = STEPS.length - 1;

  /**
   * When a user selects a response to a Prompt, `next()` is called with the
   * value of the chosen response. The response is then saved into the `answer`
   * field for the `form` object matching the questionID key.
   */
  const next = async (response) => {
    let questionID = STEPS[currentStep];
    form[questionID].answer = response;
    // Call update to persist the response.
    update(form);
    if (currentStep !== LAST) {
      setStep(currentStep + 1);
    } else {
      let data = {
        answers: STEPS.map(id => ({
          question_id: id,
          value: form[id].answer
        })),
      };
      const resp = await postData(data);
      const body = await resp.json();
      setAsmts(body.results);
    };
  };

  const buildPrompt = (step) => {
    let qID = STEPS[step];
    if (qID) {
      return <Prompt
        text={form[qID].title}
        choices={answers}
        next={next}
      />;
    };
  };

  const stepper = (step) => STEPS.map((_, idx) => {
    let circle = 'flex-auto mx-2 border-2 border-transparent rounded-full text-center';
    if (idx < step) {
      circle += ' bg-green-300';
    } else if (idx === step) {
      circle += ' border-green-300';
    }
    return <span
      key={idx}
      className={circle}
    >{idx + 1}</span>
  });

  return (
    <div className="p-5 max-w-md mx-auto rounded overflow-hidden shadow-lg bg-white bg-opacity-80">
      <h1 className="text-xl font-semibold">{displayName}</h1>
      <br />

      {assessments
        ? <>
          <h2>Recommended assessments:</h2>
          <p>{assessments.join(' ')}</p>
        </>
        : <>
          <h2 className="text-base">{prompt}</h2>
          <br />
          {buildPrompt(currentStep)}
          <div className='flex pt-12'>
            {stepper(currentStep)}
          </div>
        </>
      }

    </div>
  );
}

const postData = async (data) => {
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

export default DiagnosticScreener;
