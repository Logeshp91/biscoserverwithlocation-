import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  postVerifyOtp,
  resetMobileAuth,
  resetSendOtp,
  clearLoginFields,
  clearVerifyOtp
} from '../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import { storeSession } from '../../services/Apicall';


const VerifyOtpScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { phone } = route.params;
  const {
    postVerifyOtpLoading,
    postVerifyOtpData,
    postVerifyOtpError,
    postVerifyOtpErrorInvalid
  } = useSelector(state => state.postVerifyOtpReducer);

  const [otp, setOtp] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);

  useEffect(() => {
    if (!postVerifyOtpLoading && postVerifyOtpData?.success && postVerifyOtpData?.session_id) {
      const handleSession = async () => {
        const sessionId = postVerifyOtpData.session_id;
        Alert.alert('Welcome!', '', [
          { text: 'OK', onPress: () => navigation.replace('TabNavigation') },
        ]);
      };
      handleSession();
    }

    if (!postVerifyOtpLoading && (postVerifyOtpError || postVerifyOtpErrorInvalid)) {
      const attempts = otpAttempts + 1;
      setOtpAttempts(attempts);

      if (attempts >= 3) {
        Alert.alert(
          'Failed',
          'Maximum OTP attempts reached. Please login again.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
      } else {
        Alert.alert('Invalid OTP', 'Please try again.');
        setOtp('');
      }
    }
  }, [
    postVerifyOtpLoading,
    postVerifyOtpData,
    postVerifyOtpError,
    postVerifyOtpErrorInvalid
  ]);

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      Alert.alert('Validation', 'Please enter a 6-digit OTP');
      return;
    }
    dispatch(postVerifyOtp({ mobile: phone, otp })); // No serverUrl needed
    console.log("postVerifyOtp", postVerifyOtp)
  };

  const handleBackToLogin = () => {
    dispatch(resetMobileAuth());
    dispatch(resetSendOtp());
    dispatch(clearLoginFields());
    dispatch(clearVerifyOtp());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.info}>Enter the 6-digit OTP</Text>

          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
          />

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
            <Text style={styles.verifyButtonText}>
              {postVerifyOtpLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>

          <Text style={styles.attemptsText}>Attempts left: {3 - otpAttempts}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center' },
  otpInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#e22727ff',
    paddingVertical: 14,
    borderRadius: 50,
    width: '80%',
    marginBottom: 15,
  },
  verifyButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  backButton: {
    borderWidth: 1,
    borderColor: '#e22727ff',
    paddingVertical: 14,
    borderRadius: 50,
    width: '80%',
    marginBottom: 10,
  },
  backButtonText: { color: '#e22727ff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  attemptsText: { marginTop: 10, fontSize: 14, color: '#999' },
});
