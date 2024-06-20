import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Moment from "react-moment";
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
import moment from "moment";

export default function ItemDetail() {
  const initialMode = useRef<boolean>(true);

  useEffect(() => {
    initialMode.current = false;
  }, []);

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
  console.log(match.getFormattedScore());

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
    <ScrollView className="flex-1 bg-[#151718]">
      <View className="w-[99vw] flex self-center flex-row justify-between bg-vista-blue/10 border-jordy-blue/20 py-2 border-2 rounded-md">
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
      <View className="w-[99vw] mt-2 flex self-center flex-row bg-vista-blue/10 border-jordy-blue/20 py-2 border-2 rounded-md items-center justify-center">
        <Text className="text-white font-semibold">Point History</Text>
      </View>
      <ScrollView className="h-[230px]">
        {match
          .getScoreLog()
          .slice()
          .reverse()
          .map((log, index) => {
            const duration = moment.duration(moment().diff(log.time));
            return (
              index < 5 && (
                <View
                  key={index}
                  className={
                    "w-[99vw] self-center flex flex-col justify-between bg-vista-blue/10 border-jordy-blue/20 p-4 border-2 mt-1" +
                    (match.getScoreLog().length > 5
                      ? index === match.getScoreLog().length - 4
                        ? " rounded-b-xl"
                        : " "
                      : index === match.getScoreLog().length - 1
                      ? " rounded-b-xl"
                      : " ") +
                    (index === 0 ? " rounded-t-xl" : " rounded-sm")
                  }
                >
                  <View className="flex flex-row justify-between">
                    <View className="flex flex-col gap-2">
                      <View className="flex flex-row gap-2 py-1">
                        <TrophyIcon />
                        <Text className="text-white text-center flex text-lg">
                          {log.winner === "Player1" ? player1Name : player2Name}
                        </Text>
                      </View>
                      <View className="flex flex-row gap-2 py-1">
                        <ReasonIcon />
                        <Text className="text-white text-lg">{log.reason}</Text>
                      </View>
                    </View>
                    <View className="flex flex-col gap-2">
                      <View className="flex flex-row gap-2 py-1">
                        <PointLengthIcon />
                        <Text className="text-white text-lg">
                          {index === match.getScoreLog().length - 1
                            ? "First Point"
                            : log.duration + "s"}
                        </Text>
                      </View>
                      <View className="flex flex-row gap-2 py-1">
                        <PointDuration />

                        <Text className="text-white text-lg">
                          <Moment
                            interval={1000}
                            durationFromNow
                            format={
                              duration.asSeconds() < 60
                                ? "s [s ago]"
                                : "m [m ago]"
                            }
                            element={Text}
                          >
                            {log.time}
                          </Moment>
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-col gap-2 ">
                      <TouchableOpacity
                        onPress={() => {
                          match.favouritePoint(log.id);
                          setFormattedScore(match.getFormattedScore());
                        }}
                      >
                        <View className="flex flex-row gap-1 border-[1px] border-sky-700/80 p-1 rounded-md">
                          <StarIcon filled={log.favourite} />
                          <Text className="text-white text-lg font-medium">
                            Save
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={0 !== index}
                        onPress={() => {
                          console.log("clicked");
                          match.deletePoint(log.id);
                          setFormattedScore(match.getFormattedScore());
                          // check if server swappedf
                          const { currentServer } = match.getScore();
                          const server = serving === 1 ? "Player1" : "Player2";
                          if (currentServer !== server) {
                            setServing(currentServer === "Player1" ? 1 : 2);
                          }
                        }}
                      >
                        <View
                          className={
                            "flex flex-row gap-1 p-1 border-[1px] border-red-700/70 rounded-md" +
                            (index !== 0 ? " opacity-30" : "")
                          }
                        >
                          <DeleteIcon />
                          <Text className="text-white text-lg font-medium">
                            Delete
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            );
          })}
      </ScrollView>
      <View className="w-[99vw] mt-2 flex self-center flex-row justify-between bg-vista-blue/10 border-jordy-blue/20 py-2 border-2 rounded-md">
        <View className="items-center w-1/2 gap-2">
          <Text className="text-2xl text-white font-bold">
            Player 1:{" "}
            {formattedScore.advantage === "Player1"
              ? "AD"
              : formattedScore.gameScore.Player1}
          </Text>
        </View>
        <View className="items-center w-1/2 gap-2">
          <Text className="text-2xl text-white font-bold">
            Player 2:{" "}
            {formattedScore.advantage === "Player2"
              ? "AD"
              : formattedScore.gameScore.Player2}
          </Text>
        </View>
      </View>
      <View className="w-[99vw] mt-2 flex self-center flex-row justify-between bg-vista-blue/10 border-jordy-blue/20 py-2 border-2 rounded-md">
        <View className="items-center w-1/2 gap-2">
          <Text className="text-2xl text-white font-bold">
            Games: {formattedScore.currentSetScore.Player1}
          </Text>
        </View>
        <View className="items-center w-1/2 gap-2">
          <Text className="text-2xl text-white font-bold">
            Games: {formattedScore.currentSetScore.Player2}
          </Text>
        </View>
      </View>
      <View className="w-[99vw] mt-2 flex self-center flex-row justify-between bg-vista-blue/10 border-jordy-blue/20 py-2 border-2 rounded-md items-center">
        <TouchableOpacity onPress={() => console.log("Cancel Match")}>
          <View className="flex flex-row gap-2 p-2 bg-red-600 rounded-md">
            <Text className="text-white text-lg font-semibold">
              Cancel Match
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Save Match")}>
          <View className="flex flex-row gap-2 p-2 bg-green-600 rounded-md">
            <Text className="text-white text-lg font-semibold">Save</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Pause Match")}>
          <View className="flex flex-row gap-2 p-2 bg-yellow-600 rounded-md">
            <Text className="text-white text-lg font-semibold">Pause</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

const StarIcon = (props: { filled: boolean }) => (
  <Svg
    viewBox="0 0 1024 1024"
    fill={props.filled ? "#d4af37" : "none"}
    stroke={props.filled ? "#d4af37" : "white"}
    strokeWidth={96}
    height={24}
    width={24}
  >
    <Path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
  </Svg>
);

const DeleteIcon = () => (
  <Svg viewBox="0 0 1024 1024" fill="white" height={24} width={24}>
    <Path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" />
  </Svg>
);

const TrophyIcon = () => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#d4af37"
    width={24}
    height={24}
    className="size-6"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
    />
  </Svg>
);

const ReasonIcon = () => (
  <Svg viewBox="0 0 512 512" fill="white" stroke="white" width={24} height={24}>
    <Path
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M464 256 A208 208 0 0 1 256 464 A208 208 0 0 1 48 256 A208 208 0 0 1 464 256 z"
    />
    <Path
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M461.43 271.44c-5.09.37-8.24.56-13.43.56-114.88 0-208-93.12-208-208 0-5.37.2-8.69.6-14M49.65 240.56S58.84 240 64 240c114.88 0 208 93.12 208 208 0 5.38-.61 14-.61 14"
    />
  </Svg>
);

const PointLengthIcon = () => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="white"
    strokeWidth={0.7}
    width={24}
    height={24}
  >
    <Path d="M20.145 8.27l1.563-1.563-1.414-1.414L18.586 7c-1.05-.63-2.274-1-3.586-1-3.859 0-7 3.14-7 7s3.141 7 7 7 7-3.14 7-7a6.966 6.966 0 00-1.855-4.73zM15 18c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
    <Path d="M14 10h2v4h-2zm-1-7h4v2h-4zM3 8h4v2H3zm0 8h4v2H3zm-1-4h3.99v2H2z" />
  </Svg>
);
const PointDuration = () => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={24}
    height={24}
    stroke="white"
  >
    <Path d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m5 11.9l-.7 1.3-5.3-2.9V7h1.5v4.4l4.5 2.5z" />
  </Svg>
);
