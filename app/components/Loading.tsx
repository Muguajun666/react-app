import React from "react";
import { View, StyleSheet } from "react-native";
import LoadingDots from "react-native-loading-dots"

function Loading() {
  return (
    <View style={styles.loadingScreen}>
      <View style={styles.dotsWrapper}>
        <LoadingDots />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dotsWrapper: {
    width: 100,
  },
});

export default Loading;