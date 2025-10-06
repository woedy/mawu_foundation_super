import { getErrorMessage } from '../lib/api';
import { Button, Heading, Body, Section } from '../design-system';

export interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
  showRetry?: boolean;
}

/**
 * ErrorState component for displaying API errors with user-friendly messages
 * and optional retry functionality.
 */
export const ErrorState = ({
  error,
  onRetry,
  title = 'Unable to Load Content',
  showRetry = true,
}: ErrorStateProps) => {
  const errorMessage = getErrorMessage(error);

  return (
    <Section background="default" padding="lg">
      <div className="mx-auto max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <Heading level={2} className="text-2xl">
          {title}
        </Heading>

        {/* Error Message */}
        <Body variant="muted" className="text-base">
          {errorMessage}
        </Body>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <div className="pt-2">
            <Button onClick={onRetry} variant="primary" size="md">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
};
