import { useState } from 'react';

function Square({idx, value, handleSquareClick}) {
  return <button className="square" onClick={()=>handleSquareClick(idx)}>{value}</button>;
}

function Board({row, col}) {

  const [squareValues, setSquareValues] = useState(Array(row*col).fill(null))  
  const [step, setStep] = useState(0)

  const winnerPos = findWinner(squareValues)
  let winner = null
  if (winnerPos) {
    winner = squareValues[winnerPos[0]]
  }

  let state = null
  if (winner) {
    state = "Winner: " + winner
  } else {
    state = "Next player: " + calculatePlayer(step)
  }


  function handleSquareClick(idx) {
    if (findWinner(squareValues)) {
      return
    }
    if (squareValues[idx]) {
      return
    }
    const nextSquare = squareValues.slice()
    nextSquare[idx] = calculatePlayer(step)
    setStep(step + 1)
    setSquareValues(nextSquare)
  }

  function calculatePlayer(currentStep) {
    return currentStep % 2 === 0 ? 'X' : 'O'
  }


  let board = [];
  for (let i = 0; i < row; i++) {
    let cols = [];
    for (let j = 0; j < col; j++) {
      let idx = i*col+j
      let value = squareValues[idx]
      cols.push(<Square idx={idx} value={value} handleSquareClick={handleSquareClick}/>)
    }
    board.push(<div className="board-row">{cols}</div>)
  }

  return <>
    <div className="status">{state}</div>
    {board}
  </>
}

export default function Game() {
  return <><Board row={3} col={3}/></>
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