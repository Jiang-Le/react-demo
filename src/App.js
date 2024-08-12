function Square({idx, value, handleSquareClick}) {
  return <button className="square" onClick={()=>handleSquareClick(idx)}>{value}</button>;
}

function Board({row, col}) {
  function handleSquareClick(idx) {
    
  }

  let board = [];
  for (let i = 0; i < row; i++) {
    let cols = [];
    for (let j = 0; j < col; j++) {
      cols.push(<Square idx={row*col+col} value={null} handleSquareClick={handleSquareClick}/>)
    }
    board.push(<div className="board-row">{cols}</div>)
  }

  return <>
    {board}
  </>
}

export default function Game() {
  return <><Board row={3} col={3}/></>
}