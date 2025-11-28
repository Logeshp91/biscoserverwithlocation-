// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   PermissionsAndroid,
//   NativeModules,
//   Alert,  ScrollView,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { postauthendication } from '../../redux/action';
// import Geolocation from 'react-native-geolocation-service';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
// import { getApp } from '@react-native-firebase/app';


// const Login = ({  }) => {
//   const dispatch = useDispatch();
//   const {
//     postauthendicationLoading,
//     postauthendicationData,
//     postauthendicationError,
//     postauthendicationErrorInvalid,
//   } = useSelector(state => state.postauthendicationReducer);

//     const fcmToken = useSelector(state => state.fcm.token);


//   const [phone, setPhone] = useState(postauthendicationData?.username || '');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);
// const [serverUrl, setServerUrl] = useState('');
// const [dbName, setDbName] = useState('');
// const [showServerSettings, setShowServerSettings] = useState(false);
// const [isMobileVerified, setIsMobileVerified] = useState(false);
// const [fetchedLoginName, setFetchedLoginName] = useState('');
// const [step, setStep] = useState(1); // 1=Send OTP, 2=Verify OTP, 3=Password
// const [otp, setOtp] = useState('');
// const [generatedOtp, setGeneratedOtp] = useState(''); 
//   const pinInputs = useRef([]);

// const app = getApp();
// const analytics = getAnalytics(app);

// logEvent(analytics, 'screen_view', {
//   screen_name: 'Login',
// });

//   useEffect(() => {
//     if (postauthendicationLoading) return;

//     const uid = postauthendicationData?.uid;
//     const errorMsg = postauthendicationError || postauthendicationErrorInvalid;

//     if (uid) {
//       Alert.alert('Login successful!');
//       //  navigation.navigate('TabNavigation');
//     } else if (errorMsg) {
//       Alert.alert('Login Failed', errorMsg);
//       setPassword('');
//     }
//   }, [postauthendicationLoading, postauthendicationData, postauthendicationError, postauthendicationErrorInvalid]);

//   useEffect(() => {
//     if (mobileNumber && !phone) setPhone(mobileNumber);
//   }, [mobileNumber]);

//    useEffect(() => {
//      const requestAllPermissions = async () => {
//        try {
//          const locationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//          const simGranted = await PermissionsAndroid.requestMultiple([
//            PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
//            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
//          ]);
 
//          const hasSimPermission =
//            simGranted['android.permission.READ_PHONE_NUMBERS'] === PermissionsAndroid.RESULTS.GRANTED &&
//            simGranted['android.permission.READ_PHONE_STATE'] === PermissionsAndroid.RESULTS.GRANTED;
 
//          if (locationResult === RESULTS.GRANTED) setPermissionGranted(true);
 
//          if (hasSimPermission) await getSimNumbers();
//        } catch (err) {
//          console.error('Permission flow error:', err);
//        }
//      };
 
//      requestAllPermissions();
//    }, []);

// const fetchLocation = () => {
//   Geolocation.getCurrentPosition(
//     pos => {
//       console.log("Lat:", pos.coords.latitude);
//       console.log("Long:", pos.coords.longitude);
//       setLocation(pos.coords);
//     },
//     err => {
//       console.warn("❌ Location error:", err.message);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 30000,
//       maximumAge: 5000,
//       forceRequestLocation: true,
//       showLocationDialog: true, 
//     }
//   );
// };

// useEffect(() => {
//   if (permissionGranted) {
//     fetchLocation();
//   }
// }, [permissionGranted]);

 
//   const getSimNumbers = async () => {
//     try {
//       const { SimInfo } = NativeModules;
//       const numbers = await SimInfo.getSimNumbers();
//       const sims = JSON.parse(numbers);
//       const firstSim = sims.find(sim => sim.number && sim.number.length >= 10);
//       if (firstSim) {
//         let number = firstSim.number.replace(/^(\+91|91)/, '').replace(/\s/g, '');
//         setMobileNumber(number);
//         setPhone(number);
//         console.log('📱 SIM Number fetched:', number);
//       } else {
//         console.warn('No valid SIM number found');
//       }
//     } catch (e) {
//       console.error('SIM fetch error:', e);
//     }
//   };

// const handleSendOtp = async () => {
//   if (!phone) {
//     Alert.alert("Validation", "Please enter mobile number");
//     return;
//   }

//   if (!serverUrl) {
//     Alert.alert("Validation", "Please enter Server URL");
//     return;
//   }

//   try {
//     const url = `${serverUrl}/checkmobile`;
//     const body = { mobile: phone, mobile_fcm: fcmToken || "" }; 

//     console.log("Sending request to:", url, body);

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       Alert.alert("Error", `Server error: ${response.status}`);
//       return;
//     }

//     const data = await response.json();
//     console.log("API Response:", data);

//     if (data.result?.status === 'success') {
//       Alert.alert("OTP Sent", "Please check WhatsApp for OTP");
//       setGeneratedOtp(data.result.otp); 
//       setStep(2);
//     } else {

//       Alert.alert("Error", data.result?.message || "Failed to send OTP");
//     }
//   } catch (e) {
//     console.error("Network error:", e);
//     Alert.alert("Error", "Network error or server unreachable");
//   }
// };

// const handleValidateOtp = () => {
//   if (!otp || otp.length !== 6) {
//     Alert.alert("Invalid OTP", "Please enter the 6-digit OTP");
//     return;
//   }

//   if (otp !== generatedOtp) {
//     Alert.alert("Incorrect OTP", "The OTP you entered is wrong");
//     return;
//   }
//   Alert.alert("Success", "OTP Verified Successfully");
//   setIsMobileVerified(true);
//   setStep(3); 
// };

// const requestLocationPermission = async () => {
//     const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     if (result === RESULTS.GRANTED) return true;
//     const ask = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//     return ask === RESULTS.GRANTED;
//   };


//   const handleLogin = () => {
//   if (!isMobileVerified) {
//     Alert.alert("Validation", "Please verify mobile number first");
//     return;
//   }

//   if (!serverUrl || !dbName) {
//     Alert.alert("Validation", "Enter Server URL & DB Name");
//     return;
//   }

//   if (!password) {
//     Alert.alert("Validation", "Password required");
//     return;
//   }

//   const loginPayload = {
//     serverUrl: serverUrl,
//     jsonrpc: '2.0',
//     params: {
//       db: dbName,
//       login: fetchedLoginName,
//       password: password.trim(),
//       latitude: location?.latitude || 0,
//       longitude: location?.longitude || 0,
//       fcm_token: fcmToken,
//     },
//   };

//   dispatch(postauthendication(loginPayload));
// };

//   const isLoginEnabled = phone && password;

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <KeyboardAvoidingView
//         style={{ flex: 1, backgroundColor: '#fff' }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//       >
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
//           <View style={styles.container}>
//             <View style={styles.topRow}>
//               <View>
//                 <Text style={styles.loginText}>Login Account</Text>
//                 <Text style={styles.welcomeText}>Hello, Welcome</Text>
//               </View>
//               <View style={styles.avatarContainer}>
//                 <Image source={require('../../assets/user.png')} style={styles.avatar} />
//               </View>
//             </View>

//             <Image source={require('../../assets/girlimages.png')} style={styles.centerImage} />
// {/* Settings Icon */}
// <TouchableOpacity 
//   onPress={() => setShowServerSettings(!showServerSettings)} 
//   style={{ alignSelf: 'flex-end', marginBottom: 10 }}
// >
//   <MaterialCommunityIcons 
//     name="arrow-down-bold-circle" 
//     size={28} 
//     color="#444" 
//   />
// </TouchableOpacity>

// {showServerSettings && (
//   <>
//     <Text style={styles.label}>Server URL</Text>
//     <TextInput
//       style={styles.input}
//       placeholder="https://yourserver.com"
//       value={serverUrl}
//       onChangeText={setServerUrl}
//     />

//     <Text style={styles.label}>Database Name</Text>
//     <TextInput
//       style={styles.input}
//       placeholder="Enter database name"
//       value={dbName}
//       onChangeText={setDbName}
//     />
//   </>
// )}

//             <Text style={styles.label}>Phone no..</Text>
//             <View style={styles.phoneInputContainer}>
//               <View style={styles.flagContainer}>
//                 <Image source={require('../../assets/india.png')} style={styles.flag} />
//               </View>

//               <View style={styles.separator} />

//               <TextInput
//                 style={styles.phoneInput}
//                 keyboardType="default"
//                 placeholder="Enter username"
//                 placeholderTextColor="#999"
//                 value={phone}
//                 onChangeText={setPhone}
//               />
//             </View>
// {step === 1 && (
//   <TouchableOpacity style={styles.loginButton} onPress={handleSendOtp}>
//     <Text style={styles.loginButtonText}>Send OTP</Text>
//   </TouchableOpacity>
// )}

// {step === 2 && (
//   <>
//     <Text style={[styles.label, { marginTop: 15 }]}>Enter OTP</Text>
//     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 20 }}>
//       {Array.from({ length: 6 }).map((_, i) => (
//         <TextInput
//           key={i}
//           style={styles.otpInput}
//           keyboardType="number-pad"
//           maxLength={1}
//           value={otp[i] || ''}
//           onChangeText={text => {
//             let newOtp = otp.split('');
//             newOtp[i] = text;
//             setOtp(newOtp.join(''));
//             // auto focus next input
//             if (text && i < 5) pinInputs.current[i + 1].focus();
//           }}
//           ref={el => (pinInputs.current[i] = el)}
//         />
//       ))}
//     </View>
//     <TouchableOpacity
//       style={styles.loginButton}
//       onPress={() => {
//         handleValidateOtp();
//         setIsMobileVerified(true);
//       }}
//     >
//       <Text style={styles.loginButtonText}>Verify OTP</Text>
//     </TouchableOpacity>
//   </>
// )}

// {step === 3 && (
//   <>
//     <Text style={[styles.label, { marginTop: 15 }]}>Password</Text>
//     <View style={[styles.phoneInputContainer, { height: 45, marginBottom: 20 }]}>
//       <TextInput
//         style={{ flex: 1, fontSize: 15, color: '#000' }}
//         secureTextEntry={!showPassword}
//         placeholder="Enter password"
//         placeholderTextColor="#999"
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//         <MaterialCommunityIcons
//           name={showPassword ? 'eye' : 'eye-off'}
//           size={20}
//           color="#999"
//         />
//       </TouchableOpacity>
//     </View>
//     <TouchableOpacity
//       style={styles.loginButton}
//       onPress={handleLogin}
//     >
//       <Text style={styles.loginButtonText}>Login</Text>
//     </TouchableOpacity>
//   </>
// )}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
//   topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10%', marginTop: '8%' },
//   loginText: { fontSize: 22, fontWeight: 'bold' },
//   welcomeText: { fontSize: 16, color: '#666', marginTop: 4 },
//   avatarContainer: { backgroundColor: '#eee', borderRadius: 30, overflow: 'hidden' },
//   avatar: { width: 40, height: 40 },
//   centerImage: { width: 250, height: 250, alignSelf: 'center', marginVertical: 30, marginTop: '20%' },
//   label: { fontSize: 14, marginTop: '5%', marginBottom: '2%', paddingHorizontal: 10 },
//   phoneInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 50, paddingHorizontal: 15, height: 45, backgroundColor: '#fff' },
//   flagContainer: { width: 30, height: 30, borderRadius: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
//   flag: { width: 30, height: 30, resizeMode: 'cover' },
//   separator: { width: 1, height: '80%', backgroundColor: '#ccc', marginHorizontal: 10 },
//   phoneInput: { flex: 1, fontSize: 15, color: '#000' },
//   pinlabel: { fontSize: 14, marginTop: '5%', paddingHorizontal: 10 },
// loginButton: { 
//   paddingVertical: 14, 
//   borderRadius: 50, 
//   marginBottom: 10,
//   marginTop:"5%",
//   backgroundColor: '#2196F3', 
// },
// loginButtonText: { 
//   color: '#fff', 
//   textAlign: 'center', 
//   fontSize: 16, 
//   fontWeight: 'bold' 
// },
//   input: {
//   borderWidth: 1,
//   borderRadius: 30,
//   paddingHorizontal: 15,
//   height: 45,
//   fontSize: 15,
//   marginBottom: 15,
//   color: '#000',
// },
// otpInput: {
//   width: 40,
//   height: 45,
//   borderWidth: 1,
//   borderRadius: 8,
//   textAlign: 'center',
//   fontSize: 18,
//   borderColor: '#ccc',
//   color: '#000'
// },
// });

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
  Alert,  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { postauthendication,postcreatevisit } from '../../redux/action';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBaseUrl } from '../../services/Apicall';
import DeviceInfo from 'react-native-device-info';

const Login = ({  }) => {
  const dispatch = useDispatch();
  const {
    postauthendicationLoading,
    postauthendicationData,
    postauthendicationError,
    postauthendicationErrorInvalid,
  } = useSelector(state => state.postauthendicationReducer);

    const fcmToken = useSelector(state => state.fcm.token);


  const [phone, setPhone] = useState(postauthendicationData?.username || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
const [serverUrl, setServerUrl] = useState('');
const [dbName, setDbName] = useState('');
const [showServerSettings, setShowServerSettings] = useState(false);
const [isMobileVerified, setIsMobileVerified] = useState(false);
const [fetchedLoginName, setFetchedLoginName] = useState('');
const [step, setStep] = useState(1); // 1=Send OTP, 2=Verify OTP, 3=Password
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
    const errorMsg = postauthendicationError || postauthendicationErrorInvalid;

    if (uid) {
      Alert.alert('Login successful!');
      //  navigation.navigate('TabNavigation');
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

 
  // const getSimNumbers = async () => {
  //   try {
  //     const { SimInfo } = NativeModules;
  //     const numbers = await SimInfo.getSimNumbers();
  //     const sims = JSON.parse(numbers);
  //     const firstSim = sims.find(sim => sim.number && sim.number.length >= 10);
  //     if (firstSim) {
  //       let number = firstSim.number.replace(/^(\+91|91)/, '').replace(/\s/g, '');
  //       setMobileNumber(number);
  //       setPhone(number);
  //       console.log('📱 SIM Number fetched:', number);
  //     } else {
  //       console.warn('No valid SIM number found');
  //     }
  //   } catch (e) {
  //     console.error('SIM fetch error:', e);
  //   }
  // };
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

  setServerUrl(serverUrl); 

  const loginPayload = {
    serverUrl: serverUrl,
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
const startLocationTracking = () => {
  setInterval(() => {
    Geolocation.getCurrentPosition(
      async pos => {
        await sendLocationToServer(pos.coords);
      },
      err => {
        console.warn("❌ Background location error:", err.message);
      },
      { enableHighAccuracy: true }
    );
  }, 5000); 
};
const sendLocationToServer = async (coords) => {
  const user_id = await AsyncStorage.getItem('user_id');
  const fcm = fcmToken || '';
const simNumber = await AsyncStorage.getItem("mobile_number");
const imei = await DeviceInfo.getUniqueId();

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
        mobile_fcm_device_token: fcm,
        mobile_number: simNumber  || "",
        mobile_imenumber: imei || "",
      }],
      kwargs: {},
      context: {},
    },
    id: Date.now(),
  };
  console.log('📤 Sending location payload:');
  console.log('User ID:', user_id);
console.log('Mobile Number:', simNumber );
  console.log('FCM Token:', fcm);
  console.log('IMEI:', imei);
  console.log('Latitude:', coords.latitude);
  console.log('Longitude:', coords.longitude);
  console.log('Full body:', JSON.stringify(body, null, 2));

  dispatch(postcreatevisit(body));
};

useEffect(() => {
  if (postauthendicationLoading) return;
  const uid = postauthendicationData?.uid;
  const errorMsg = postauthendicationError || postauthendicationErrorInvalid;

  if (uid) {
    Alert.alert('Login successful!');
    AsyncStorage.setItem('user_id', String(uid));
   AsyncStorage.setItem('username', phone);
    AsyncStorage.setItem('serverUrl', serverUrl);
    startLocationTracking(); 
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