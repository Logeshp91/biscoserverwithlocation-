import { call, put } from 'redux-saga/effects';
import { endPoint, ApiMethod } from "../../services/Apicall"; 
import actionTypes from "../actionTypes";

function* postmobileauthSaga(action) {
  try {
    const response = yield call(ApiMethod.POST, endPoint.postmobileauth, action.payload);
    console.log("responsemobile", response);
    console.log("📡 POST /postmobileauth payload:", action.payload);
    console.log("📡 POST /postmobileauth response:", response);

    const result = response?.data?.result;

    if (!result) {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
        payload: { status: "error", message: "No response from server" }
      });
      return;
    }
    if (result.status === "success") {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_SUCCESS,
        payload: result
      });
    } else {
      yield put({
        type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
        payload: result
      });
    }

  } catch (err) {
    yield put({
      type: actionTypes.POST_POSTMOBILEAUTH_FAILURE,
      payload: { status: "error", message: err.message || "Server error" }
    });
  }
}

export default postmobileauthSaga;
