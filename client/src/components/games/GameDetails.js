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

    if (!authenticated) return <Redirect to="/login" />;

    if (game === null || users === null) return "Loading...";
    if (!game) return "Not found";

    const player =
      game && game.players && game.players.find(p => p.userId === userId);

    const winner = game.players
      .filter(p => p.symbol === game.winner)
      .map(p => p.userId)[0];

    return (
      <Paper className="outer-paper">
        <h1>GAME #{game.id}</h1>

        <p>Status: {game.status}</p>
        <p>Found bananas: {player && player.hitCount}</p>
        <p>Bananas left: {player && 10 - player.hitCount}</p>

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
            <h1>YOUR BOARD</h1>
            <MyBoard board={player.my_board} />

            <h1>YOUR GUESSES</h1>
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
