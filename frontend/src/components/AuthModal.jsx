import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Github, Mail, Lock, User } from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { playClick, playSuccess } = useAudio();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    playSuccess();
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] text-[#9694A8] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] flex items-center justify-center mb-4 shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold font-heading text-white">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h3>
          <p className="text-xs sm:text-sm text-[#9694A8] mt-1">
            {mode === 'login'
              ? 'Enter your details to access your saved course preferences.'
              : 'Sign up to personalize and bookmark your AI recommendations.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#68667A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] text-sm text-white outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#68667A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#68667A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] text-sm text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7073FA] text-white font-semibold text-sm shadow-glow-sm transition-all"
          >
            {mode === 'login' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-[#9694A8]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[#A78BFA] hover:text-white font-semibold underline underline-offset-2 ml-1"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[#A78BFA] hover:text-white font-semibold underline underline-offset-2 ml-1"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

