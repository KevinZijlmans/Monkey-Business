import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board, Row } from "./entities";

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  validate(board: Board) {
    const symbols = [false, true, null, "B", "S"];
    return (
      board.length === 3 &&
      board.every(
        row => row.length === 3 && row.every(symbol => symbols.includes(symbol))
      )
    );
  }
}

export function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// export const calculateWinner = (board: Board): Color | null =>
//   board
//     .concat(
//       // vertical winner
//       [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
//     )
//     .concat([
//       // diagonal winner ltr
//       [0, 1, 2].map(n => board[n][n]),
//       // diagonal winner rtl
//       [0, 1, 2].map(n => board[2 - n][n])
//     ] as Row[])
//     .filter(row => row[0] && row.every(symbol => symbol === row[0]))
//     .map(row => row[0])[0] || null;

export const finished = (board: Board): boolean =>
  board.reduce((a, b) => a.concat(b) as Row).every(symbol => symbol !== null);
