import { useState } from 'react';
import eyeOpened from '../../assets/eye-opened.png';
import eyeClosed from '../../assets/eye-closed.png';
import './PasswordInput.css';

const PasswordInput = ({
  setPassword,
}: {
  setPassword: (arg0: string) => void;
}) => {
  const [shouldShowPassword, setShouldShowPassword] = useState(true);
  const togglePasswordVisibility = () => setShouldShowPassword((x) => !x);

  return (
    <div className="container">
      <input
        type={shouldShowPassword ? 'text' : 'password'}
        id="password-id"
        onChange={(evt) => setPassword(evt.target?.value || '')}
        placeholder="Type a password..."
      />
      <button
        className="toggle-visibility-btn"
        type="button"
        onClick={togglePasswordVisibility}
      >
        <img
          alt={shouldShowPassword ? 'Hide password' : 'Show password'}
          src={shouldShowPassword ? eyeClosed : eyeOpened}
        />
      </button>
    </div>
  );
};

export default PasswordInput;
