import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  getCurrentPositionAsync,
  PermissionStatus,
  useForegroundPermissions,
} from "expo-location";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import OutlinedButton from "../ui/OutlinedButton";
import { getAddress, getMapPreview } from "../../util/location";
import { Colors } from "../../constants/color";

export default function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState();
  const [locationPermission, requestPermission] = useForegroundPermissions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(
    function () {
      if (isFocused && route.params) {
        const mapPickedLocation = {
          lat: route.params.pickedLat,
          lng: route.params.pickedLng,
        };
        setPickedLocation(mapPickedLocation);
      }
    },
    [route, isFocused]
  );

  useEffect(
    function () {
      async function handleLocation() {
        if (pickedLocation) {
          const address = await getAddress(
            pickedLocation.lat,
            pickedLocation.lng
          );
          onPickLocation({ ...pickedLocation, address: address });
        }
      }
      handleLocation();
    },
    [pickedLocation, onPickLocation]
  );

  async function verifyPermission() {
    if (locationPermission.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (locationPermission.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app!"
      );
      return false;
    }
    return true;
  }

  async function getLocationHandler() {
    const hasPermission = await verifyPermission();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.mapPreviewImage}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapPreviewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
