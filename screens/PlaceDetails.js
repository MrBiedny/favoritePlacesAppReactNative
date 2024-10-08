import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import OutlinedButton from "../components/ui/OutlinedButton";
import { Colors } from "../constants/color";
import { fetchPlaceDetails } from "../util/database";

function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initalLat: fetchedPlace.location.lat,
      initalLng: fetchedPlace.location.lng,
    });
  }

  const selectedPlaceId = route.params.placeId;

  useEffect(
    function () {
      async function loadPlaceData() {
        const place = await fetchPlaceDetails(selectedPlaceId);
        setFetchedPlace(place);
        navigation.setOptions({
          title: place.title,
        });
      }
      loadPlaceData();
    },
    [selectedPlaceId]
  );

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={{ uri: fetchedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    padding: 20,
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
