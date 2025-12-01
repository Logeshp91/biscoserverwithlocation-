import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  NativeModules,
  Alert, ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postauthendication,postSendOtp, postmobileauth,resetSendOtp } from '../../redux/action';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBaseUrl } from '../../services/Apicall';
import DeviceInfo from 'react-native-device-info';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();

  const { postauthendicationLoading, postauthendicationData, postauthendicationError, postauthendicationErrorInvalid } = useSelector(state => state.postauthendicationReducer);
const { postSendOtpLoading, postSendOtpMessage, postSendOtpError } = useSelector(state => state.postSendOtpReducer);
  const { postmobileauthLoading, postmobileauthData, postmobileauthError } = useSelector(state => state.postmobileauthReducer);
  const fcmToken = useSelector(state => state.fcm.token);

  const [phone, setPhone] = useState(postauthendicationData?.username || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [serverUrl, setServerUrl] = useState('https://testserver.biztechnovations.com');
  const [dbName, setDbName] = useState('bisco_siddhi');
  const [showServerSettings, setShowServerSettings] = useState(false);
    const [useOtpLogin, setUseOtpLogin] = useState(false)
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [fetchedLoginName, setFetchedLoginName] = useState('');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const pinInputs = useRef([]);
  let simNumber = "";
  const app = getApp();
  const analytics = getAnalytics(app);

  logEvent(analytics, 'screen_view', {
    screen_name: 'Login',
  });

  useEffect(() => {
    if (postauthendicationLoading) return;

    const uid = postauthendicationData?.uid;
    const partner_display_name = postauthendicationData?.partner_display_name;
    const errorMsg = postauthendicationError || postauthendicationErrorInvalid;

    if (uid) {
      Alert.alert('Login successful!');
      navigation.navigate('TabNavigation');
    } else if (errorMsg) {
      Alert.alert('Login Failed', errorMsg);
      setPassword('');
    }
  }, [postauthendicationLoading, postauthendicationData, postauthendicationError, postauthendicationErrorInvalid]);

  useEffect(() => {
    if (mobileNumber && !phone) setPhone(mobileNumber);
  }, [mobileNumber]);

  useEffect(() => {
    const requestAllPermissions = async () => {
      try {
        const locationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        const simGranted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);

        const hasSimPermission =
          simGranted['android.permission.READ_PHONE_NUMBERS'] === PermissionsAndroid.RESULTS.GRANTED &&
          simGranted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED;

        if (locationResult === RESULTS.GRANTED) setPermissionGranted(true);

        if (hasSimPermission) await getSimNumbers();
      } catch (err) {
        console.error('Permission flow error:', err);
      }
    };

    requestAllPermissions();
  }, []);

  const fetchLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log("Lat:", pos.coords.latitude);
        console.log("Long:", pos.coords.longitude);
        setLocation(pos.coords);
      },
      err => {
        console.warn("❌ Location error:", err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  useEffect(() => {
    if (permissionGranted) {
      fetchLocation();
    }
  }, [permissionGranted]);


  const getSimNumbers = async () => {
    try {
      const { SimInfo } = NativeModules;
      const numbers = await SimInfo.getSimNumbers();
      const sims = JSON.parse(numbers);

      const firstSim = sims.find(sim => sim.number && sim.number.length >= 10);
      if (firstSim) {
        let number = firstSim.number.replace(/^(\+91|91)/, '').replace(/\s/g, '');
        setMobileNumber(number);
        setPhone(firstSim.number); // visible in UI
        await AsyncStorage.setItem('mobile_number', number);
        console.log("📱 SIM Number stored:", number);
      } else {
        console.log("⚠ No SIM mobile number found");
        await AsyncStorage.setItem('mobile_number', "");
      }
    } catch (e) {
      console.error("SIM fetch error:", e);
      await AsyncStorage.setItem('mobile_number', "");
    }
  };

  const handleLogin = () => {
    if (!serverUrl) {
      Alert.alert("Validation", "Please enter Server URL");
      return;
    }
    if (!dbName) {
      Alert.alert("Validation", "Please enter Database Name");
      return;
    }
    if (!phone || !password) {
      Alert.alert("Validation", "Username and password are required");
      return;
    }

    // Ensure the URL has a protocol
    let sanitizedUrl = serverUrl;
    if (!/^https?:\/\//i.test(serverUrl)) {
      sanitizedUrl = "https://" + serverUrl;
    }

    setBaseUrl(sanitizedUrl);
    setServerUrl(sanitizedUrl);

    const loginPayload = {
      serverUrl: sanitizedUrl,
      jsonrpc: '2.0',
      params: {
        db: dbName,
        login: phone.trim(),
        password: password.trim(),
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
      },
    };

    dispatch(postauthendication(loginPayload));
  };

  const isLoginEnabled = phone && password;

  const sanitizeUrl = (url) => {
  if (!/^https?:\/\//i.test(url)) return "https://" + url;
  return url;
};
const handleSendOtpFlow = () => {
  if (!phone) {
    Alert.alert("Required", "Enter phone number");
    return;
  }
 const sanitizedUrl = sanitizeUrl(serverUrl);
  setBaseUrl(sanitizedUrl);
  setServerUrl(sanitizedUrl);
  console.log("⏳ Checking mobile registration...");
 dispatch(postmobileauth({ mobile: phone.toString() }));
  console.log("postmobileauth.",postmobileauth);
};

useEffect(() => {
  if (postmobileauthLoading) return;
  if (!postmobileauthData && !postmobileauthError) return;

  const status = postmobileauthData?.status || postmobileauthError?.status;
  const message = postmobileauthData?.message || postmobileauthError?.message;

  if (status === "success") {
    dispatch(postSendOtp({ mobile: phone.toString() }));
  }
  if (status === "error") {
    console.log("❗ Should show alert:", message);
    Alert.alert("Mobile Not Registered", message || "Please check your number");
  }
}, [postmobileauthLoading, postmobileauthData, postmobileauthError]);

useEffect(() => {
  if (postSendOtpLoading) return;
  if (!postSendOtpMessage && !postSendOtpError) return;

  if (postSendOtpMessage) {
    Alert.alert("OTP Sent", postSendOtpMessage);
    navigation.navigate("VerifyOtp", { phone });
  }

  if (postSendOtpError) {
    Alert.alert("OTP Failed", postSendOtpError);
  }

  dispatch(resetSendOtp());
}, [postSendOtpLoading, postSendOtpMessage,postSendOtpError]);


  useEffect(() => {
    if (postauthendicationLoading) return;
    const uid = postauthendicationData?.uid;
    const errorMsg = postauthendicationError || postauthendicationErrorInvalid;
    const partner_display_name = postauthendicationData?.partner_display_name;

    if (uid) {
      Alert.alert('Login successful!');
      AsyncStorage.setItem('user_id', String(uid));
      AsyncStorage.setItem('username', phone);
      AsyncStorage.setItem('serverUrl', serverUrl);
      AsyncStorage.setItem('username', partner_display_name);
      setBaseUrl(serverUrl);
    }
    else if (errorMsg) {
      Alert.alert('Login Failed', errorMsg);
      setPassword('');
    }
  }, [
    postauthendicationLoading,
    postauthendicationData,
    postauthendicationError,
    postauthendicationErrorInvalid
  ]);



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.loginText}>Login Account</Text>
                <Text style={styles.welcomeText}>Hello, Welcome</Text>
              </View>
              <View style={styles.avatarContainer}>
                <Image source={require('../../assets/user.png')} style={styles.avatar} />
              </View>
            </View>

            <Image source={require('../../assets/girlimages.png')} style={styles.centerImage} />
            {/* Settings Icon */}
            <TouchableOpacity
              onPress={() => setShowServerSettings(!showServerSettings)}
              style={{ alignSelf: 'flex-end', marginBottom: 10 }}
            >
              <MaterialCommunityIcons
                name="arrow-down-bold-circle"
                size={28}
                color="#444"
              />
            </TouchableOpacity>

            {/* Show / Hide Server Settings */}
            {showServerSettings && (
              <>
                <Text style={styles.label}>Server URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="https://yourserver.com"
                  value={serverUrl}
                  onChangeText={setServerUrl}
                />

                <Text style={styles.label}>Database Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter database name"
                  value={dbName}
                  onChangeText={setDbName}
                />
              </>
            )}

            <Text style={styles.label}>Phone no..</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.flagContainer}>
                <Image source={require('../../assets/india.png')} style={styles.flag} />
              </View>

              <View style={styles.separator} />

              <TextInput
                style={styles.phoneInput}
                keyboardType="default"
                placeholder="Enter username"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

           {!useOtpLogin && (
  <>
    <Text style={styles.pinlabel}>Password</Text>

    <View style={[styles.phoneInputContainer, { height: 45, marginBottom: 20 }]}>
      <TextInput
        style={{ flex: 1, fontSize: 15, color: '#000' }}
        secureTextEntry={!showPassword}
        placeholder="Enter password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <MaterialCommunityIcons
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color="#999"
        />
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      onPress={handleLogin}
      style={[
        styles.loginButton,
        { backgroundColor: isLoginEnabled ? '#e22727ff' : '#ccc' },
      ]}
      disabled={!isLoginEnabled}
    >
      <Text style={styles.loginButtonText}>Submit</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setUseOtpLogin(true)} style={{ marginTop: 14 }}>
      <Text style={{ textAlign: "center", color: "#e22727ff", fontSize: 15 }}>
        Login using OTP
      </Text>
    </TouchableOpacity>
  </>
)}
    {useOtpLogin && (
        <>
          <TouchableOpacity
            onPress={handleSendOtpFlow}
            style={[
        styles.loginButton,
        { backgroundColor:'#e22727ff',marginTop:"5%" },
      ]}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>Send OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setUseOtpLogin(false)} style={{ marginTop: 18 }}>
            <Text style={{ color: "red", textAlign: "center" }}>
              Login with Password
            </Text>
          </TouchableOpacity>
        </>
      )}
       </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10%', marginTop: '8%' },
  loginText: { fontSize: 22, fontWeight: 'bold' },
  welcomeText: { fontSize: 16, color: '#666', marginTop: 4 },
  avatarContainer: { backgroundColor: '#eee', borderRadius: 30, overflow: 'hidden' },
  avatar: { width: 40, height: 40 },
  centerImage: { width: 250, height: 250, alignSelf: 'center', marginVertical: 30, marginTop: '20%' },
  label: { fontSize: 14, marginTop: '5%', marginBottom: '2%', paddingHorizontal: 10 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 50, paddingHorizontal: 15, height: 45, backgroundColor: '#fff' },
  flagContainer: { width: 30, height: 30, borderRadius: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  flag: { width: 30, height: 30, resizeMode: 'cover' },
  separator: { width: 1, height: '80%', backgroundColor: '#ccc', marginHorizontal: 10 },
  phoneInput: { flex: 1, fontSize: 15, color: '#000' },
  pinlabel: { fontSize: 14, marginTop: '5%', paddingHorizontal: 10 },
  loginButton: { paddingVertical: 14, borderRadius: 50, marginBottom: 10 },
  loginButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 15,
    marginBottom: 15,
    color: '#000',
  },
});