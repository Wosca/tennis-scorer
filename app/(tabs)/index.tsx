import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex justify-center items-center">
      <TouchableOpacity
        onPress={() => {
          router.push("/match");
        }}
      >
        <Text className="text-white p-2 bg-slate-700 rounded">New Match</Text>
      </TouchableOpacity>
    </View>
  );
}
