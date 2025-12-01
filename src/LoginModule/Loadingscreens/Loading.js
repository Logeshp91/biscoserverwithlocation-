
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBaseUrl } from '../../services/Apicall';

const SplashScreen = ({ navigation }) => {
useEffect(() => {
  const initializeApp = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const session = await AsyncStorage.getItem('session_id');
      const serverUrl = await AsyncStorage.getItem('serverUrl');

      if (serverUrl) setBaseUrl(serverUrl);

      if (userId && session) {
        try {
          await ApiMethod.POST(endPoint.postAccessRead, { sessionCheck: true });
          navigation.replace('TabNavigation');
        } catch (err) {
          if (err.type === "SERVER_ERROR") {
            navigation.reset({ index: 0, routes: [{ name: "ServerErrorScreen" }] });
            return;
          }
          navigation.replace('Login'); 
        }
      } else {
        navigation.replace('Login');
      }

    } catch (e) {
      navigation.replace('Login');
    }
  };

  initializeApp();
}, []);


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/download.png')} style={styles.image} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { width: 200, height: 200, resizeMode: 'contain' },
});
