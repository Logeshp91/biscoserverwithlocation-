import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {postcreatevisit } from "../../redux/action";
import messaging from '@react-native-firebase/messaging';


const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
        await AsyncStorage.setItem('fcmToken', token);
        console.log('FCM Token:', token);
      } catch (err) {
        console.log('Error fetching FCM token:', err);
      }
    };

    // Fetch IMEI
    const fetchIMEI = async () => {
      try {
        const imei = await DeviceInfo.getUniqueId();
        console.log('Device IMEI:', imei);
      } catch (err) {
        console.log('Error fetching IMEI:', err);
      }
    };

    fetchFcmToken();
    fetchIMEI();
  }, []);

  let deviceImei = '';

  useEffect(() => {
  const fetchIMEI = async () => {
    deviceImei = await DeviceInfo.getUniqueId();
  };
  fetchIMEI();
}, []);

useEffect(() => {
  // Load FCM token only
  messaging()
    .getToken()
    .then(token => {
      setFcmToken(token);
    })
    .catch(err => {
      console.log("FCM Token error:", err);
    });
}, []);



   /** Background location tracking */
  const startLocationTracking = () => {
    const interval = setInterval(async () => {
      Geolocation.getCurrentPosition(
        async pos => {
          await sendLocationToServer(pos.coords);
        },
        err => console.warn("❌ Location error:", err.message),
        { enableHighAccuracy: true }
      );
    }, 5000);

    return () => clearInterval(interval); 
  };

  const sendLocationToServer = async (coords) => {
    const user_id = await AsyncStorage.getItem('user_id');
    const simNumber = await AsyncStorage.getItem("mobile_number");
    const token = fcmToken || (await AsyncStorage.getItem('fcmToken')) || '';
    const imei = deviceImei || (await DeviceInfo.getUniqueId()) || '';
    const body = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: 'user.location.tracking',
        method: 'create',
        args: [{
          user_id: Number(user_id),
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
          track_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          mobile_fcm_device_token: token || '',
          mobile_number: simNumber || '',
          mobile_imenumber: imei || "",       
         }],
        kwargs: {},
        context: {},
      },
      id: Date.now(),
    };
    console.log('📤 Sending location payload Tabnavigation:', JSON.stringify(body, null, 2));
    dispatch(postcreatevisit(body));
  };
   useEffect(() => {
      startLocationTracking();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {name || 'User'}!</Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#333' },
});
