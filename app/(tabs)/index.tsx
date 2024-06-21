import { useState, useEffect, JSX } from "react";
import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextProps,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const [recentMatches, setRecentMatches] = useState<
    { id: number; players: string; result: string }[]
  >([]);

  useEffect(() => {
    // Fetch recent matches from local storage or an API
    // This is just a mock, replace it with real data fetching logic
    const matches = [
      { id: 1, players: "Player1 vs Player2", result: "6-4, 3-6, 7-5" },
      { id: 2, players: "Player3 vs Player4", result: "6-3, 6-4" },
      { id: 3, players: "Player1 vs Player4", result: "4-6, 6-4, 6-2" },
    ];
    setRecentMatches(matches);
  }, []);

  return (
    <View className="flex-1 bg-[#151718] justify-center items-center p-4">
      <View className="flex flex-row items-baseline mb-6">
        <Text className="text-4xl text-white font-bold">Welcome to </Text>
        <GradientText>Tennis</GradientText>
        <Text className="text-4xl text-white font-bold"> Scorer</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push("/match");
        }}
        className="mb-8"
      >
        <Text className="text-white text-lg p-3 bg-slate-700 rounded-md">
          Start New Match
        </Text>
      </TouchableOpacity>

      <View className="w-full">
        <Text className="text-2xl text-white font-semibold mb-4">
          Recent Matches
        </Text>
        <ScrollView className="w-full h-[300px] bg-vista-blue/10 border-jordy-blue/20 p-4 border-2 rounded-md">
          {recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <View key={match.id} className="bg-[#1f1f1f] p-4 mb-3 rounded-md">
                <Text className="text-white text-lg">{match.players}</Text>
                <Text className="text-white text-sm">{match.result}</Text>
              </View>
            ))
          ) : (
            <Text className="text-white text-lg">No recent matches</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const GradientText = (
  props: JSX.IntrinsicAttributes &
    JSX.IntrinsicClassAttributes<Text> &
    Readonly<TextProps>
) => {
  return (
    <MaskedView
      maskElement={<Text className="text-4xl font-bold" {...props} />}
    >
      <LinearGradient
        colors={["#f9f871", "#a8e063"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          {...props}
          className="text-4xl font-bold"
          style={[props.style, { opacity: 0, fontWeight: "700" }]}
        />
      </LinearGradient>
    </MaskedView>
  );
};
