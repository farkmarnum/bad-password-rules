import { useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PasswordInput from '../PasswordInput/PasswordInput';
import allValidationsByDifficulty from '../../helpers/validations';
import './BadPasswordRules.css';

const shuffle = <T,>(orig: Array<T>) => {
  const arr = [...orig];

  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

// Shuffle the validation list for the user, but keep it in order of easy -> hard.
const allValidations = [
  ...shuffle(allValidationsByDifficulty.EASY),
  ...shuffle(allValidationsByDifficulty.MEDIUM),
  ...shuffle(allValidationsByDifficulty.HARD),
];

type Validations = Array<Validation>;

const VALIDATION_ITEM_ANIMATION_TIME_MS = 250;
const VALIDATION_INDICATOR_ANIMATION_TIME_MS = 150;

const runValidations = (password: string, validations: Validations) =>
  validations.map(({ fn, msg, id }) => ({
    id,
    msg,
    result: fn(password),
    inputValue: password,
  }));

const BadPasswordRules = () => {
  const [password, setPassword] = useState('');
  const [validations, setValidations] = useState<Validations>([]);

  const addValidation = useCallback(() => {
    const usedValidationIds = new Set(validations.map(({ id }) => id));
    const remainingValidations = allValidations.filter(
      ({ id }) => !usedValidationIds.has(id),
    );
    const failingValidationId = runValidations(
      password,
      remainingValidations,
    ).find(({ result }) => !result)?.id;

    const newValidation = allValidations.find(
      ({ id }) => id === failingValidationId,
    );

    if (newValidation) {
      setValidations(validations.concat(newValidation));
    }
  }, [password, validations]);

  const results = runValidations(password, validations);

  useEffect(() => {
    if (
      results.filter(({ result }) => result === false).length === 0 &&
      password.length > 0
    ) {
      addValidation();
    }
  }, [results, validations]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      'validation-item-animation-timeout',
      `${VALIDATION_ITEM_ANIMATION_TIME_MS}ms`,
    );

    document.documentElement.style.setProperty(
      'validation-indicator-animation-timeout',
      `${VALIDATION_INDICATOR_ANIMATION_TIME_MS}ms`,
    );
  }, []);

  return (
    <div className="main">
      <PasswordInput setPassword={setPassword} />

      <div className="errors">
        <TransitionGroup>
          {results.map(({ id, msg, result, inputValue }) => (
            <CSSTransition
              key={id}
              timeout={VALIDATION_ITEM_ANIMATION_TIME_MS}
              classNames="validation-item"
            >
              <div className="validation-item">
                <TransitionGroup>
                  {result && (
                    <CSSTransition
                      timeout={VALIDATION_INDICATOR_ANIMATION_TIME_MS * 2}
                      classNames="validation-indicator"
                      key="good"
                    >
                      <div className="validation-indicator">✅</div>
                    </CSSTransition>
                  )}
                  {!result && (
                    <CSSTransition
                      timeout={VALIDATION_INDICATOR_ANIMATION_TIME_MS * 2}
                      classNames="validation-indicator"
                      key="bad"
                    >
                      <div className="validation-indicator">❌</div>
                    </CSSTransition>
                  )}
                </TransitionGroup>
                <div className="validation-message">
                  {typeof msg === 'function' ? msg(inputValue) : msg}
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default BadPasswordRules;
