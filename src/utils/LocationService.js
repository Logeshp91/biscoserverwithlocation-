import { Alert, Linking, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

let watchId = null;

export const requestLocationPermission = async () => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const isLocationEnabled = async () => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await check(permission);
  return result === RESULTS.GRANTED;
};

export const startLocationTracking = (callback) => {
  stopLocationTracking(); // prevent duplicate intervals

  watchId = setInterval(() => {
    Geolocation.getCurrentPosition(
      pos => {
        const coords = pos.coords;
        console.log("Lat:", coords.latitude);
        console.log("Long:", coords.longitude);

        if (typeof callback === "function") {
          callback(coords);
        }
      },
      err => console.log("Location error:", err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
    );
  }, 5000);
};

export const stopLocationTracking = () => {
  if (watchId) clearInterval(watchId);
  watchId = null;
};


// import { Alert, Linking, Platform } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// let watchId = null;

// export const requestLocationPermission = async () => {
//   const permission =
//     Platform.OS === 'android'
//       ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//       : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

//   const result = await request(permission);

//   if (result !== RESULTS.GRANTED) {
//     Alert.alert(
//       'Location Required',
//       'Please enable location to continue.',
//       [
//         { text: 'Open Settings', onPress: () => Linking.openSettings() },
//         { text: 'Cancel' },
//       ]
//     );
//     return false;
//   }
//   return true;
// };

// export const isLocationEnabled = async () => {
//   const permission =
//     Platform.OS === 'android'
//       ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//       : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

//   const result = await check(permission);
//   return result === RESULTS.GRANTED;
// };

// export const startLocationTracking = (callback) => {
//   watchId = setInterval(() => {
//     Geolocation.getCurrentPosition(
//       (pos) => callback(pos.coords),
//       (err) => {
//         console.log('Location error:', err);
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
//   }, 2000);
// };

// export const stopLocationTracking = () => {
//   if (watchId) clearInterval(watchId);
//   watchId = null;
// };
