import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="min-h-[60dvh] flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Algo deu errado
        </h1>
        <p className="text-muted-foreground max-w-md">
          Ocorreu um erro inesperado nesta página. Tente novamente ou recarregue.
        </p>
        {import.meta.env.DEV && this.state.error && (
          <pre className="max-w-xl text-xs text-left bg-muted p-3 rounded overflow-auto">
            {this.state.error.message}
          </pre>
        )}
        <div className="flex gap-3">
          <Button onClick={this.handleReset} variant="outline" className="gap-2 cursor-pointer">
            <RotateCcw className="h-4 w-4" /> Tentar novamente
          </Button>
          <Button onClick={this.handleReload} className="cursor-pointer">
            Recarregar página
          </Button>
        </div>
      </div>
    );
  }
}
