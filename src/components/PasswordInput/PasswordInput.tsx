import { useState, useRef, useEffect, useCallback } from 'react';
import eyeOpened from '../../assets/eye-opened.png';
import eyeClosed from '../../assets/eye-closed.png';
import './PasswordInput.css';

// TODO: fix emoji input

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

  const ref = useRef<HTMLInputElement>(null);

  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShouldShowPassword((x) => !x);

  const updateInput = (value: string, cursor: number) => {
    const input = ref.current;

    if (input) {
      input.value = value;
      input.setSelectionRange(cursor, cursor);
    }
  };

  const updatePassword = useCallback(
    (newValue: string, newCursor: number) => {
      setPassword(newValue);

      const displayValue = shouldShowPassword
        ? newValue
        : '•'.repeat(newValue.length);

      updateInput(displayValue, newCursor);
    },
    [shouldShowPassword],
  );

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

    if (key === 'Enter') return;

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
            const previousSpaceMatch = Array.from(
              password.current.slice(0, start).trim().matchAll(/ +/g),
            ).slice(-1)[0];

            let previousSpaceIndex = 0;
            if (previousSpaceMatch) {
              const whiteSpaceStart = previousSpaceMatch?.index || 0;
              const whitespaceLength = previousSpaceMatch[0].length;

              previousSpaceIndex = whiteSpaceStart + whitespaceLength;
              if (previousSpaceIndex === end) {
                previousSpaceIndex -= whitespaceLength;
              }
            }

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

  // TODO: handle cut event

  // TODO: add "undo" support

  const handlePasteEvent = useCallback(
    (evt: ClipboardEvent) => {
      const { target } = evt;
      if (!target) return;

      const pasteContents = evt.clipboardData?.getData('text');
      if (!pasteContents || pasteContents.length === 0) return;

      evt.preventDefault();

      const { selectionStart, selectionEnd } = target as HTMLInputElement;

      const start = selectionStart || 0;
      const end = selectionEnd || 0 + 1;

      const newValue = [
        password.current.slice(0, start),
        pasteContents,
        password.current.slice(end),
      ].join('');

      const newCursor = start + pasteContents.length;
      updatePassword(newValue, newCursor);
    },
    [updatePassword],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('paste', handlePasteEvent);
    }

    return () => {
      ref.current?.removeEventListener('paste', handlePasteEvent);
    };
  }, [ref, handlePasteEvent]);

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
