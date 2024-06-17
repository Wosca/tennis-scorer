import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import Modal from "react-native-modal";

interface MatchParams {
  player1Name: string;
  player2Name: string;
  gamesPerSet: number;
  sets: number;
  tieBreak: number;
  winByTwo: string;
  longDeuceType: string;
  serving: number;
  lateTieBreak: string;
}

export default function ItemDetail() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const item = useLocalSearchParams();
  if (!item) {
    return null;
  }

  const options: Partial<MatchParams> = item;
  const [match] = useState(
    new TennisMatch({
      sets: Number(options.sets),
      gamesPerSet: Number(options.gamesPerSet),
      pointsPerGame: 4,
      shortDeuce: options.longDeuceType === "true" ? true : false,
      firstServer: Number(options.serving),
      tieBreakAt:
        options.lateTieBreak === "false"
          ? Number(options.gamesPerSet) - 1
          : Number(options.gamesPerSet),
      tieBreakLength: Number(options.tieBreak),
      tieBreakWinByTwo: options.winByTwo === "true" ? true : false,
    })
  );
  const [formattedScore, setFormattedScore] = useState(
    match.getFormattedScore()
  );
  const handleOpenModal = (type: React.SetStateAction<string>) => {
    setModalType(type);
    setModalVisible(true);
  };
  const [serving, setServing] = useState(Number(options.serving));
  const handlePoint = (
    winner: Player,
    reason:
      | ServeWinReasons
      | ServeLoseReasons
      | ReceiveWinReasons
      | ReceiveLoseReasons
  ) => {
    match.logPoint(winner, reason);
    setFormattedScore(match.getFormattedScore());
    // check if server swappedf
    const { currentServer } = match.getScore();
    const server = serving === 1 ? "Player1" : "Player2";
    if (currentServer !== server) {
      setServing(currentServer === "Player1" ? 1 : 2);
    }
  };

  const handleFault = (player: Player) => {
    match.logFault(player);
    setFormattedScore(match.getFormattedScore());
  };
  const player1Name =
    (options.player1Name ?? "").length < 1 ? "Player 1" : options.player1Name;
  const player2Name =
    (options.player2Name ?? "").length < 1 ? "Player 2" : options.player2Name;

  return (
    <View className="flex-1 bg-[#151718]">
      <Text className="text-white text-2xl font-bold text-center">
        {formattedScore.currentSetScore.Player1} -{" "}
        {formattedScore.currentSetScore.Player2}
      </Text>
      <Text className="text-white text-2xl font-bold text-center">
        {formattedScore.advantage
          ? formattedScore.advantage === "Player1"
            ? "Ad. " + player1Name
            : "Ad. " + player2Name
          : formattedScore.gameScore}
      </Text>
      <View className="w-screen flex flex-row justify-between">
        <View className="items-center w-1/2">
          <View className="flex flex-row items-center gap-2">
            <Text
              className={`text-2xl font-bold ${
                formattedScore.faultCount.Player1 > 0
                  ? "text-orange-400"
                  : "text-white"
              }`}
            >
              {player1Name}
            </Text>
            {serving === 1 && <SvgComponent />}
          </View>
          {serving === 1 && ( // Touchable opacity for ways to lose each point
            <View className="w-full gap-1">
              {/* Touchable opacity buttons */}
              <TouchableOpacity
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                onPress={() => handlePoint("Player1", ServeWinReasons.Ace)}
              >
                <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                  Ace
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFault("Player1")}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                  {formattedScore.faultCount.Player1 > 0
                    ? "Double Fault"
                    : "Fault"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {serving === 1 && (
            <View className="my-2 w-[55%] h-[1px] bg-white/50"></View>
          )}
          <TouchableOpacity
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            onPress={() => handlePoint("Player2", ServeLoseReasons.HittingOut)}
          >
            <Text className="mt-1 text-white font-medium rounded w-1/2 p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
              Hit Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            onPress={() => handlePoint("Player2", ServeLoseReasons.HittingNet)}
          >
            <Text className="mt-1 text-white font-medium rounded w-1/2 p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
              Hit Net
            </Text>
          </TouchableOpacity>
        </View>
        <View className="h-full w-[1px] bg-white"></View>

        <View className="items-center w-1/2 gap-2">
          <View className="flex flex-row items-center gap-2">
            <Text
              className={`text-2xl font-bold ${
                formattedScore.faultCount.Player2 > 0
                  ? "text-orange-400"
                  : "text-white"
              }`}
            >
              {player2Name}
            </Text>
            {serving === 2 && <SvgComponent />}
          </View>
          {serving === 2 && (
            <View className="w-full gap-1">
              <TouchableOpacity
                style={{ width: "100%", display: "flex", alignItems: "center" }}
                onPress={() => handlePoint("Player2", ServeWinReasons.Ace)}
              >
                <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                  Ace
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFault("Player2")}
                style={{ width: "100%", display: "flex", alignItems: "center" }}
              >
                <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                  {formattedScore.faultCount.Player2 > 0
                    ? "Double Fault"
                    : "Fault"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {serving === 2 && (
            <View className="my-2 w-[55%] h-[1px] bg-white/50"></View>
          )}
          <TouchableOpacity
            style={{ width: "100%", display: "flex", alignItems: "center" }}
            onPress={() => handleOpenModal("Winner")}
          >
            <Text className="text-white font-medium rounded w-1/2 p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
              Winner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "100%", display: "flex", alignItems: "center" }}
            onPress={() => handleOpenModal("Error")}
          >
            <Text className="text-white font-medium rounded w-1/2 p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
              Error
            </Text>
          </TouchableOpacity>

          <Modal
            isVisible={modalVisible}
            backdropTransitionInTiming={700}
            backdropOpacity={0.2}
            onBackdropPress={() => setModalVisible(false)}
            swipeDirection="up"
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#00000080",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    backgroundColor: "#12141c",
                    borderRadius: 10,
                    padding: 20,
                  }}
                >
                  <Text className="text-white mb-[10px] font-bold text-lg">
                    {modalType} Type
                  </Text>
                  {modalType === "Winner" && (
                    <View className="gap-2">
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint(
                            "Player2",
                            ReceiveWinReasons.ForehandWinner
                          );
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Forehand Winner
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint(
                            "Player2",
                            ReceiveWinReasons.BackhandWinner
                          );
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Backhand Winner
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player2", ReceiveWinReasons.Volley);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Volley
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player2", ReceiveWinReasons.Smash);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Smash
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player2", ReceiveWinReasons.Lob);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Lob
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player2", ReceiveWinReasons.Dropshot);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Dropshot
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {modalType === "Error" && (
                    <>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player1", ReceiveLoseReasons.HittingOut);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Hit Out
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          handlePoint("Player1", ReceiveLoseReasons.HittingNet);
                          setModalVisible(false);
                        }}
                      >
                        <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] border-[#3b82f6] bg-[#141c29]">
                          Hit Net
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </View>
  );
}
enum ServeWinReasons {
  Ace,
  OpponentHitsOut,
  OpponentHitsNet,
  OpponentDoubleFault,
  OpponentFootFault,
}

enum ServeLoseReasons {
  DoubleFault,
  ServeFault,
  HittingOut,
  HittingNet,
}

enum ReceiveWinReasons {
  OpponentDoubleFault,
  OpponentHitsOut,
  OpponentHitsNet,
  ServiceWinner,
  ForehandWinner,
  BackhandWinner,
  Volley,
  Smash,
  Lob,
  Dropshot,
}

enum ReceiveLoseReasons {
  HittingOut,
  HittingNet,
}

type Player = "Player1" | "Player2";

interface PointResult {
  winner: Player;
  reason:
    | ServeWinReasons
    | ServeLoseReasons
    | ReceiveWinReasons
    | ReceiveLoseReasons;
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
    this.scoreLog.push({ winner, reason });
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

  private getOpponent(player: Player): Player {
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

const SvgComponent = () => (
  <Svg width={20} height={20} viewBox="0 0 35 35">
    <Path
      d="M505.123 568.951c-2.836 42.287-39.45 74.196-81.737 71.424-42.287-2.837-74.26-39.45-71.359-81.802 2.837-42.222 39.45-74.195 81.673-71.359 42.287 2.836 74.26 39.45 71.423 81.737"
      fill="#b2dd09"
      transform="matrix(.22808 0 0 .228 -80.25 -111.049)"
    />
    <Path
      d="M19.813.406c-1.778.09-3.229 1.106-4 2.031-.883 1.059-4.78 9.932-5.5 11.813-.736 1.881-2.501 5.183-4.75 7.094-2.441 2.116-5-.125-5-.125.485 2.322 2.772 2.867 5.125 1.75 2.337-1.132 5.242-6.35 6.125-8.438.882-2.087 3.766-8.637 5.03-11.312 1.25-2.66 3.75-2.781 3.75-2.781a5.134 5.134 0 0 0-.78-.032zM34.874 15.5s-2.338 6.848-9.469 11.875c-7.101 5.041-10.375 7.438-10.375 7.438l1.594.156L26 28.437c.882-.646 9.934-6.543 8.875-12.937z"
      fill="#fff"
    />
  </Svg>
);
