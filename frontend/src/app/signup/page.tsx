'use client';

import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { MissionRole } from '../../types/auth';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, signUp, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/app');
    }
  }, [isLoading, isAuthenticated, router]);

  const [name, setName] = useState('');
  const [role, setRole] = useState<MissionRole>('Flight Engineer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameId = useId();
  const roleId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const ackId = useId();

  // Password strength evaluation
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthConfig = [
    { label: 'Very Weak', color: 'bg-red-400', textColor: 'text-red-700' },
    { label: 'Weak', color: 'bg-orange-400', textColor: 'text-orange-700' },
    { label: 'Moderate', color: 'bg-amber-400', textColor: 'text-amber-700' },
    { label: 'Strong', color: 'bg-[#247A55]', textColor: 'text-[#247A55]' }
  ];

  const currentStrength = strengthScore > 0 ? strengthConfig[strengthScore - 1] : { label: 'Empty', color: 'bg-gray-200', textColor: 'text-gray-400' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (strengthScore < 3) {
      setErrorMessage('Please create a stronger passcode (minimum 8 chars with uppercase, number, or symbol).');
      return;
    }

    if (!acknowledged) {
      setErrorMessage('Please acknowledge the prototype operational research guidelines.');
      return;
    }

    setSubmitting(true);
    try {
      await signUp(name, email, password, acknowledged, role);
      router.push('/app');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to initialize astronaut profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Astronaut Profile"
      subtitle="Initialize baseline telemetry and register your crew profile."
      quote="“Crew health autonomy during long-duration exploration relies on transparent baseline calibration before departure.”"
      quoteAuthor="NASA Astronaut Selection & Medical Operations"
      imageSrc="/images/nasa/iss-exercise-ared.jpg"
      imageAlt="Astronaut exercising aboard ISS"
    >
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F5C2B8] text-[#9A2215] text-xs flex items-start gap-2.5" role="alert">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor={nameId} className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Full Name & Rank
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <User size={16} />
            </div>
            <input
              id={nameId}
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Alex Vance"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
            />
          </div>
        </div>

        {/* Mission Role */}
        <div>
          <label htmlFor={roleId} className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Mission Assignment / Role
          </label>
          <select
            id={roleId}
            value={role}
            onChange={(e) => setRole(e.target.value as MissionRole)}
            className="w-full px-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all font-medium"
          >
            <option value="Commander">Commander (CDR)</option>
            <option value="Medical Officer">Medical Officer (SMO)</option>
            <option value="Science Officer">Science Officer (SO)</option>
            <option value="Flight Engineer">Flight Engineer (FE)</option>
            <option value="Mission Specialist">Mission Specialist (MS)</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label htmlFor={emailId} className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Mission Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <Mail size={16} />
            </div>
            <input
              id={emailId}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.vance@aahms.nasa.gov"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor={passwordId} className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Terminal Passcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <Lock size={16} />
            </div>
            <input
              id={passwordId}
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
              aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Strength Meter */}
          {password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#60716E]">Passcode Strength:</span>
                <span className={`font-bold ${currentStrength.textColor}`}>{currentStrength.label}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-full transition-all ${
                      step < strengthScore ? currentStrength.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#60716E] pt-1">
                <span className={hasLength ? 'text-[#247A55] font-semibold' : ''}>
                  {hasLength ? '✓' : '•'} 8+ characters
                </span>
                <span className={hasUpper ? 'text-[#247A55] font-semibold' : ''}>
                  {hasUpper ? '✓' : '•'} Uppercase letter
                </span>
                <span className={hasNumber ? 'text-[#247A55] font-semibold' : ''}>
                  {hasNumber ? '✓' : '•'} Number
                </span>
                <span className={hasSpecial ? 'text-[#247A55] font-semibold' : ''}>
                  {hasSpecial ? '✓' : '•'} Special symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor={confirmPasswordId} className="block text-xs font-bold text-[#172A2B] mb-1.5">
            Confirm Terminal Passcode
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#60716E]">
              <Lock size={16} />
            </div>
            <input
              id={confirmPasswordId}
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter passcode"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#D9E2DE] text-[#172A2B] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#176B68] focus:border-transparent transition-all placeholder:text-[#8C9E9A]"
            />
          </div>
        </div>

        {/* Prototype Acknowledgment Checkbox */}
        <div className="pt-1">
          <label htmlFor={ackId} className="flex items-start gap-2.5 cursor-pointer text-xs text-[#172A2B] leading-relaxed">
            <input
              id={ackId}
              type="checkbox"
              required
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[#D9E2DE] text-[#176B68] focus:ring-[#176B68]"
            />
            <span>
              I acknowledge that AAHMS is an operational concept prototype developed for the NASA Space Apps Challenge 2026 and not a certified clinical medical device.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Initializing Astronaut Workspace...</span>
            </>
          ) : (
            <>
              <span>Initialize Astronaut Profile</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Link to Login */}
      <div className="mt-6 pt-5 border-t border-[#D9E2DE] text-center text-xs text-[#60716E]">
        <span>Already have an active profile? </span>
        <Link href="/login" className="font-bold text-[#176B68] hover:underline">
          Sign in to terminal
        </Link>
      </div>
    </AuthLayout>
  );
}
