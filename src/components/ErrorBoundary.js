import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong.</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">An unexpected error occurred. Please try reloading the page.</p>
          {this.state.error && (
            <pre className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded p-4 mb-4 text-left max-w-xl overflow-x-auto">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 