import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";

const UserLocation = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let subscription: { remove: any; };

    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Bạn chưa cấp quyền truy cập vị trí!");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 100,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View >
      <Text>📍 Vị trí hiện tại của bạn:</Text>
      {location ? (
        <Text >
          Latitude: {location.latitude}{"\n"}
          Longitude: {location.longitude}
        </Text>
      ) : (
        <Text >{errorMsg || "Đang lấy vị trí..."}</Text>
      )}
    </View>
  );
};


export default UserLocation;
