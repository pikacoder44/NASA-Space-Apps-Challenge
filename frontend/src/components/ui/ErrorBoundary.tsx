'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, AlertOctagon } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  widgetName?: string;
  title?: string;
  message?: string;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  variant?: 'card' | 'inline' | 'compact' | 'page';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable React ErrorBoundary for AstroTrack telemetry & dashboard widgets.
 * Catches unhandled rendering and lifecycle exceptions in child components
 * and prevents the entire flight cockpit from crashing.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `[AstroTrack ErrorBoundary: ${this.props.widgetName || 'Widget'}] Caught rendering error:`,
        error,
        errorInfo
      );
    }
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (err) {
        console.error('Error in ErrorBoundary onError callback:', err);
      }
    }
  }

  public reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { fallback, widgetName, title, message, variant = 'card' } = this.props;
    const error = this.state.error || new Error('Unknown rendering error');

    // Custom fallback function or ReactNode
    if (typeof fallback === 'function') {
      return fallback(error, this.reset);
    }
    if (fallback) {
      return fallback;
    }

    const displayTitle = title || (widgetName ? `Unable to load ${widgetName}` : 'Module Render Error');
    const displayMessage =
      message || 'A telemetry rendering issue occurred in this module. Other flight cockpit panels remain active.';

    // Compact variant: designed to fit neatly inside a grid card (e.g. an indicator tile)
    if (variant === 'compact') {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-2xl bg-[#FEF8EC] border border-[#F3DB9A] flex flex-col justify-between h-full min-h-[160px] text-xs"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#8A520F] font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#8A520F]" />
              <span className="truncate">{displayTitle}</span>
            </div>
            <p className="text-[#60716E] text-[11px] leading-relaxed line-clamp-3">
              {displayMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={this.reset}
            className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-[#EED8A7] text-[#8A520F] hover:bg-[#FBF0D9] transition-colors touch-manipulation cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    // Inline variant: for thin banners on lists
    if (variant === 'inline') {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3 rounded-xl bg-[#FEF8EC] border border-[#F3DB9A] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
        >
          <div className="flex items-center gap-2 text-[#8A520F]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{displayTitle} — {displayMessage}</span>
          </div>
          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-[#EED8A7] text-[#8A520F] hover:bg-[#FBF0D9] cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      );
    }

    // Page variant: for full-page views
    if (variant === 'page') {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-5 text-center"
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FBF0D9] border border-[#EED8A7] flex items-center justify-center text-[#8A520F]">
            <AlertOctagon className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-[#172A2B]">{displayTitle}</h2>
            <p className="text-sm text-[#60716E] max-w-md mx-auto leading-relaxed">
              {displayMessage}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-[#176B68] text-white hover:bg-[#125553] shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        </div>
      );
    }

    // Default card variant: for charts, assessments, lists, and widget cards
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-4"
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D9E2DE]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FEF8EC] border border-[#F3DB9A] flex items-center justify-center text-[#8A520F] shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172A2B]">{displayTitle}</h3>
              <p className="text-xs font-medium text-[#60716E]">Flight Telemetry Protection Active</p>
            </div>
          </div>

          <button
            type="button"
            onClick={this.reset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#176B68] text-white hover:bg-[#125553] transition-all touch-manipulation cursor-pointer shadow-xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>

        <p className="text-xs leading-relaxed text-[#60716E]">
          {displayMessage}
        </p>
      </div>
    );
  }
}

export default ErrorBoundary;
