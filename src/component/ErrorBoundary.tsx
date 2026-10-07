import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EcoSnap React ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b1329] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl glass-panel border border-amber-500/40 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                EcoSnap encountered a rendering issue. Click below to recover safely.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-300 text-left overflow-x-auto max-h-28">
              {this.state.error?.message || 'Unknown render exception'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset & Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
