import React from "react";
import "./Board.css";

const renderCelMyBoard = (rowIndex, cellIndex, symbol, hasTurn) => {
  return (
    <td className="board-tile" key={`${rowIndex}-${cellIndex}`}>
      {symbol || "-"}
    </td>
  );
};

export const MyBoard = ({ board }) => {
  return board.map((cells, rowIndex) => (
    <table>
      <tbody>
        <tr key={rowIndex}>
          {cells.map((symbol, cellIndex) =>
            renderCelMyBoard(rowIndex, cellIndex, symbol, false)
          )}
        </tr>
      </tbody>
    </table>
  ));
};

const renderCelGuessBoard = (
  makeMove,
  rowIndex,
  cellIndex,
  symbol,
  hasTurn
) => {
  return (
    <button
      className="board-tile"
      disabled={hasTurn}
      onClick={() => makeMove(rowIndex, cellIndex)}
      key={`${rowIndex}-${cellIndex}`}
    >
      {symbol || "-"}
    </button>
  );
};

export const GuessBoard = ({ board, makeMove }) =>
  board.map((cells, rowIndex) => (
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) =>
        renderCelGuessBoard(makeMove, rowIndex, cellIndex, symbol, false)
      )}
    </div>
  ));
