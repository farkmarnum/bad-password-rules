import { useState, useEffect, useCallback } from 'react';
import './App.css';
import PasswordInput from './components/PasswordInput';
import allValidations from './helpers/validations';

const allValidationIds = allValidations.map(({ id }) => id);

type Validations = Array<Validation>;

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

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <PasswordInput setPassword={setPassword} />

        <div className="errors">
          {results.map(({ id, msg, result }) => (
            <div key={id}>
              {result ? '✅' : '❌'} {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
