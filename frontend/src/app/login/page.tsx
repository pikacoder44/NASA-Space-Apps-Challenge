'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Shield, X } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/app';

  const { isAuthenticated, signIn, signInWithGoogle, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextUrl);
    }
  }, [isLoading, isAuthenticated, router, nextUrl]);

  const [email, setEmail] = useState('commander@aahms.nasa.gov');
  const [password, setPassword] = useState('Apollo-2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      await signIn(email, password, rememberTerminal);
      router.push(nextUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (role: 'commander' | 'doctor') => {
    if (role === 'commander') {
      setEmail('commander@aahms.nasa.gov');
      setPassword('Apollo-2026!');
    } else {
      setEmail('doctor@aahms.nasa.gov');
      setPassword('Apollo-2026!');
    }
    setErrorMessage(null);
  };

  const handleGoogleDemoConfirm = async () => {
    setShowGoogleModal(false);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push(nextUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google demo sign-in failed.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Crew Terminal Access"
      subtitle="Sign in to your autonomous health monitoring workspace."
      quote="“Microgravity alters bone, cardiovascular dynamics, and circadian rhythm. Continuous telemetry is our frontline defense against spaceflight health risks.”"
      quoteAuthor="NASA Human Research Program (HRP)"
      imageSrc="/images/nasa/iss-cupola-earth.jpg"
      imageAlt="Earth viewed through the ISS Cupola module"
    >
      {/* Quick Demo Pre-Fill Bar */}
      <div className="mb-5 p-3 rounded-xl bg-[#DCEDEA]/60 border border-[#B6D6D0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#176B68] flex items-center gap-1.5">
          <UserCheck size={15} />
          <span>Quick Demo Roles:</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('commander')}
            className="px-2.5 py-1 rounded bg-white text-[#172A2B] hover:bg-[#176B68] hover:text-white font-semibold shadow-2xs border border-[#B6D6D0] transition-colors cursor-pointer"
          >
            Commander (CDR-01)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('doctor')}
            className="px-2.5 py-1 rounded bg-white text-[#172A2B] hover:bg-[#176B68] hover:text-white font-semibold shadow-2xs border border-[#B6D6D0] transition-colors cursor-pointer"
          >
            Medical Officer (SMO-02)
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F5C2B8] text-[#9A2215] text-xs flex items-start gap-2.5" role="alert">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">{errorMessage}</p>
            <p className="text-[11px] text-[#9A2215]/80">
              Tip: Click one of the quick demo buttons above to pre-fill the default astronaut credentials.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Mission Email / Call Sign
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <Mail size={16} />
            </div>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="astronaut@aahms.nasa.gov"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold text-[#172A2B]">
              Terminal Passcode
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#176B68] hover:underline"
            >
              Forgot passcode?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <Lock size={16} />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#60716E] hover:text-[#172A2B] cursor-pointer"
              aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Terminal Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#172A2B]">
            <input
              type="checkbox"
              checked={rememberTerminal}
              onChange={(e) => setRememberTerminal(e.target.checked)}
              className="w-4 h-4 rounded border-[#D9E2DE] text-[#176B68] focus:ring-[#176B68]"
            />
            <span>Remember this terminal session</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Terminal Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Terminal</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D9E2DE]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#60716E] font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Demo Button */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-[#D9E2DE] hover:bg-[#F4F6F4] text-[#172A2B] font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Demo)</span>
        </button>
      </form>

      {/* Link to Signup */}
      <div className="mt-6 pt-5 border-t border-[#D9E2DE] text-center text-xs text-[#60716E]">
        <span>New astronaut profile? </span>
        <Link href="/signup" className="font-bold text-[#176B68] hover:underline">
          Create an astronaut account
        </Link>
      </div>

      {/* Google Demo Explanation Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#D9E2DE] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#176B68]" />
                <h3 className="font-bold text-sm text-[#172A2B]">Demo Mode Notice</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-[#60716E] hover:text-[#172A2B] p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#172A2B]">
              <p className="leading-relaxed">
                Google sign-in is not connected in demo mode.
              </p>
              <p className="text-[#60716E] leading-relaxed">
                Clicking the button below will immediately initialize a pre-configured astronaut demo session so you can evaluate the entire health monitoring interface.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="px-3.5 py-2 rounded-lg border border-[#D9E2DE] text-xs font-semibold text-[#60716E] hover:bg-[#F4F6F4] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoogleDemoConfirm}
                className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] shadow-xs cursor-pointer"
              >
                Continue with a demo account
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6F4] flex items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-[#176B68]/30 border-t-[#176B68] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
