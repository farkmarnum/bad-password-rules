import { useState, useEffect } from 'react';
import './App.css';
import PasswordInput from './components/PasswordInput';

const App = () => {
  const [password, setPassword] = useState('');
  // console.log(password);
  // const errors = deriveErrors(password);

  return (
    <div className="app">
      <header>
        <h1>Bad Password Rules</h1>
      </header>
      <div className="main">
        <PasswordInput setPassword={setPassword} />

        {/* <div className="errors">(errors here)</div> */}
      </div>
    </div>
  );
};

export default App;
