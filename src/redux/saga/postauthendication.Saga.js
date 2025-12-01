import { call, put } from 'redux-saga/effects';
import { endPoint, ApiMethod } from "../../services/Apicall"; 
import actionTypes from "../actionTypes";

function* postauthendicationSaga(action) {
  console.log("Action payload:", action.payload);
  
  try {
    const response = yield call(ApiMethod.POST, endPoint.postauthendication, action.payload);
    console.log("Login result:", response);

    const data = response?.data;
    const result = data?.result;

    if (result?.uid) {
      yield put({
        type: actionTypes.POST_POSTAUTHENDICATION_SUCCESS,
        payload: result,
      });
    } else {
      yield put({
        type: actionTypes.POST_POSTAUTHENDICATION_FAILURE,
        payload: 'Authentication failed',
      });
    }

  } catch (err) {
    if (err.response?.status === 401) {
      yield put({
        type: actionTypes.POST_POSTAUTHENDICATION_FAILURE_INVALID,
        payload: 'Invalid credentials',
      });
    } else {
      yield put({
        type: actionTypes.POST_POSTAUTHENDICATION_FAILURE,
        payload: err.message || 'Server error',
      });
    }
  }
}

export default postauthendicationSaga;
