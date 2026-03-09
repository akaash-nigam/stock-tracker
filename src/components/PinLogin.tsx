import { useState } from 'react';
import { Lock, Delete, User } from 'lucide-react';
import { hashPin } from '../lib/utils';
import { getPinHash, setPinHash, setSession } from '../lib/storage';
import { USERS } from '../types';
import type { UserName } from '../types';

interface PinLoginProps {
  onSuccess: (user: UserName) => void;
  requireCloudAuth?: boolean;
  cloudAuthed?: boolean;
  onCloudSignIn?: () => Promise<boolean>;
}

const USER_COLORS: Record<string, string> = {
  Vishal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Jinesh: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Hitesh: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Soham: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Aakash: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Sarthak: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  Amrit: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

const USER_INITIALS: Record<string, string> = {
  Vishal: 'V', Jinesh: 'J', Hitesh: 'H', Soham: 'S', Aakash: 'A', Sarthak: 'S', Amrit: 'A',
};

export default function PinLogin({ onSuccess, requireCloudAuth = false, cloudAuthed = false, onCloudSignIn }: PinLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const existingHash = getPinHash();

  async function handleSubmit() {
    if (pin.length < 4) return;

    if (!existingHash) {
      if (!isSettingPin) {
        setConfirmPin(pin);
        setIsSettingPin(true);
        setPin('');
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match. Try again.');
        setIsSettingPin(false);
        setConfirmPin('');
        setPin('');
        return;
      }
      const hash = await hashPin(pin);
      setPinHash(hash);
      setPinVerified(true);
      return;
    }

    const hash = await hashPin(pin);
    if (hash === existingHash) {
      setPinVerified(true);
    } else {
      setError('Wrong PIN');
      setPin('');
    }
  }

  function handleSelectUser(user: UserName) {
    setSession(user);
    onSuccess(user);
  }

  async function handleGoogleSignIn() {
    if (!onCloudSignIn || googleLoading) return;
    setError('');
    setGoogleLoading(true);
    const ok = await onCloudSignIn();
    setGoogleLoading(false);
    if (!ok) setError('Google sign-in failed. Please try again.');
  }

  function handleKey(key: string) {
    setError('');
    if (key === 'del') {
      setPin(p => p.slice(0, -1));
    } else if (key === 'enter') {
      handleSubmit();
    } else if (pin.length < 6) {
      setPin(pin + key);
    }
  }

  // Step 2: User selection
  if (pinVerified) {
    if (requireCloudAuth && !cloudAuthed) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
                <User className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Sign in required</h1>
              <p className="text-slate-400 mt-1 text-sm">Continue with Google to access cloud sync</p>
            </div>
            {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-semibold transition-colors"
            >
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-4">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Who's trading?</h1>
            <p className="text-slate-400 mt-1 text-sm">Select your name</p>
          </div>

          <div className="space-y-3">
            {USERS.map(user => (
              <button
                key={user}
                onClick={() => handleSelectUser(user)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${USER_COLORS[user]}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${USER_COLORS[user]}`}>
                  {USER_INITIALS[user]}
                </div>
                <span className="text-lg font-semibold">{user}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: PIN entry
  const dots = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`w-3 h-3 rounded-full border-2 transition-all ${
        i < pin.length ? 'bg-blue-500 border-blue-500 scale-110' : 'border-slate-600'
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

        <div className="flex justify-center gap-3 mb-6">{dots}</div>

        {error && (
          <p className="text-red-400 text-center text-sm mb-4">{error}</p>
        )}

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
