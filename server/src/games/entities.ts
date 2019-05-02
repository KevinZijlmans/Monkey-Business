import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne
} from "typeorm";
import User from "../users/entity";

export type Color = "blue" | "red" | true | false;
export type Boat = "⛵";
export type Sea = "🌊";
export type Symbol = false | true | Boat | Sea | "💥" | "💦";
export type Row = [Symbol | null, Symbol | null, Symbol | null];
export type Board = [Row, Row, Row];

type Status = "pending" | "started" | "finished";

const guessEmptyRow: Row = [false, false, false];
const guessEmptyBoard: Board = [guessEmptyRow, guessEmptyRow, guessEmptyRow];

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("char", { length: 4, default: "blue" })
  turn: Color;

  @Column("char", { length: 4, nullable: true })
  winner: Color;

  @Column("text", { default: "pending" })
  status: Status;

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[];
}

@Entity()
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(_ => User, user => user.players)
  user: User;

  @ManyToOne(_ => Game, game => game.players)
  game: Game;

  @Column("char", { length: 4 })
  color: Color;

  @Column("integer", { default: 0 })
  hitCount: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("json")
  my_board: Board;

  @Column("json", { default: guessEmptyBoard })
  guess_board: Board;
}
