import { Component, ReactNode, ErrorInfo } from 'react';
import { Button, Heading, Body, Section } from '../design-system';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Section background="muted">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 text-6xl">⚠️</div>
            <Heading level={1} className="mb-4">
              Something went wrong
            </Heading>
            <Body className="mb-6" variant="muted">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </Body>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                <p className="mb-2 font-mono text-sm text-red-900">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="overflow-auto text-xs text-red-800">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={this.handleReset} variant="primary">
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="secondary">
                Go Home
              </Button>
            </div>
          </div>
        </Section>
      );
    }

    return this.props.children;
  }
}
