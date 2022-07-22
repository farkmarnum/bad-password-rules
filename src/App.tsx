import { useState } from 'react';
import './App.css';

const App = () => {
  const [password, setPassword] = useState('');
  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShouldShowPassword((x) => !x);

  // const errors = deriveErrors(password);

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <input
          className="password-input"
          // autoComplete="off" // No password managers please
          // data-lpignore="true" // Make LastPass ignore this field
          type="text"
          value={password}
          onKeyPress={(evt) => setPassword(evt.key)}
          onKeyDown={(evt) => {
            if (evt.key === 'Unidentified') return;

            if (evt.key === 'Backspace') {
              const { target } = evt;
              const { selectionStart, selectionEnd } = target;
              setPassword((value) =>
                [
                  value.slice(0, selectionStart || 0),
                  value.slice(selectionEnd || 0 + 1),
                ].join(''),
              );
            }
          }}
        />
        <br />

        <button
          className="text-btn"
          type="button"
          onClick={togglePasswordVisibility}
        >
          {shouldShowPassword ? 'Hide' : 'Show'} Password
        </button>
        {/* <div className="errors">(errors here)</div> */}
      </div>
    </div>
  );
};

export default App;
