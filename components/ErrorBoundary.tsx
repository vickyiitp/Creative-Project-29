import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-mono text-green-500">
          <div className="max-w-md w-full bg-slate-800 border-2 border-red-500/50 rounded-lg p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <ShieldAlert size={32} />
              <h1 className="text-2xl font-bold tracking-widest">CRITICAL_ERROR</h1>
            </div>

            <div className="bg-black/50 p-4 rounded mb-6 border border-slate-700 h-32 overflow-auto">
              <p className="text-xs text-red-400 mb-2">// STACK_TRACE_DUMP</p>
              <code className="text-xs opacity-70 break-words">
                {this.state.error?.toString()}
              </code>
            </div>

            <p className="text-slate-400 text-sm mb-6">
              The application encountered an unexpected runtime exception. The process has been halted to prevent memory corruption.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-black font-bold py-3 rounded transition-all active:scale-95"
            >
              <RotateCcw size={18} />
              FORCE_SYSTEM_RESTART
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;