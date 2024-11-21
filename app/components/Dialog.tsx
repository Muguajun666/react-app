import React from "react";
import { StyleSheet, View } from "react-native";
import Dialog from "react-native-dialog";

interface DialogComponentProps {
  visible: boolean;
  title: string
  description: string;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const DialogComponent = (props: DialogComponentProps): React.JSX.Element => {

  const { visible, title, description, handleCancel, handleConfirm } = props;

  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          {description}
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Confirm" onPress={handleConfirm} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DialogComponent;