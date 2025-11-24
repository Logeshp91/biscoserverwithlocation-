import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native'; 
import { name as appName } from './app.json';
import App from './App'; 
const messaging = getMessaging();
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Background Message:', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
