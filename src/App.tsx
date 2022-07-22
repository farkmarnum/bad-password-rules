import { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [password, setPassword] = useState('');
  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShouldShowPassword((x) => !x);

  const [cursor, setCursor] = useState<number | null>(null);

  const ref = useRef<any>(null);

  // const errors = deriveErrors(password);

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <input
          className="password-input"
          type="text"
          value={password}
          onKeyPress={(evt) => {
            const { target, key } = evt;
            const { selectionStart, selectionEnd } = target;
            const getNewValue = (value: string) =>
              [
                value.slice(0, selectionStart || 0),
                key,
                value.slice(selectionEnd || 0 + 1),
              ].join('');

            cursor.current = selectionStart;
            console.log('storing:', cursor.current);
            setPassword(getNewValue);
          }}
          onKeyDown={(evt) => {
            switch (evt.key) {
              case 'Unidentified':
                return;

              case 'Backspace': {
                const { target } = evt;
                const { selectionStart, selectionEnd } = target;

                let start = selectionStart || 0;
                const end = selectionEnd || 0;

                // Handle case where there is no selection:
                if (start === end) start -= 1;

                cursor.current = start;
                console.log('storing:', cursor.current);
                setPassword((value) =>
                  [value.slice(0, start), value.slice(end)].join(''),
                );
                break;
              }
              case 'Delete': {
                const { target } = evt;
                const { selectionStart, selectionEnd } = target;

                const start = selectionStart || 0;
                let end = selectionEnd || 0;

                // Handle case where there is no selection:
                if (start === end) end += 1;

                cursor.current = start;
                console.log('storing:', cursor.current);
                setPassword((value) =>
                  [value.slice(0, start), value.slice(end)].join(''),
                );
                break;
              }
              default:
                // console.log(evt.key);
                break;
            }
          }}
          onFocus={(evt) => {
            console.log('loading:', cursor.current);
            evt.target.selectionStart = cursor.current || 0;
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
