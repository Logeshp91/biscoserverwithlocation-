import { Alert, Linking, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

let watchId = null;

export const requestLocationPermission = async () => {
  const permission =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permission);

  if (result !== RESULTS.GRANTED) {
    Alert.alert(
      "Location Required",
      "Please enable location to continue.",
      [
        { text: "Open Settings", onPress: () => Linking.openSettings() },
        { text: "Cancel" },
      ]
    );
    return false;
  }

  return true;
};

export const startLocationTracking = (callback) => {
  // FOREGROUND TRACKING EVERY 2 SECONDS
  watchId = setInterval(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        callback(pos.coords);
      },
      (err) => {
        console.log("Location error:", err);

        if (err.code === 1) {
          Alert.alert(
            "Location Disabled",
            "Please enable GPS to continue.",
            [{ text: "Enable", onPress: () => Linking.openSettings() }]
          );
        }
      },
      { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
    );
  }, 2000);
};

export const stopLocationTracking = () => {
  if (watchId) {
    clearInterval(watchId);
    watchId = null;
  }
};
