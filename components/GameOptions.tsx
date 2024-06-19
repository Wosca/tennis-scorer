import Slider from "@react-native-community/slider";
import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";

export default function GameOptions(props: {
  value: number;
  setValue: (arg0: number) => void;
  title: string;
  setWinByTwo?: (arg0: boolean) => void;
  winByTwo?: boolean;
  gamesPerSet?: number;
}) {
  return (
    <View
      className="gap-2 p-2 items-center"
      style={{
        borderRadius: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "#141c29",
          borderRadius: 5,
          borderColor: "#3b82f6",
          borderWidth: 2,
          padding: 10,
          gap: 2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#FFFFFF",
            fontWeight: "bold",
          }}
        >
          {props.title}
        </Text>
        <View className="flex flex-row w-1/2 items-center justify-between">
          <TouchableOpacity
            style={{
              height: 40,
              // Set a fixed height
              width: 40,
              // Set a fixed width
              alignItems: "center",
              justifyContent: "center",
              // Center the text vertically
              backgroundColor: "#3b82f6",
              borderRadius: 5,
            }}
            onPress={() => {
              if (props.title === "Tie Break" && props.value <= 1) {
                props.setValue(0);
                return;
              }
              if (props.value === 1) return;
              props.setValue(props.value - 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              -
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#3b82f6",
              padding: 6,
              width: "50%",
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
              }}
            >
              {props.value === 0 ? "Disabled" : props.value}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              height: 40,
              // Set a fixed height
              width: 40,
              // Set a fixed width
              alignItems: "center",
              justifyContent: "center",
              // Center the text vertically
              backgroundColor: "#3b82f6",
              borderRadius: 5,
            }}
            onPress={() => {
              if (props.value === 12) return;
              props.setValue(props.value + 1);
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "semibold",
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
        {props.title === "Tie Break" && (
          <View className="flex flex-row w-1/2 items-center justify-between">
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Win by 2
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={props.winByTwo ? "#0561ff" : "#abaaac"}
              value={props.winByTwo}
              onValueChange={(value) => {
                if (value) {
                  props.setWinByTwo && props.setWinByTwo(!props.winByTwo);
                } else {
                  props.setWinByTwo && props.setWinByTwo(!props.winByTwo);
                }
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
