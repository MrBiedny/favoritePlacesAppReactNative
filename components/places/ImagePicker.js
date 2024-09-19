import {
  launchCameraAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/color";
import OutlinedButton from "../ui/OutlinedButton";

export default function ImagePicker({ onTakeImage }) {
  const [pickedImg, setPickedImg] = useState();

  const [cameraPermission, requestPermission] = useCameraPermissions();

  async function verifyPermission() {
    if (cameraPermission.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermission.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app!"
      );
      return false;
    }
    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    setPickedImg(image.uri);
    onTakeImage(image.uri);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (imagePreview) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImg }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
