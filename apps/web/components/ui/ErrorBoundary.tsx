// ErrorBoundary UI primitive (stub)
import React from "react";
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return <div className="text-red-500">Something went wrong.</div>;
    return this.props.children;
  }
}
