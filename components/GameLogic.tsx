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
  }

  private resetGameScore() {
    this.gameScore = { Player1: 0, Player2: 0 };
    this.advantage = null;
    this.resetFaultCount();
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
    this.setScore[winner]++;
    this.switchServer();
    this.checkSetWin(winner);
  }

  private checkSetWin(winner: Player) {
    if (
      this.setScore[winner] >= this.matchSettings.gamesPerSet &&
      this.setScore[winner] >= this.setScore[this.getOpponent(winner)] + 2
    ) {
      this.winSet(winner);
    } else if (
      this.setScore[winner] === this.matchSettings.tieBreakAt &&
      this.setScore[this.getOpponent(winner)] === this.matchSettings.tieBreakAt
    ) {
      this.startTiebreak();
    }
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
      this.resetSetScore();
    }
  }

  private winMatch(winner: Player) {
    console.log(`${winner} wins the match!`);
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
  } {
    return {
      gameScore: { ...this.gameScore },
      setScore: { ...this.setScore },
      matchScore: { ...this.score },
      advantage: this.advantage,
      currentServer: this.currentServer,
    };
  }

  getScoreLog(): PointResult[] {
    return [...this.scoreLog];
  }

  private formatGameScore(playerScore: number, opponentScore: number): string {
    const scoreMapping = ["0", "15", "30", "40"];
    if (playerScore >= 3 && opponentScore >= 3) {
      if (playerScore === opponentScore) {
        return "Deuce";
      } else if (this.advantage === "Player1") {
        return "Advantage Player1";
      } else if (this.advantage === "Player2") {
        return "Advantage Player2";
      }
    }
    return `${scoreMapping[playerScore]}-${scoreMapping[opponentScore]}`;
  }

  getFormattedScore(): {
    currentSetScore: { [key in Player]: number };
    totalSetScore: { [key in Player]: number };
    gameScore: string;
    advantage: Player | null;
    currentServer: Player;
    faultCount: { [key in Player]: number };
    inTieBreak: boolean;
  } {
    return {
      currentSetScore: { ...this.setScore },
      totalSetScore: { ...this.score },
      gameScore: this.inTiebreak
        ? `${this.gameScore.Player1}-${this.gameScore.Player2}`
        : this.formatGameScore(this.gameScore.Player1, this.gameScore.Player2),
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
