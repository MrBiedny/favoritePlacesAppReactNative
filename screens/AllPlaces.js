import { useEffect, useState } from "react";

import PlacesList from "../components/places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";

export default function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  useEffect(
    function () {
      async function loadPlaces() {
        const places = await fetchPlaces();
        setLoadedPlaces(places);
      }
      if (isFocused) {
        loadPlaces();
        // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place]);
      }
    },
    [isFocused]
  );

  return <PlacesList places={loadedPlaces} />;
}
