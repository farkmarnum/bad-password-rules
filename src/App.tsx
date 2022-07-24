import { useEffect, useRef } from 'react';
import BadPasswordRules from './components/BadPasswordRules/BadPasswordRules';
import infoIcon from './assets/info.png';
import resetIcon from './assets/reset.png';
import './App.css';

const ResetButton = ({ reset }: { reset: () => void }) => (
  <button className="reset-btn" type="button" onClick={reset}>
    <img alt="reset" src={resetIcon} />
  </button>
);

const InfoButton = ({ openModal }: { openModal: () => void }) => (
  <button className="info-btn" type="button" onClick={openModal}>
    <img alt="info" src={infoIcon} />
  </button>
);

const App = () => {
  const api = useRef<BadPasswordRulesRefContents>();
  const reset = () => {
    if (api.current?.reset) {
      api.current.reset();
    }
  };

  (window as Record<string, any>).a = () => console.log(api.current);

  useEffect(() => {
    const inputElement = document.querySelector('#password-id');
    if (inputElement) {
      (inputElement as HTMLInputElement).focus();
    }
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
        <div className="top-right-buttons">
          <ResetButton reset={reset} />
          <InfoButton openModal={() => {}} />
        </div>
      </header>
      <BadPasswordRules api={api} />
    </div>
  );
};

// TODO: add hall of fame

export default App;
