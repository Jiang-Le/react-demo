import { useState } from 'react';

function Square({value, hightlight, handleSquareClick}) {
  return <button className={hightlight?'hightlight-square': 'square'} onClick={handleSquareClick}>{value}</button>;
}

function Board({row, col, boardValues, hightlightCells, onCellClick}) {
  function handleSquareClick(idx) {
    const r = parseInt(idx / col)
    const c = idx % col
    onCellClick(r, c)
  }

  function isHightlightCell(idx) {
    if (!hightlightCells) {
      return false
    }
    for (let v of hightlightCells) {
      if (v == idx) {
        return true
      }
    }
    return false
  }

  let board = [];
  for (let i = 0; i < row; i++) {
    let cols = [];
    for (let j = 0; j < col; j++) {
      let idx = i*col+j
      let value = boardValues[idx]
      cols.push(<Square key={idx} value={value} hightlight={isHightlightCell(idx)} handleSquareClick={() => handleSquareClick(idx)}/>)
    }
    board.push(<div key={i} className="board-row">{cols}</div>)
  }

  return <>
    {board}
  </>
}

function StateBanner({winner, full, nextPlayer}) {
  let state = null;
  if (winner) {
    state = "Winner: " + winner
  } else if  (full) {
    state = "Game draw"
  }  else {
    state = "Next player: " + nextPlayer
  }
  return <div className='status'>{state}</div>
}

function HistoryPanel({historys, stepHistorys, jumpTo}) {
  const [ascOrder, setAscOrder] = useState(true)
  let moves = historys.map((boardValues, step) => {
    let desc;
    if (step > 0) {
      const stepHistory = stepHistorys[step]
      desc = "Player " + stepHistory.player +" go to move #" + step + "(" + stepHistory.row + ", " + stepHistory.col + ")"

    } else {
      desc = "Go to game start"
    }
    return <li key={step}>
      <button onClick={() => jumpTo(step)}>{desc}</button>
    </li>
  })
  if (!ascOrder) {
    moves = moves.reverse()
  }
  return <ol>
    <button onClick={()=>setAscOrder(!ascOrder)}>{ascOrder ? "降序⬇️":"升序⬆️"}</button>
    {moves}
  </ol>
}

export default function Game() {
  let [row, col] = [3, 3]
  const [history, setHistory] = useState([Array(row*col).fill(null)])
  const [stepHistory, setStepHistory] = useState([null])
  const [curStep, setCurStep] = useState(0)

  const boardValues = history.at(curStep)

  const winnerPos = findWinner(boardValues)
  let winner = null
  if (winnerPos) {
    winner = boardValues[winnerPos[0]]
  }
  let nextPlayer = calculatePlayer(curStep)

  function handleCellClick(r, c) {
    const idx = r * col + c

    if (winner) {
      return
    }
    if (boardValues[idx]) {
      return
    }

    const next = boardValues.slice()
    next[idx] = calculatePlayer(curStep)
    setCurStep(curStep + 1)
    setHistory([...history.slice(0, curStep+1), next])
    setStepHistory([...stepHistory.slice(0, curStep+1), {row: r, col: c, player: nextPlayer}])
  }

  function jumpTo(step) {
    setCurStep(step)
  }

  function calculatePlayer(currentStep) {
    return currentStep % 2 === 0 ? 'X' : 'O'
  }

  function isFull(boardValues) {
    if (!boardValues) {
      return false
    }
    for (let v of boardValues) {
      if (!v) {
        return false
      }
    }
    return true
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <StateBanner winner={winner} full={isFull(boardValues)} nextPlayer={nextPlayer}/>
        <Board row={3} col={3} boardValues={boardValues} hightlightCells={winnerPos} onCellClick={handleCellClick}/>
      </div>
      <div className='game-info'>
        <HistoryPanel historys={history} stepHistorys={stepHistory} jumpTo={jumpTo}/>
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