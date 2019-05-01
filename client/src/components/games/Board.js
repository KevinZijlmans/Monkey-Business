import React from "react";
import "./Board.css";

const renderCelMyBoard = (makeMove, rowIndex, cellIndex, symbol, hasTurn) => {
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

export const myBoard = ({ board, makeMove }) =>
  board.map((cells, rowIndex) => (
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) =>
        renderCelMyBoard(makeMove, rowIndex, cellIndex, symbol, false)
      )}
    </div>
  ));

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

export const guessBoard = ({ board, makeMove }) =>
  board.map((cells, rowIndex) => (
    <div key={rowIndex}>
      {cells.map((symbol, cellIndex) =>
        renderCelGuessBoard(makeMove, rowIndex, cellIndex, symbol, false)
      )}
    </div>
  ));
