import { Component } from "react";

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main>
        <h1>Something went wrong</h1>
        <p role="alert">
          We could not display the application. Please reload the page and try
          again.
        </p>
        <button type="button" onClick={this.handleReload}>
          Reload page
        </button>
      </main>
    );
  }
}

export default AppErrorBoundary;
