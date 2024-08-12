import { useState } from 'react';

function Square({idx, value, handleSquareClick}) {
  return <button className="square" onClick={()=>handleSquareClick(idx)}>{value}</button>;
}

function Board({row, col, boardValues, onCellClick}) {
  function handleSquareClick(idx) {
    const r = parseInt(idx / col)
    const c = idx % col
    onCellClick(r, c)
  }

  let board = [];
  for (let i = 0; i < row; i++) {
    let cols = [];
    for (let j = 0; j < col; j++) {
      let idx = i*col+j
      let value = boardValues[idx]
      cols.push(<Square idx={idx} value={value} handleSquareClick={handleSquareClick}/>)
    }
    board.push(<div className="board-row">{cols}</div>)
  }

  return <>
    {board}
  </>
}

function StateBanner({winner, nextPlayer}) {
  let state = null;
  if (winner) {
    state = "Winner: " + winner
  } else {
    state = "Next player: " + nextPlayer
  }
  return <div className='status'>{state}</div>
}

export default function Game() {
  const [row, col] = [3, 3]
  const [boardValues, setBoardValues] = useState(Array(row*col).fill(null))
  const [step, setStep] = useState(0)

  const winnerPos = findWinner(boardValues)
  let winner = null
  if (winnerPos) {
    winner = boardValues[winnerPos[0]]
  }
  let nextPlayer = calculatePlayer(step)

  function handleCellClick(r, c) {
    const idx = r * col + c

    if (winner) {
      return
    }
    if (boardValues[idx]) {
      return
    }

    const next = boardValues.slice()
    next[idx] = calculatePlayer(step)
    setStep(step + 1)
    setBoardValues(next)
  }

  function calculatePlayer(currentStep) {
    return currentStep % 2 === 0 ? 'X' : 'O'
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <StateBanner winner={winner} nextPlayer={nextPlayer}/>
        <Board row={3} col={3} boardValues={boardValues} onCellClick={handleCellClick}/>
      </div>
      <div className='game-info'>

      </div>
    </div>
  )
}

function findWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i].slice();
    }
  }
  return null;
}