import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board } from "./entities";

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  validate(board: Board) {
    const symbols = [false, true, null, "B", "S"];
    return (
      board.length === 5 &&
      board.every(
        row => row.length === 5 && row.every(symbol => symbols.includes(symbol))
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
