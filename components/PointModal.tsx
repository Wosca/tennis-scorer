import { Text, TouchableOpacity, View } from "react-native";
import {
  Player,
  ReceiveWinReasons,
  ReceiveLoseReasons,
} from "@/components/GameLogic";

export default function ModalPoint(props: {
  modalType: { type: string; Player: Player };
  handlePoint: Function;
  setModalVisible: (arg0: boolean) => void;
  match: { getOpponent: (arg0: any) => any };
}) {
  return (
    <View
      style={{
        width: "80%",
        backgroundColor: "#12141c",
        borderRadius: 10,
        padding: 20,
      }}
    >
      <Text className="text-white mb-[10px] font-bold text-lg">
        {props.modalType.type} Type
      </Text>
      {props.modalType.type === "Winner" && (
        <View className="gap-2">
          <TouchableOpacity
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            onPress={() => {
              props.handlePoint(
                props.modalType.Player,
                ReceiveWinReasons.ForehandWinner
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(
                props.modalType.Player,
                ReceiveWinReasons.BackhandWinner
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(
                props.modalType.Player,
                ReceiveWinReasons.Volley
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(
                props.modalType.Player,
                ReceiveWinReasons.Smash
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(props.modalType.Player, ReceiveWinReasons.Lob);
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(
                props.modalType.Player,
                ReceiveWinReasons.Dropshot
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
              Dropshot
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {props.modalType.type === "Error" && (
        <>
          <TouchableOpacity
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
            onPress={() => {
              props.handlePoint(
                props.match.getOpponent(props.modalType.Player),
                ReceiveLoseReasons.HittingOut
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
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
              props.handlePoint(
                props.match.getOpponent(props.modalType.Player),
                ReceiveLoseReasons.HittingNet
              );
              props.setModalVisible(false);
            }}
          >
            <Text className="text-white font-medium w-1/2 rounded p-2 text-center border-[2px] bg-jordy-blue border-vista-blue">
              Hit Net
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
