// import React, { useEffect } from 'react';
// import { Alert, PermissionsAndroid, Platform } from 'react-native';
// import { Provider } from 'react-redux';
// import store from './src/redux/store';
// import Navigation from './src/navigation/StackNavigation';
// import analytics from '@react-native-firebase/analytics';
// import messaging from '@react-native-firebase/messaging';

// const App = () => {

//   const requestAndroidPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//         );
//       } catch (e) {
//         console.log("Permission error:", e);
//       }
//     }
//   };

//   useEffect(() => {
//     analytics().logAppOpen();
//   }, []);

//   useEffect(() => {
//     requestAndroidPermission();

//     async function setupFCM() {
//       try {
//         const authStatus = await messaging().requestPermission();
//         const enabled =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//         if (!enabled) {
//           console.log("❌ Notification permission denied");
//         }

//         const fcmToken = await messaging().getToken();

//         if (!fcmToken) {
//           Alert.alert(
//             "Enable Google Play Services",
//             "Notifications cannot work because Google Play Services is disabled or unavailable. Please enable it in your device settings."
//           );
//           return;
//         }

//         console.log("🔥 FCM Token:", fcmToken);

//         messaging().onMessage(async remoteMessage => {
//           console.log("📩 Foreground Notification:", remoteMessage);
//         });

//       } catch (err) {
//         console.log("⚠️ FCM Error:", err);

//         if (String(err).includes("SERVICE_NOT_AVAILABLE")) {
//           Alert.alert(
//             "Google Play Services Required",
//             "Please enable or update Google Play Services to receive notifications."
//           );
//         }
//       }
//     }

//     setupFCM();

//   }, []);


//   return (
//     <Provider store={store}>
//       <Navigation />
//     </Provider>
//   );
// };

// export default App;



import React, { useEffect } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import Navigation from "./src/navigation/StackNavigation";
import analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";
import {
  requestLocationPermission,
  startLocationTracking,
  stopLocationTracking,
} from "./src/utils/LocationService";

const App = () => {

  useEffect(() => {
    analytics().logAppOpen();
  }, []);

  // Notification setup
  const requestAndroidPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
  };

  // Setup FCM
  useEffect(() => {
    requestAndroidPermission();

    async function setupFCM() {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log("❌ Notification permission denied");
        }

        const fcmToken = await messaging().getToken();

        if (!fcmToken) {
          Alert.alert(
            "Enable Google Play Services",
            "Notifications cannot work because Google Play Services is disabled or unavailable. Please enable it in your device settings."
          );
          return;
        }

        console.log("🔥 FCM Token:", fcmToken);

        messaging().onMessage(async remoteMessage => {
          console.log("📩 Foreground Notification:", remoteMessage);
        });

      } catch (err) {
        console.log("⚠️ FCM Error:", err);

        if (String(err).includes("SERVICE_NOT_AVAILABLE")) {
          Alert.alert(
            "Google Play Services Required",
            "Please enable or update Google Play Services to receive notifications."
          );
        }
      }
    }

    setupFCM();

  }, []);
  // Location Tracking
  useEffect(() => {
    async function setupLocation() {
      const granted = await requestLocationPermission();
      if (!granted) return;

      startLocationTracking((coords) => {
        console.log("📍 Live Location:", coords);
      });
    }

    setupLocation();

    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
