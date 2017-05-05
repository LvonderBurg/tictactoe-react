import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

//// helper functions /////
function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a]
  }
  return null
}

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
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

class Game extends React.Component {
  constructor () {
    super()
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick (i) {
    console.log(`click of button ${i} handled by the Board's handleClick method`)
    const history = this.state.history.slice(0, this.state.stepNumber + 1) // only use the history up to the current time step
    const current = history[history.length - 1]
    const squares = current.squares.slice()    // to make a copy of the array
    if (calculateWinner(squares) || squares[i]) {   // if there's a winner or if the field is filled already
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    history.push({ squares: squares })
    this.setState({
      history: history,
      stepNumber: history.length - 1,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    })
  }

  render() {
    const history = this.state.history
    const currStep = this.state.stepNumber
    const current = history[currStep]
    const winner = calculateWinner(current.squares)

    const moves = history.map((_, i) => {
      const desc = i ? `Move #${i}` : 'Game start'
      return (
        <li key={i}>
          <a href='#'
            onClick={() => this.jumpTo(i)}
            className={i > currStep ? 'future' : 'past'}
          >{desc}</a>
        </li>
      )
    })
    let status  // random comment
    if (winner) {
      status = `Winner: ${winner}`
      setTimeout(() => {
        if (confirm("New game?")) {
          this.setState({
            history: [{
              squares: Array(9).fill(null)
            }],
            xIsNext: true
          })
        }
      }, 500)
    } else {
      const allFieldsFilled = current.squares.reduce((prev, el) => prev && (el?true:false), true)
      if (allFieldsFilled) {
        status = `No winner. Reloading...`
        setTimeout(() => {
          this.setState({
            history: [{
              squares: Array(9).fill(null)
            }],
            xIsNext: true
          })
        }, 1000)
      } else {
        status = `Next player: ${this.state.xIsNext?'X':'O'}`
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
