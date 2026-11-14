'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Strength check
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthScore = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (strengthScore < 3) {
      setErrorMessage('Please use a stronger passcode (at least 8 chars with uppercase, number, or symbol).');
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMessage(result.message || 'Failed to update passcode.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update passcode.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Calibrate New Passcode"
      subtitle="Establish a new authentication credential for your terminal session."
      quote="“Zero-trust verification protocols ensure data integrity across all deep-space mission systems.”"
      quoteAuthor="NASA Systems Safety Engineering"
      imageSrc="/images/nasa/mars-transit-concept.jpg"
      imageAlt="Orion spacecraft deep space transit"
    >
      {success ? (
        <div className="space-y-5 animate-in fade-in duration-200 text-center">
          <div className="w-12 h-12 rounded-full bg-[#E4F2E9] text-[#247A55] flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#172A2B]">Passcode Calibrated</h2>
            <p className="text-xs text-[#60716E] leading-relaxed">
              Your mission credentials have been securely updated using salted Web Crypto encryption in local storage.
            </p>
          </div>

          <Link
            href="/login"
            className="w-full py-3 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In with New Credentials</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F5C2B8] text-[#9A2215] text-xs flex items-start gap-2.5" role="alert">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          {emailParam && (
            <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE] text-xs text-[#60716E]">
              Resetting credentials for: <span className="font-bold text-[#172A2B]">{emailParam}</span>
            </div>
          )}

          <div>
            <label htmlFor="reset-new-password" className="block text-xs font-bold text-[#172A2B] mb-1.5">
              New Terminal Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
                <Lock size={16} />
              </div>
              <input
                id="reset-new-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#60716E] hover:text-[#172A2B] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="reset-confirm-password" className="block text-xs font-bold text-[#172A2B] mb-1.5">
              Confirm New Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
                <Lock size={16} />
              </div>
              <input
                id="reset-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new passcode"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Calibrating Passcode...</span>
              </>
            ) : (
              <>
                <span>Save New Passcode</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#176B68]/30 border-t-[#176B68] rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
