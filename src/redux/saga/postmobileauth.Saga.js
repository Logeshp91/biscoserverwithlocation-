import { call, put } from 'redux-saga/effects';
import { endPoint, ApiMethod } from "../../services/Apicall"; 
import actionTypes from "../actionTypes";

function* postmobileauthSaga(action) {
  try {
    const response = yield call(ApiMethod.POST, endPoint.postmobileauth, action.payload);
    const data = response?.data ?? response;

    if (data?.result) {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_SUCCESS,
        payload: data.result,
      });

    } else if (data?.error) {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
        payload: data.error.message,
      });

    } else {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
        payload: "Authentication failed",
      });
    }

  } catch (err) {

    if (err.response?.status === 401) {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE_INVALID,
        payload: "Invalid credentials",
      });
    } else {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
        payload: err.message || "Server error",
      });
    }
  }
}

export default postmobileauthSaga;
