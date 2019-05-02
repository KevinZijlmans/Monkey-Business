import {
  JsonController,
  Authorized,
  CurrentUser,
  Post,
  Param,
  BadRequestError,
  HttpCode,
  NotFoundError,
  ForbiddenError,
  Get,
  Body,
  Patch
} from "routing-controllers";
import User from "../users/entity";
import { Game, Player, Board } from "./entities";
import { IsBoard, shuffle } from "./logic";
import { Validate } from "class-validator";
import { io } from "../index";

class GameUpdate {
  @Validate(IsBoard, {
    message: "Not a valid board"
  })
  board: Board;
  my_board: Board;
  rowIndex: number;
  columnIndex: number;
}
@JsonController()
export default class GameController {
  @Authorized()
  @Post("/games")
  @HttpCode(201)
  async createGame(@CurrentUser() user: User) {
    const entity = await Game.create().save();

    await Player.create({
      game: entity,
      user,
      color: "blue",
      my_board: shuffle([
        ["🌊", "🌊", "⛵"],
        ["⛵", "🌊", "🌊"],
        ["🌊", "⛵", "🌊"]
      ])
    }).save();

    const game = await Game.findOneById(entity.id);

    io.emit("action", {
      type: "ADD_GAME",
      payload: game
    });

    return game;
  }

  @Authorized()
  @Post("/games/:id([0-9]+)/players")
  @HttpCode(201)
  async joinGame(@CurrentUser() user: User, @Param("id") gameId: number) {
    const game = await Game.findOneById(gameId);
    if (!game) throw new BadRequestError(`Game does not exist`);
    if (game.status !== "pending")
      throw new BadRequestError(`Game is already started`);

    game.status = "started";
    await game.save();

    const player = await Player.create({
      game,
      user,
      color: "red",
      my_board: shuffle([
        ["🌊", "🌊", "⛵"],
        ["⛵", "🌊", "🌊"],
        ["🌊", "⛵", "🌊"]
      ])
    }).save();

    io.emit("action", {
      type: "UPDATE_GAME",
      payload: await Game.findOneById(game.id)
    });

    return player;
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch("/games/:id([0-9]+)")
  async updateGame(
    @CurrentUser() user: User,
    @Param("id") gameId: number,
    @Body() update: GameUpdate
  ) {
    const game = await Game.findOneById(gameId);
    if (!game) throw new NotFoundError(`Game does not exist`);

    const player = await Player.findOne({ user, game });

    if (!player) throw new ForbiddenError(`You are not part of this game`);
    if (game.status !== "started")
      throw new BadRequestError(`The game is not started yet`);
    if (player.color !== game.turn)
      throw new BadRequestError(`It's not your turn`);

    // This should update the guessboard.

    const otherPlayer = game.players.find(
      anotherPlayer => anotherPlayer.color !== player.color
    );
    if (otherPlayer) {
      const x = update[0];
      const y = update[1];
      const targetRow = otherPlayer.my_board[x];
      const targetSymbol = targetRow[y];
      const isHit = targetSymbol === "⛵";
      const row = player.guess_board[x];
      row[y] = isHit ? "💥" : "💦";
      console.log(row);
      await player.save();
    }

    // const winner = calculateWinner(update.board);
    // if (winner) {
    //   game.winner = winner;
    //   game.status = "finished";
    // } else if (finished(update.board)) {
    //   game.status = "finished";
    // } else {
    //   game.turn = player.color === "blue" ? "red" : "blue";
    // }
    // game.guess_board = update.board;
    // await game.save();

    io.emit("action", {
      type: "UPDATE_GAME",
      payload: game
    });

    return game;
  }

  @Authorized()
  @Get("/games/:id([0-9]+)")
  getGame(@Param("id") id: number) {
    return Game.findOneById(id);
  }

  @Authorized()
  @Get("/games")
  getGames() {
    return Game.find();
  }
}
