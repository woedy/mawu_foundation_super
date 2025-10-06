import { getErrorMessage } from '../lib/api';
import { Body } from '../design-system';

export interface ErrorBannerProps {
  error: Error;
  message?: string;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

/**
 * ErrorBanner component for displaying inline error messages
 * when using fallback data or for non-critical errors.
 */
export const ErrorBanner = ({
  error,
  message,
  onDismiss,
  showDismiss = false,
}: ErrorBannerProps) => {
  const errorMessage = message || getErrorMessage(error);

  return (
    <div
      className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-amber-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <Body variant="default" className="text-sm text-amber-800">
            {errorMessage}
          </Body>
        </div>

        {/* Dismiss Button */}
        {showDismiss && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-50"
            aria-label="Dismiss"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
