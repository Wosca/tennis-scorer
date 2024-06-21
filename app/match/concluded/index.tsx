import { router, useLocalSearchParams } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function MatchDetail() {
  const item = useLocalSearchParams();
  if (!item) {
    return null;
  }
  console.log(
    item.player1Name,
    item.player2Name,
    item.player1Score,
    item.player2Score,
    item.setScore1,
    item.setScore2
  );

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-4xl text-white font-bold mb-6">Match Finished</Text>
      <View className="w-full bg-vista-blue/10 border-jordy-blue/20 p-4 border-2 rounded-md mb-6">
        <Text className="text-2xl text-white font-semibold mb-2">Players:</Text>
        <Text className="text-xl text-white mb-2">
          {item.player1Name} vs {item.player2Name}
        </Text>
      </View>
      <View className="w-full bg-vista-blue/10 border-jordy-blue/20 p-4 border-2 rounded-md mb-6">
        <Text className="text-2xl text-white font-semibold mb-2">Score:</Text>
        <Text className="text-xl text-white mb-2">
          {item.player1Score} - {item.player2Score}
        </Text>
        <Text className="text-xl text-white mb-2">
          Set Score: {item.setScore1} - {item.setScore2}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push("/");
        }}
        className="mb-8"
      >
        <Text className="text-white text-lg p-3 bg-slate-700 rounded-md">
          Return to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}
