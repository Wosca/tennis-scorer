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
import PointButton from "@/components/PointButton";
import {
  TennisMatch,
  Player,
  ServeWinReasons,
  ServeLoseReasons,
  ReceiveWinReasons,
  ReceiveLoseReasons,
} from "@/components/GameLogic";

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
interface ModalTypeInter {
  type: string;
  Player: Player;
}

import ModalPoint from "@/components/PointModal";

export default function ItemDetail() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalTypeInter>({
    type: "",
    Player: "Player1",
  });
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
  const handleOpenModal = (type: string, player: Player) => {
    setModalType({ type: type, Player: player });
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
        <View className="items-center w-1/2 gap-2">
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
            <View className="w-full gap-2">
              {/* Touchable opacity PointButtons */}
              <PointButton
                handlePoint={() => handlePoint("Player1", ServeWinReasons.Ace)}
                name="Ace"
              />
              <PointButton
                handlePoint={() => handleFault("Player1")}
                name={
                  formattedScore.faultCount.Player1 > 0
                    ? "Double Fault"
                    : "Fault"
                }
              />
            </View>
          )}
          {serving === 1 && (
            <View className="my-2 w-[55%] h-[1px] bg-white/50"></View>
          )}

          <PointButton
            handlePoint={() => handleOpenModal("Winner", "Player1")}
            name="Winner"
          />
          <PointButton
            handlePoint={() => handleOpenModal("Error", "Player1")}
            name="Error"
          />
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
            <View className="w-full gap-2">
              <PointButton
                handlePoint={() => handlePoint("Player2", ServeWinReasons.Ace)}
                name="Ace"
              />
              <PointButton
                handlePoint={() => handleFault("Player2")}
                name={
                  formattedScore.faultCount.Player2 > 0
                    ? "Double Fault"
                    : "Fault"
                }
              />
            </View>
          )}
          {serving === 2 && (
            <View className="my-2 w-[55%] h-[1px] bg-white/50"></View>
          )}
          <PointButton
            handlePoint={() => handleOpenModal("Winner", "Player2")}
            name="Winner"
          />

          <PointButton
            handlePoint={() => handleOpenModal("Error", "Player2")}
            name="Error"
          />

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
                <ModalPoint
                  setModalVisible={setModalVisible}
                  modalType={modalType}
                  match={match}
                  handlePoint={handlePoint}
                />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </View>
  );
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
