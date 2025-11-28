import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundFetch from "react-native-background-fetch";
import { isLocationEnabled } from './src/utils/LocationService';

// Notification Channel
async function createNotificationChannel() {
  if (Platform.OS === "android") {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });
  }
}
createNotificationChannel();

// 📌 FCM Background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log("📩 Background FCM:", remoteMessage);
});

// 📌 Background Location Fetch when app is KILLED
const backgroundFetchHeadlessTask = async () => {
  console.log("[BackgroundFetch Headless] Running");

  const gps = await isLocationEnabled();
  if (!gps) {
    await notifee.displayNotification({
      title: "GPS Disabled",
      body: "Please enable GPS for tracking",
      android: { channelId: "default" }
    });
  }

  BackgroundFetch.finish();
};

BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);
AppRegistry.registerComponent(appName, () => App);

// import { AppRegistry, Platform } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';
// import notifee, { AndroidImportance } from '@notifee/react-native';
// import messaging from '@react-native-firebase/messaging';
// import BackgroundFetch from 'react-native-background-fetch';
// import { isLocationEnabled } from './src/utils/LocationService';

// // --- Create Android notification channel ---
// async function createNotificationChannel() {
//   if (Platform.OS === 'android') {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });
//   }
// }
// createNotificationChannel();

// // --- FCM Background Handler ---
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('📩 Background FCM Message:', remoteMessage);

//   const enabled = await isLocationEnabled();
//   if (!enabled) {
//     await notifee.displayNotification({
//       title: 'Location Disabled',
//       body: 'Please enable GPS to continue live tracking',
//       android: { channelId: 'default', importance: AndroidImportance.HIGH },
//     });
//   }
// });

// // --- BackgroundFetch Headless Task ---
// const backgroundFetchHeadlessTask = async () => {
//   console.log('[BackgroundFetch] Headless task running');

//   const enabled = await isLocationEnabled();
//   if (!enabled) {
//     await notifee.displayNotification({
//       title: 'Location Disabled',
//       body: 'Please enable GPS to continue live tracking',
//       android: { channelId: 'default', importance: AndroidImportance.HIGH },
//     });
//   }
//   BackgroundFetch.finish(); 
// };

// BackgroundFetch.registerHeadlessTask(backgroundFetchHeadlessTask);

// AppRegistry.registerComponent(appName, () => App);
