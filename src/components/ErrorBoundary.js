import React, { Suspense } from 'react';
import { AlertTriangle, RefreshCw, Home, FileText, Bug } from 'lucide-react';

// Lazy load CustomButton
const CustomButton = React.lazy(() => import('./globalComponents/CustomButton.js'));

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

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Main Error Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Oops! Something went wrong</h1>
                    <p className="text-red-100 text-sm">We encountered an unexpected error</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bug className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Application Error
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    We're sorry, but something unexpected happened. Our team has been notified and we're working to fix this issue.
                  </p>
                </div>

                {/* Error Details (Collapsible) */}
                {this.state.error && (
                  <div className="mb-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Error Details
                        </span>
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                        <pre className="text-xs text-red-800 dark:text-red-200 overflow-x-auto whitespace-pre-wrap font-mono">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Suspense fallback={
                    <button 
                      onClick={this.handleReload}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reload Page</span>
                    </button>
                  }>
                    <CustomButton
                      onClick={this.handleReload}
                      text="Reload Page"
                      variant="primary"
                      size="lg"
                      icon={RefreshCw}
                      className="flex-1"
                    />
                  </Suspense>
                  
                  <Suspense fallback={
                    <button 
                      onClick={this.handleGoHome}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Go Home</span>
                    </button>
                  }>
                    <CustomButton
                      onClick={this.handleGoHome}
                      text="Go Home"
                      variant="outline"
                      size="lg"
                      icon={Home}
                      className="flex-1"
                    />
                  </Suspense>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    If this problem persists, please contact support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 