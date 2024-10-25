import { PropsWithChildren, forwardRef } from "react";
import { TRoomListItem } from "../../services/type";
import { Button, Text, View } from "react-native";

export interface VoiceRoomProps extends PropsWithChildren {
  roomInfo: TRoomListItem
  onExit: () => void
}

const VoiceRoom = forwardRef<React.JSX.Element, VoiceRoomProps>((props, ref) => {
  const { roomInfo, onExit } = props
  return (
    <View className="bg-white h-full w-full flex flex-col justify-between z-50">
      <Button title="退出" onPress={onExit} />
    </View>
  )
})

export default VoiceRoom