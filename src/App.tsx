import { useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';
import PasswordInput from './components/PasswordInput';
import allValidations from './helpers/validations';

const allValidationIds = allValidations.map(({ id }) => id);

type Validations = Array<Validation>;

const ERROR_LIST_ANIMATION_TIME_MS = 250;

const runValidations = (password: string, validations: Validations) =>
  validations.map(({ fn, msg, id }) => ({
    id,
    msg,
    result: fn(password),
  }));

const App = () => {
  const [password, setPassword] = useState('');
  const [validations, setValidations] = useState<Validations>([]);

  const addValidation = useCallback(() => {
    const usedValidationIds = new Set(validations.map(({ id }) => id));

    const remainingIds = new Set(
      allValidationIds.filter((id) => !usedValidationIds.has(id)),
    );
    const remainingValidation = allValidations.filter(({ id }) =>
      remainingIds.has(id),
    );

    const remainingResults = runValidations(password, remainingValidation);
    const validationIdsThatWillCurrentlyFail = remainingResults
      .filter(({ result }) => result === false)
      .map(({ id }) => id);

    const newValidationId =
      validationIdsThatWillCurrentlyFail[
        Math.floor(Math.random() * validationIdsThatWillCurrentlyFail.length)
      ];

    const newValidation = allValidations.find(
      ({ id }) => id === newValidationId,
    );

    if (newValidation) {
      setValidations(validations.concat(newValidation));
    }
  }, [password, validations]);

  const results = runValidations(password, validations);

  useEffect(() => {
    if (results.filter(({ result }) => result === false).length === 0) {
      addValidation();
    }
  }, [results, validations]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--error-list-animation-timeout',
      `${ERROR_LIST_ANIMATION_TIME_MS}ms`,
    );
  });

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <PasswordInput setPassword={setPassword} />

        <div className="errors">
          <TransitionGroup>
            {results.map(({ id, msg, result }) => (
              <CSSTransition
                key={id}
                timeout={ERROR_LIST_ANIMATION_TIME_MS}
                classNames="error-item"
              >
                <div className="error-item">
                  {result ? '✅' : '❌'} {msg}
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
};

export default App;
