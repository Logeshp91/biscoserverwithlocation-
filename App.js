import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/redux/store';
import Navigation from './src/navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { startLocationTracking, stopLocationTracking, isLocationEnabled } from './src/utils/LocationService';
import { setFcmToken } from './src/redux/slices/fcmSlice';

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

const App = () => {
  const dispatch = useDispatch();
const loggedIn = useSelector(state => state.postauthendicationReducer.isLoggedIn);

  useEffect(() => {
    if (loggedIn) {
      console.log("🔵 User logged in — Start Live Tracking");
      startLocationTracking(coords => {
        console.log("📍 Live:", coords);
      });
    } else {
      console.log("🔴 User logged out — Stop Tracking");
      stopLocationTracking();
    }
  }, [loggedIn]);

  // 🔥 FCM Setup
  useEffect(() => {
    (async () => {
      await messaging().requestPermission();
      const token = await messaging().getToken();
      if (token) dispatch(setFcmToken(token));
    })();
  }, [dispatch]);

  // 🔥 Background Fetch
  useEffect(() => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async taskId => {
        console.log("[BackgroundFetch] Task:", taskId);

        const enabled = await isLocationEnabled();
        if (!enabled) {
          await notifee.displayNotification({
            title: "GPS Disabled",
            body: "Turn on GPS for live tracking",
            android: { channelId: "default", importance: AndroidImportance.HIGH },
          });
        }

        BackgroundFetch.finish(taskId);
      },
      err => console.log("BackgroundFetch ERROR:", err)
    );
  }, []);

  return <Navigation />;
};

export default AppWrapper;


// import React, { useEffect } from 'react';
// import { Provider, useDispatch } from 'react-redux';
// import store from './src/redux/store';
// import Navigation from './src/navigation/StackNavigation';
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';
// import {
//   requestLocationPermission,
//   startLocationTracking,
//   stopLocationTracking,
//   isLocationEnabled,
// } from './src/utils/LocationService';
// import { setFcmToken } from './src/redux/slices/fcmSlice';
// import BackgroundFetch from 'react-native-background-fetch';

// const AppWrapper = () => (
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

// const App = () => {
//   const dispatch = useDispatch();

//   // Foreground location tracking
//   useEffect(() => {
//     const setupLocation = async () => {
//       const granted = await requestLocationPermission();
//       if (!granted) return;

//       startLocationTracking(coords => {
//         console.log('📍 Live Location:', coords);
//       });
//     };

//     setupLocation();

//     return () => stopLocationTracking();
//   }, []);

//   // FCM setup
//   useEffect(() => {
//     const setupFCM = async () => {
//       const authStatus = await messaging().requestPermission();
//       const enabled =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//       if (!enabled) console.log('❌ Notification permission denied');

//       const fcmToken = await messaging().getToken();
//       if (fcmToken) dispatch(setFcmToken(fcmToken));

//       // Foreground notification listener
//       messaging().onMessage(async remoteMessage => {
//         console.log('📩 Foreground Notification:', remoteMessage);
//       });
//     };

//     setupFCM();
//   }, [dispatch]);

//   // BackgroundFetch periodic location check
//   useEffect(() => {
//     const configureBackgroundFetch = async () => {
//       BackgroundFetch.configure(
//         {
//           minimumFetchInterval: 15, // minutes
//           stopOnTerminate: false,
//           startOnBoot: true,
//           enableHeadless: true,
//         },
//         async taskId => {
//           console.log('[BackgroundFetch] Event:', taskId);

//           const enabled = await isLocationEnabled();
//           if (!enabled) {
//             await notifee.displayNotification({
//               title: 'Location Disabled',
//               body: 'Please enable GPS to continue live tracking',
//               android: { channelId: 'default', importance: notifee.AndroidImportance.HIGH },
//             });
//           }

//           BackgroundFetch.finish(taskId);
//         },
//         error => {
//           console.log('[BackgroundFetch] configure error:', error);
//         }
//       );
//     };

//     configureBackgroundFetch();
//   }, []);

//   return <Navigation />;
// };

// export default AppWrapper;
