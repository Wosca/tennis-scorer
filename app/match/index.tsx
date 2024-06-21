import { useState } from "react";
import {
  Switch,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import GameOptions from "@/components/GameOptions";
import { Stack, router } from "expo-router";

export default function HomeScreen() {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [gamesPerSet, setGamesPerSet] = useState(6);
  const [sets, setSets] = useState(3);
  const [tieBreak, setTieBreak] = useState(5);
  const [winByTwo, setWinByTwo] = useState(false);
  const [longDeuceType, setLongDeuceType] = useState(false);
  const [serving, setServing] = useState(1);
  const [lateTieBreak, setLateTieBreak] = useState(false);

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "New Match",
          headerStyle: { backgroundColor: "#0b1424" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <View className="bg-[#151718] flex gap-1 w-screen">
        <View className="flex w-full">
          <View
            className="p-2 w-full items-center"
            style={{
              borderRadius: 5,
              gap: 2,
            }}
          >
            <View className="flex flex-col w-1/2 items-center justify-between">
              <Text
                style={{
                  fontSize: 16,
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                Player 1 Name
              </Text>
              <TextInput
                value={player1Name}
                className="p-2 bg-blue-500/50 m-4 rounded-lg w-full text-white"
                onChangeText={setPlayer1Name}
                placeholderTextColor={"#fff"}
                placeholder="Player 1 Name"
              />
            </View>
          </View>
          <View
            className="p-2 w-full items-center"
            style={{
              borderRadius: 5,
              gap: 2,
            }}
          >
            <View className="flex flex-col w-1/2 items-center justify-between">
              <Text
                style={{
                  fontSize: 16,
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                Player 2 Name
              </Text>
              <TextInput
                className="p-2 bg-blue-500/50 m-4 rounded-lg w-full text-white"
                value={player2Name}
                onChangeText={setPlayer2Name}
                placeholderTextColor={"#fff"}
                placeholder="Player 1 Name"
              />
            </View>
          </View>
          <GameOptions
            value={gamesPerSet}
            setValue={setGamesPerSet}
            title="Games per Set"
          />
          <GameOptions value={sets} setValue={setSets} title="Number of Sets" />
          <GameOptions
            value={tieBreak}
            setValue={setTieBreak}
            title="Tie Break"
            setWinByTwo={setWinByTwo}
            winByTwo={winByTwo}
            gamesPerSet={gamesPerSet}
          />

          <View
            className="gap-2 p-2 w-full items-center"
            style={{
              borderRadius: 5,
            }}
          >
            <View className="flex flex-row w-1/2 items-center justify-between">
              <Text
                style={{
                  fontSize: 16,
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                Short Duece
              </Text>
              <Switch
                value={longDeuceType}
                onValueChange={setLongDeuceType}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={longDeuceType ? "#0561ff" : "#abaaac"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{ width: "100%", display: "flex", alignItems: "center" }}
              onPress={() => {
                setServing(serving === 1 ? 2 : 1);
              }}
            >
              <Text className="w-1/2 bg-lime-700 p-2 m-4 rounded-lg text-white text-md text-center">
                {serving === 1
                  ? player1Name
                    ? player1Name
                    : "Player 1"
                  : player2Name
                  ? player2Name
                  : "Player 2"}{" "}
                is Serving first
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ width: "100%", display: "flex", alignItems: "center" }}
              onPress={() => {
                setLateTieBreak(!lateTieBreak);
              }}
            >
              <Text className="w-1/2 bg-lime-700 p-2 m-4 rounded-lg text-white  text-md text-center">
                {lateTieBreak === false
                  ? "Tie break at " +
                    (gamesPerSet - 1) +
                    "-" +
                    (gamesPerSet - 1)
                  : "Tie break at " + gamesPerSet + "-" + gamesPerSet}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/match/ongoing",
                params: {
                  player1Name,
                  player2Name,
                  gamesPerSet,
                  sets,
                  tieBreak,
                  winByTwo: winByTwo.toString(),
                  longDeuceType: longDeuceType.toString(),
                  serving: serving,
                  lateTieBreak: lateTieBreak.toString(),
                },
              });
            }}
          >
            <Text className="bg-blue-500 p-2 m-4 font-semibold rounded-lg text-lg text-white text-center">
              Start Match
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
