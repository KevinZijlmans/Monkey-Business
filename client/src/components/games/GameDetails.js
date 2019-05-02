import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getGames, joinGame, updateGame } from "../../actions/games";
import { getUsers } from "../../actions/users";
import { userId } from "../../jwt";
import Paper from "@material-ui/core/Paper";
import { MyBoard, GuessBoard } from "./Board";
import "./GameDetails.css";

class GameDetails extends PureComponent {
  componentWillMount() {
    if (this.props.authenticated) {
      if (this.props.game === null) this.props.getGames();
      if (this.props.users === null) this.props.getUsers();
    }
  }

  joinGame = () => this.props.joinGame(this.props.game.id);

  makeMove = (toRow, toCell) => {
    const { game, updateGame } = this.props;

    updateGame(game.id, [toRow, toCell]);
  };

  render() {
    const { game, users, authenticated, userId } = this.props;
    console.log("game", game);
    console.log("userId", userId);

    if (!authenticated) return <Redirect to="/login" />;

    if (game === null || users === null) return "Loading...";
    if (!game) return "Not found";

    const player =
      game && game.players && game.players.find(p => p.userId === userId);
    console.log("player", player);
    const opponent =
      game && game.players && game.players.find(p => p.userId !== userId);
    console.log("opponent", opponent);

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0];

    return (
      <Paper className="outer-paper">
        <h1>Game #{game.id}</h1>

        <p>Status: {game.status}</p>
        {console.log(player)}
        {console.log(game)}
        {game.status === "started" && player && player.color === game.turn && (
          <div>It's your turn!</div>
        )}

        {game.status === "pending" &&
          game.players.map(p => p.userId).indexOf(userId) === -1 && (
            <button onClick={this.joinGame}>Join Game</button>
          )}

        {winner && <p>Winner: {users[winner].firstName}</p>}

        <hr />

        {game.status !== "pending" && (
          <div>
            <h1>Your board</h1>
            <MyBoard board={player.my_board} />

            <h1>Your guesses</h1>
            <GuessBoard board={player.guess_board} makeMove={this.makeMove} />
          </div>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = (state, props) => ({
  authenticated: state.currentUser !== null,
  userId: state.currentUser && userId(state.currentUser.jwt),
  game: state.games && state.games[props.match.params.id],
  users: state.users
});

const mapDispatchToProps = {
  getGames,
  getUsers,
  joinGame,
  updateGame
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameDetails);
