import { call, put } from 'redux-saga/effects';
import { endPoint, ApiMethod, setBaseUrl } from '../../services/Apicall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import actionTypes from '../actionTypes';

function* postVerifyOtpSaga(action) {
  try {
    const response = yield call(ApiMethod.POST, endPoint.postverifyotp, action.payload);
    console.log("responsereceuveotp",response)
    const result = response?.data?.result;
    const error = response?.data?.error;

    if (result?.success && result?.session_id && result?.uid) {
      yield call([AsyncStorage, 'setItem'], 'session_id', result.session_id);
      yield call([AsyncStorage, 'setItem'], 'user_id', String(result.uid));
      yield call([AsyncStorage, 'setItem'], 'username', action.payload.mobile);

      setBaseUrl(action.payload.serverUrl || '');

      yield put({
        type: actionTypes.VERIFY_OTP_SUCCESS,
        payload: result,
      });

    } else if (result && result.success === false) {
      // OTP invalid case
      yield put({
        type: actionTypes.VERIFY_OTP_FAILURE_INVALID,
        payload: 'Invalid OTP',
      });

    } else if (error) {
      yield put({
        type: actionTypes.VERIFY_OTP_FAILURE,
        payload: error.message || 'Server error',
      });

    } else {
      yield put({
        type: actionTypes.VERIFY_OTP_FAILURE,
        payload: 'OTP verification failed',
      });
    }

  } catch (err) {
    yield put({
      type: actionTypes.VERIFY_OTP_FAILURE,
      payload: err.type === 'ODOO_ERROR'
        ? 'Server error: ' + err.message
        : err.message || 'Server error',
    });
  }
}

export default postVerifyOtpSaga;
