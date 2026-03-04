import { useState } from 'react';
import { Lock, Delete } from 'lucide-react';
import { hashPin } from '../lib/utils';
import { getPinHash, setPinHash, setSession } from '../lib/storage';

interface PinLoginProps {
  onSuccess: () => void;
}

const DEFAULT_PIN_HASH = '7a4b8c3d'; // Will be set on first use

export default function PinLogin({ onSuccess }: PinLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');

  const existingHash = getPinHash();

  async function handleSubmit() {
    if (pin.length < 4) return;

    if (!existingHash) {
      // First time — set PIN
      if (!isSettingPin) {
        setConfirmPin(pin);
        setIsSettingPin(true);
        setPin('');
        return;
      }
      // Confirm PIN
      if (pin !== confirmPin) {
        setError('PINs do not match. Try again.');
        setIsSettingPin(false);
        setConfirmPin('');
        setPin('');
        return;
      }
      const hash = await hashPin(pin);
      setPinHash(hash);
      setSession();
      onSuccess();
      return;
    }

    // Verify PIN
    const hash = await hashPin(pin);
    if (hash === existingHash) {
      setSession();
      onSuccess();
    } else {
      setError('Wrong PIN');
      setPin('');
    }
  }

  function handleKey(key: string) {
    setError('');
    if (key === 'del') {
      setPin(p => p.slice(0, -1));
    } else if (key === 'enter') {
      handleSubmit();
    } else if (pin.length < 6) {
      const newPin = pin + key;
      setPin(newPin);
    }
  }

  const dots = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`w-3 h-3 rounded-full border-2 transition-all ${
        i < pin.length
          ? 'bg-blue-500 border-blue-500 scale-110'
          : 'border-slate-600'
      }`}
    />
  ));

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Stock Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {!existingHash
              ? isSettingPin ? 'Confirm your PIN' : 'Set a PIN to get started'
              : 'Enter PIN to continue'}
          </p>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 mb-6">{dots}</div>

        {error && (
          <p className="text-red-400 text-center text-sm mb-4">{error}</p>
        )}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 text-xl font-semibold transition-colors active:scale-95"
            >
              {key}
            </button>
          ))}
          <button
            onClick={() => handleKey('del')}
            className="h-14 rounded-xl bg-slate-800/50 hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95"
          >
            <Delete className="w-5 h-5 text-slate-400" />
          </button>
          <button
            onClick={() => handleKey('0')}
            className="h-14 rounded-xl bg-slate-800 hover:bg-slate-700 text-xl font-semibold transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => handleKey('enter')}
            disabled={pin.length < 4}
            className="h-14 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-sm font-semibold transition-colors active:scale-95"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}
