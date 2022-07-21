import { useState } from 'react';
import './App.css';

const App = () => {
  const [password, setPassword] = useState('');

  // const errors = deriveErrors(password);

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <input
          className="password-input"
          autoComplete="off" // No password managers please
          data-lpignore="true" // Make LastPass ignore this field
          type="password"
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
        {/* <div className="errors">(errors here)</div> */}
      </div>
    </div>
  );
};

export default App;
