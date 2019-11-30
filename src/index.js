import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function HistoryButton(props) {
  return (
    <li>
      <button onClick={props.onClick}>
        {props.desc}
      </button>
    </li>
  )
}

function CurrentHistoryButton(props) {
  return (
    <li>
      <button onClick={props.onClick}>
        <strong>{props.desc}</strong>
      </button>
    </li>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      history: [{
        squares: Array(9).fill(null), col: null, row: null
      }],
      xIsNext: true,
      stepNumber: 0,
      columns: {
        "0": 1,
        "3": 1,
        "6": 1,
        "1": 2,
        "4": 2,
        "7": 2,
        "2": 3,
        "5": 3,
        "8": 3
      },
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const stepNumber = this.state.stepNumber + 1;
    const column = this.state.columns[i.toString()];
    let row = Math.ceil((i + 1) / 3);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([{
        squares: squares,
        col: column,
        row: row,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: stepNumber,
    });
  }

  jumpTo(moveIndex) {
    this.setState({
      stepNumber: moveIndex,
      xIsNext: (moveIndex % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, moveIndex) => {
      const desc = moveIndex ?
        'Go to move #' + moveIndex + ' (' + step.col + ',' + step.row + ')' :
        'Got to game start';

      const strong = this.state.stepNumber === moveIndex;

      if (strong) {
        return <CurrentHistoryButton key={moveIndex} moveIndex={moveIndex} desc={desc} onClick={() => this.jumpTo(moveIndex)} />;
      } else {
        return <HistoryButton key={moveIndex} moveIndex={moveIndex} desc={desc} onClick={() => this.jumpTo(moveIndex)} />;
      }
    });

    let status;
    switch (winner) {
      case 'No Winner':
        status = winner
        break;
      case null:
        status = "Next player: " + (this.state.xIsNext ? "X" : "O")
        break;
      default:
        status = "Winner: " + winner;
        break;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  const noWinner = squares.every((square) => {
    return square;
  });

  if (noWinner) {
    return "No Winner";
  }

  return null;
}


// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
