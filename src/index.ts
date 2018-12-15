import BoardStandalone from './components/squaresSandbox/BoardStandalone';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function renderBoard(container: HTMLElement): void {
  ReactDOM.render(
    React.createElement(BoardStandalone),
    container
  );
}
