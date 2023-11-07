import { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error: Error) {
    this.setState({
      error: error,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h2>Seems like an error occured!</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
