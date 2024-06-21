import uuid from "react-native-uuid";
enum ServeWinReasons {
  Ace = "Ace",
  OpponentHitsOut = "Opponent Hits Out",
  OpponentHitsNet = "Opponent Hits Net",
  OpponentDoubleFault = "Opponent Double Fault",
  OpponentFootFault = "Opponent Foot Fault",
}

enum ServeLoseReasons {
  DoubleFault = "Double Fault",
  ServeFault = "Serve Fault",
  HittingOut = "Hitting Out",
  HittingNet = "Hitting Net",
}

enum ReceiveWinReasons {
  OpponentDoubleFault = "Opponent Double Fault",
  OpponentHitsOut = "Opponent Hits Out",
  OpponentHitsNet = "Opponent Hits Net",
  ServiceWinner = "Service Winner",
  ForehandWinner = "Forehand Winner",
  BackhandWinner = "Backhand Winner",
  Volley = "Volley",
  Smash = "Smash",
  Lob = "Lob",
  Dropshot = "Dropshot",
}

enum ReceiveLoseReasons {
  HittingOut = "Hitting Out",
  HittingNet = "Hitting Net",
}

type Player = "Player1" | "Player2";

interface PointResult {
  winner: Player;
  reason: string;
  time: Date;
  duration: number;
  favourite: boolean;
  id: string | number[];
}

interface MatchSettings {
  sets: number;
  gamesPerSet: number;
  pointsPerGame: number;
  shortDeuce: boolean;
  firstServer: number;
  tieBreakAt: number; // Add tieBreakAt to MatchSettings
  tieBreakLength: number;
  tieBreakWinByTwo: boolean;
}

class TennisMatch {
  private score: { [key in Player]: number } = {
    Player1: 0,
    Player2: 0,
  };

  private gameScore: { [key in Player]: number } = {
    Player1: 0,
    Player2: 0,
  };

  private setScore: { [key in Player]: number } = {
    Player1: 0,
    Player2: 0,
  };

  private scoreLog: PointResult[] = [];
  private faultCount: { [key in Player]: number } = {
    Player1: 0,
    Player2: 0,
  };

  private matchConcluded: boolean = false;
  private matchSettings: MatchSettings;
  private currentSet: number = 1;
  private advantage: Player | null = null;
  private currentServer: Player;
  private initialServer: Player;
  private inTiebreak: boolean = false;

  constructor(settings: MatchSettings) {
    this.matchSettings = settings;
    this.initialServer = settings.firstServer === 1 ? "Player1" : "Player2";
    this.currentServer = this.initialServer;
    this.matchConcluded = false;
  }

  private resetGameScore() {
    this.gameScore = { Player1: 0, Player2: 0 };
    this.advantage = null;
    this.resetFaultCount();
  }

  private resetScore() {
    this.score = { Player1: 0, Player2: 0 };
  }

  private resetSetScore() {
    this.setScore = { Player1: 0, Player2: 0 };
  }

  private resetFaultCount() {
    this.faultCount = { Player1: 0, Player2: 0 };
  }

  private switchServer() {
    this.currentServer =
      this.currentServer === "Player1" ? "Player2" : "Player1";
  }

  logPoint(
    winner: Player,
    reason:
      | ServeWinReasons
      | ServeLoseReasons
      | ReceiveWinReasons
      | ReceiveLoseReasons
  ): void {
    const timeSinceLastPoint =
      this.scoreLog.length > 0
        ? Math.floor(
            (new Date().getTime() -
              this.scoreLog[this.scoreLog.length - 1].time.getTime()) /
              1000
          )
        : 0;
    this.scoreLog.push({
      winner,
      reason,
      time: new Date(),
      duration: timeSinceLastPoint,
      favourite: false,
      id: uuid.v4(),
    });
    this.resetFaultCount();

    if (!this.inTiebreak) {
      if (!this.matchSettings.shortDeuce && this.isDeuceScenario()) {
        this.handleDeuce(winner);
      } else {
        this.gameScore[winner]++;
        this.checkGameWin(winner);
      }
    } else {
      this.gameScore[winner]++;
      this.checkTiebreakWin(winner);
    }
  }

  logFault(player: Player): void {
    this.faultCount[player]++;
    if (this.faultCount[player] >= 2) {
      this.logPoint(this.getOpponent(player), ServeLoseReasons.DoubleFault);
      this.faultCount[player] = 0;
    }
  }

  private isDeuceScenario(): boolean {
    return this.gameScore.Player1 >= 3 && this.gameScore.Player2 >= 3;
  }

  private handleDeuce(winner: Player) {
    if (this.isDeuceScenario()) {
      if (this.advantage === winner) {
        this.winGame(winner);
      } else if (this.advantage === null) {
        this.advantage = winner;
      } else {
        this.advantage = null;
      }
    }
  }

  private checkGameWin(winner: Player) {
    if (
      this.matchSettings.shortDeuce &&
      this.gameScore[winner] >= this.matchSettings.pointsPerGame
    ) {
      this.winGame(winner);
    } else if (
      this.gameScore[winner] >= this.matchSettings.pointsPerGame &&
      this.gameScore[winner] >= this.gameScore[this.getOpponent(winner)] + 2
    ) {
      this.winGame(winner);
    }
  }

  private checkTiebreakWin(winner: Player) {
    if ((this.gameScore.Player1 + this.gameScore.Player2) % 2 !== 0) {
      this.switchServer();
    }
    if (this.gameScore[winner] >= this.matchSettings.tieBreakLength) {
      if (this.matchSettings.tieBreakWinByTwo) {
        if (
          this.gameScore[winner] >=
          this.gameScore[this.getOpponent(winner)] + 2
        ) {
          this.winSet(winner);
          this.resetGameScore();
          this.inTiebreak = false;
        }
      } else {
        this.winSet(winner);
        this.resetGameScore();
        this.inTiebreak = false;
      }
    }
  }

  private winGame(winner: Player) {
    this.score[winner]++;
    this.resetGameScore();
    this.switchServer();
    this.checkSetWin(winner);
  }

  private checkSetWin(winner: Player) {
    // Check if both players are at specified tie break game score
    console.log("Checking set win");
    if (
      this.score[winner] === this.matchSettings.tieBreakAt &&
      this.score[this.getOpponent(winner)] === this.matchSettings.tieBreakAt
    ) {
      this.startTiebreak();
      return;
    }
    console.log(
      this.score[winner],
      this.score[this.getOpponent(winner)],
      this.matchSettings.tieBreakAt,
      this.matchSettings.gamesPerSet
    );
    if (
      this.score[winner] >= this.matchSettings.gamesPerSet &&
      this.score[winner] >= this.matchSettings.tieBreakAt + 1
    ) {
      console.log("Success");
      this.winSet(winner);
      return;
    }

    // if (
    //   this.score[winner] >= this.matchSettings.gamesPerSet &&
    //   this.score[winner] >= this.score[this.getOpponent(winner)] + 2
    // ) {
    //   console.log("3");
    //   this.winSet(winner);
    // }
  }

  private startTiebreak() {
    this.inTiebreak = true;
    this.resetGameScore();
  }

  private winSet(winner: Player) {
    this.currentSet++;
    if (this.currentSet > this.matchSettings.sets) {
      this.winMatch(winner);
    } else {
      this.resetScore();
      this.resetGameScore();
      this.inTiebreak = false;
      this.advantage = null;
      this.setScore[winner]++;
      this.currentServer =
        this.initialServer === "Player1" ? "Player2" : "Player1";
    }
  }

  private winMatch(winner: Player) {
    this.matchConcluded = true;
    console.log(`${winner} wins the match!`);
  }

  deletePoint(id: string | number[]): void {
    // Find the index of the point with the given id
    const pointIndex = this.scoreLog.findIndex((point) => point.id === id);

    // If the point is not found, do nothing
    if (pointIndex === -1) {
      console.log(`Point with id ${id} not found.`);
      return;
    }

    // Get the point to be deleted
    const point = this.scoreLog[pointIndex];

    // Remove the point from the scoreLog
    this.scoreLog.splice(pointIndex, 1);

    // Reset the scores
    this.resetGameScore();
    this.resetSetScore();
    this.score = { Player1: 0, Player2: 0 };
    this.currentSet = 1;
    this.advantage = null;
    this.inTiebreak = false;
    this.currentServer = this.initialServer;

    // Recalculate the scores from the remaining points in the log
    this.scoreLog.forEach((point) => {
      if (!this.inTiebreak) {
        if (!this.matchSettings.shortDeuce && this.isDeuceScenario()) {
          this.handleDeuce(point.winner);
        } else {
          this.gameScore[point.winner]++;
          this.checkGameWin(point.winner);
        }
      } else {
        this.gameScore[point.winner]++;
        this.checkTiebreakWin(point.winner);
      }
    });

    // Log the deletion
    console.log(`Point with id ${id} has been deleted.`);
  }

  getOpponent(player: Player): Player {
    return player === "Player1" ? "Player2" : "Player1";
  }

  getScore(): {
    gameScore: { [key in Player]: number };
    setScore: { [key in Player]: number };
    matchScore: { [key in Player]: number };
    advantage: Player | null;
    currentServer: Player;
    matchConcluded: boolean;
  } {
    return {
      gameScore: { ...this.gameScore },
      setScore: { ...this.setScore },
      matchScore: { ...this.score },
      advantage: this.advantage,
      currentServer: this.currentServer,
      matchConcluded: this.matchConcluded,
    };
  }

  getScoreLog(): PointResult[] {
    return [...this.scoreLog];
  }

  favouritePoint(id: string | number[]): void {
    const pointIndex = this.scoreLog.findIndex((point) => point.id === id);

    if (pointIndex === -1) {
      console.log(`Point with id ${id} not found.`);
      return;
    }

    const point = this.scoreLog[pointIndex];

    point.favourite = !point.favourite;

    console.log(
      `Point with id ${id} has been ${
        point.favourite ? "favourited" : "unfavourited"
      }.`
    );
  }

  private formatGameScore(playerScore: number): number {
    const scoreMapping = [0, 15, 30, 40];
    if (playerScore > 3) return playerScore;
    return scoreMapping[playerScore];
  }

  getFormattedScore(): {
    currentSetScore: { [key in Player]: number };
    totalSetScore: { [key in Player]: number };
    gameScore: { Player1: number; Player2: number };
    advantage: Player | null;
    currentServer: Player;
    faultCount: { [key in Player]: number };
    inTieBreak: boolean;
  } {
    return {
      currentSetScore: { ...this.score },
      totalSetScore: { ...this.setScore },
      gameScore: {
        Player1: this.formatGameScore(this.gameScore.Player1),
        Player2: this.formatGameScore(this.gameScore.Player2),
      },

      advantage: this.advantage,
      currentServer: this.currentServer,
      faultCount: { ...this.faultCount },
      inTieBreak: this.inTiebreak,
    };
  }
}

export {
  TennisMatch,
  Player,
  ServeWinReasons,
  ServeLoseReasons,
  ReceiveWinReasons,
  ReceiveLoseReasons,
  MatchSettings,
  PointResult,
};
