import React, { useCallback, useState } from "react";
import { buildBoard, PLACEHOLDER, solveSudoku, checkBoard, buildExample } from "../utils";
import './styles.css'

const Board = (): JSX.Element => {
  const [board, setBoard] = useState<number[][]>(() => buildBoard());
  const [, setToggle] = useState(false);
  
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, i: number, j: number) => {
    const value = !!event.target.value ? parseInt(event.target.value, 10) : -1;
    board[i][j] = Number.isNaN(value) || value <= 0 || value > 9 ? -1 : value;
    setBoard(board);
    setToggle(t => !t)
  }, [board]);

  const onClick = useCallback(() => {
    if (!checkBoard(board)) {
      alert('invalid board')
      return;
    }
    solveSudoku(board);
    setBoard(board);
    setToggle(t => !t);
  }, [board]);

  const reset = useCallback(() => {
    const newBoard = buildBoard();
    setBoard(newBoard);
  }, [])

  const setExample = useCallback(() => {
    setBoard(buildExample())
  }, []);

  return (
    <>
    <h1 className="title">Sudoku solver</h1>
      <table className="board">
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx}>
                    <input
                      type="text"
                      maxLength={1}
                      value={board[rowIdx][colIdx] === PLACEHOLDER ? '' : board[rowIdx][colIdx].toString()}
                      onChange={(event) => onChange(event, rowIdx, colIdx)}
                    />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button onClick={setExample}>example</button>
        <button onClick={onClick}>solve it</button>
        <button onClick={reset}>reset</button>
      </div>
    </>
  )
}

export default Board;