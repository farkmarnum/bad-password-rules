import { useState, useRef, useEffect } from 'react';
import eyeOpened from '../assets/eye-opened.png';
import eyeClosed from '../assets/eye-closed.png';
import './PasswordInput.css';

const PasswordInput = ({
  setPassword: setPasswordParent,
}: {
  setPassword: (arg0: string) => void;
}) => {
  const password = useRef('');
  const setPassword = (newValue: string) => {
    password.current = newValue;
    setPasswordParent(newValue);
  };

  const ref = useRef<any>(null);

  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShouldShowPassword((x) => !x);

  const updateInput = (value: string, cursor: number) => {
    const input = ref.current;

    if (input) {
      input.value = value;
      input.setSelectionRange(cursor, cursor);
    }
  };

  const updatePassword = (newValue: string, newCursor: number) => {
    setPassword(newValue);

    const displayValue = shouldShowPassword
      ? newValue
      : '•'.repeat(newValue.length);

    updateInput(displayValue, newCursor);
  };

  useEffect(() => {
    const input = ref.current;
    if (input) {
      const displayValue = shouldShowPassword
        ? password.current
        : '•'.repeat(password.current.length);

      input.value = displayValue;
    }
  }, [shouldShowPassword]);

  const handleKeyPress = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    evt.preventDefault();

    const { target, key } = evt;
    const { selectionStart, selectionEnd } = target;

    const start = selectionStart || 0;
    const end = selectionEnd || 0 + 1;

    const newValue = [
      password.current.slice(0, start),
      key,
      password.current.slice(end),
    ].join('');

    const newCursor = start + 1;
    updatePassword(newValue, newCursor);
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    const modifiers = ['Alt', 'Meta', 'Control'].reduce((acc, modifier) => {
      acc[modifier.toLowerCase()] = evt.getModifierState(modifier);
      return acc;
    }, {} as Record<string, boolean>);

    // TODO: support non-mac OS
    const shouldDeleteWord = modifiers.alt || modifiers.control;
    let shouldDeleteAll = modifiers.meta;

    // If password is hidden, don't parse words:
    if (shouldDeleteWord && !shouldShowPassword) {
      shouldDeleteAll = true;
    }

    const { target } = evt;
    const { selectionStart, selectionEnd } = target;

    let start = selectionStart || 0;
    let end = selectionEnd || 0;

    switch (evt.key) {
      case 'Unidentified':
        return;

      case 'Backspace': {
        evt.preventDefault();

        // Handle the case where there is no selection:
        if (start === end) {
          if (shouldDeleteAll) {
            start = 0;
          } else if (shouldDeleteWord) {
            const previousSpaceIndex = password.current
              .slice(0, start)
              .lastIndexOf(' ');
            start = previousSpaceIndex;
          } else {
            start -= 1;
          }
        }

        const newCursor = start;

        const newValue = [
          password.current.slice(0, start),
          password.current.slice(end),
        ].join('');

        updatePassword(newValue, newCursor);
        break;
      }
      case 'Delete': {
        evt.preventDefault();
        // Handle case where there is no selection:
        if (start === end) {
          if (shouldDeleteWord) {
            const previousSpaceIndex = password.current
              .slice(0, start)
              .lastIndexOf(' ');
            start = previousSpaceIndex;
          } else if (shouldDeleteAll) {
            start = 0;
          } else {
            end += 1;
          }
        }

        const newValue = [
          password.current.slice(0, start),
          password.current.slice(end),
        ].join('');

        const newCursor = start;
        updatePassword(newValue, newCursor);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="container">
      <input
        ref={ref}
        type="text"
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyDown}
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
