import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Button, Switch, Text, View } from "react-native";

export default function App() {
  const [screenAlwaysOn, setScreenAlwaysOn] = useState(false);
  return (
    <View className="flex-1 justify-center items-center bg-[#151718] ">
      <Text className="text-xl text-center m-2.5 text-white">Settings</Text>
      {/* List of settings */}
      <View className="flex-row justify-between items-center w-full p-2.5 border-y border-gray-200">
        <Text className="text-white text-lg">Screen Always On</Text>
        <Switch
          className=""
          value={screenAlwaysOn}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={screenAlwaysOn ? "#0561ff" : "#abaaac"}
          onValueChange={() => {
            setScreenAlwaysOn(!screenAlwaysOn);
          }}
        />
      </View>
    </View>
  );
}
