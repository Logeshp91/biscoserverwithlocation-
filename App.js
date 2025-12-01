import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './src/redux/store';
import Navigation from './src/navigation/StackNavigation';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { startLocationTracking, stopLocationTracking, isLocationEnabled } from './src/LoginModule/commonutils/LocationService';
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
  startLocationTracking(store);
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
