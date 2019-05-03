import React from "react";
import "./Board.css";

const renderCelMyBoard = (rowIndex, cellIndex, symbol, hasTurn) => {
  return (
    <td className="board-tile" key={`0-${rowIndex}-${cellIndex}`}>
      <span className="emoji">{symbol || "-"}</span>
    </td>
  );
};

export const MyBoard = ({ board }) => {
  return board.map((cells, rowIndex) => (
    <table align="center">
      <tbody>
        <tr key={`0-${rowIndex}`}>
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
      key={`1-${rowIndex}-${cellIndex}`}
    >
      <span className="emoji">{symbol || "🌲"}</span>
    </button>
  );
};

export const GuessBoard = ({ board, makeMove }) =>
  board.map((cells, rowIndex) => (
    <div key={`1-${rowIndex}`}>
      {cells.map((symbol, cellIndex) =>
        renderCelGuessBoard(makeMove, rowIndex, cellIndex, symbol, false)
      )}
    </div>
  ));
