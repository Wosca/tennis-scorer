import { Text, TouchableOpacity } from "react-native";

export default function PointButton(props: {
  name: string;
  handlePoint: Function;
}) {
  return (
    <TouchableOpacity
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
      onPress={() => props.handlePoint()}
    >
      <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
        {props.name}
      </Text>
    </TouchableOpacity>
  );
}
