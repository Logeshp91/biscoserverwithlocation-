import { takeLatest } from "redux-saga/effects";
import actionTypes from "../actionTypes";
import postauthendicationSaga from "./postauthendication.Saga";
import postmobileauthSaga from "./postmobileauth.Saga";
import odooCallSaga from "./oodoCall.Saga";
import notificationSaga from "./notificationSaga"; 
import postcreatevisitSaga from "./postcretevisit.Saga";
import postAccessReadSaga from "./postAccessRead.Saga";
import postConvertSaga from './postConvert.Saga';
import postCustomerListSaga from './postCustomerList.Saga';
import postOutstandingSaga from './postOutstanding.Saga';
import postSendOtpSaga from "./postSendOtp.Saga";
import postVerifyOtpSaga from "./postVeifyOtp.Saga";
export default function* (){
   
    yield takeLatest(actionTypes.POST_POSTAUTHENDICATION_REQUEST,postauthendicationSaga)
    yield takeLatest(actionTypes.POST_POSTMOBILEAUTH_REQUEST, postmobileauthSaga);
    yield takeLatest(actionTypes.ODOO_CALL_REQUEST, odooCallSaga);
    yield takeLatest(actionTypes.POST_CREATEVISIT_REQUEST,postcreatevisitSaga)
    yield takeLatest(actionTypes.POST_ACCESSREAD_REQUEST,postAccessReadSaga)
    yield takeLatest(actionTypes.POST_CONVERT_REQUEST,postConvertSaga)
    yield takeLatest(actionTypes.POST_CUSTOMERLIST_REQUEST,postCustomerListSaga)
    yield takeLatest(actionTypes.POST_OUTSTANDING_REQUEST,postOutstandingSaga)
    yield takeLatest(actionTypes.SEND_OTP_REQUEST,postSendOtpSaga)
    yield takeLatest(actionTypes.VERIFY_OTP_REQUEST,postVerifyOtpSaga)
    notificationSaga();
}