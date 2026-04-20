import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(): void {}

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="font-heading text-2xl text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              The workflow canvas failed to render. Refresh the page and try again.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
