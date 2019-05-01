import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToOne
} from "typeorm";
import User from "../users/entity";

export type Color = "blue" | "red" | null;
export type Symbol = false | true;
export type Row = [Symbol | null, Symbol | null, Symbol | null];
export type Board = [Row, Row, Row];

type Status = "pending" | "started" | "finished";

const emptyRow: Row = [false, false, false];
const emptyBoard: Board = [emptyRow, emptyRow, emptyRow];

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("json", { default: emptyBoard })
  my_board: Board;

  @Column("json", { default: emptyBoard })
  guess_board: Board;

  @Column("char", { length: 1, default: "blue" })
  turn: Color;

  @Column("char", { length: 1, nullable: true })
  winner: Color;

  @Column("text", { default: "pending" })
  status: Status;

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[];
}

@Entity()
@Index(["game", "user", "color"], { unique: true })
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(_ => User, user => user.players)
  user: User;

  @ManyToOne(_ => Game, game => game.players)
  game: Game;

  @Column("char", { length: 1 })
  color: Color;

  @Column("integer", { name: "user_id" })
  userId: number;
}
