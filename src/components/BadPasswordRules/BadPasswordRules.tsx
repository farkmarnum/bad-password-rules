import { useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PasswordInput from '../PasswordInput/PasswordInput';
import { generateValidations } from '../../helpers/validations';
import './BadPasswordRules.css';

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

const generateSeed = () => Math.round(Math.random() * 9999);

const BadPasswordRules = () => {
  const [seed, setSeed] = useState(generateSeed);
  const [password, setPassword] = useState('');
  const [validationIds, setValidationIds] = useState<Array<string>>([]);

  const allValidations = generateValidations(seed);

  const validations = allValidations.filter(({ id }) =>
    validationIds.includes(id),
  );

  const addValidation = useCallback(() => {
    const remainingValidations = allValidations.filter(
      ({ id }) => !validationIds.includes(id),
    );

    const newValidationId = runValidations(password, remainingValidations).find(
      ({ result }) => !result,
    )?.id;

    if (newValidationId) {
      setValidationIds(validationIds.concat(newValidationId));
    }
  }, [password, validationIds]);

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

  const sortedResults = results
    .filter(({ result }) => !result)
    .concat(results.filter(({ result }) => result));

  return (
    <div className="main">
      <PasswordInput setPassword={setPassword} />

      <div className="errors">
        <TransitionGroup>
          {sortedResults.map(({ id, msg, result, inputValue }) => (
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
