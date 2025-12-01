import { call, put } from 'redux-saga/effects';
import { endPoint, ApiMethod } from '../../services/Apicall';
import actionTypes from '../actionTypes';

function* postSendOtpSaga(action) {
  try {
    const response = yield call(ApiMethod.POST, endPoint.postsendotp, action.payload);
    console.log("sendotp",response)
    const result = response?.data?.result;

    if (result?.success) {
      yield put({
        type: actionTypes.SEND_OTP_SUCCESS,
        payload: result.message, 
      });
    } else {
      yield put({
        type: actionTypes.SEND_OTP_FAILURE,
        payload: result?.message || 'Failed to send OTP',
      });
    }
  } catch (err) {
    yield put({
      type: actionTypes.SEND_OTP_FAILURE,
      payload: err.message || 'Server error',
    });
  }
}

export default postSendOtpSaga;
