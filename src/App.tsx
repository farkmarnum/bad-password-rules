import { useEffect } from 'react';
import BadPasswordRules from './components/BadPasswordRules/BadPasswordRules';
import './App.css';

const App = () => {
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
      </header>
      <BadPasswordRules />
    </div>
  );
};

// TODO: add hall of fame

export default App;
