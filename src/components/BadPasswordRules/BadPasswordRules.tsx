import { useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PasswordInput from '../PasswordInput/PasswordInput';
import allValidations from '../../helpers/validations';
import './BadPasswordRules.css';

const allValidationIds = allValidations.map(({ id }) => id);

type Validations = Array<Validation>;

const VALIDATION_ITEM_ANIMATION_TIME_MS = 250;
const VALIDATION_INDICATOR_ANIMATION_TIME_MS = 150;

const runValidations = (password: string, validations: Validations) =>
  validations.map(({ fn, msg, id }) => ({
    id,
    msg,
    result: fn(password),
  }));

const BadPasswordRules = () => {
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
      'validation-item-animation-timeout',
      `${VALIDATION_ITEM_ANIMATION_TIME_MS}ms`,
    );
    document.documentElement.style.setProperty(
      'validation-indicator-animation-timeout',
      `${VALIDATION_INDICATOR_ANIMATION_TIME_MS}ms`,
    );
  });

  return (
    <div className="main">
      <PasswordInput setPassword={setPassword} />

      <div className="errors">
        <TransitionGroup>
          {results.map(({ id, msg, result }) => (
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
                <div className="validation-message">{msg}</div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default BadPasswordRules;
