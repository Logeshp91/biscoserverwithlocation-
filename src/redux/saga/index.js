import { takeLatest } from "redux-saga/effects";
import actionType from "../actionTypes";
import postauthendicationSaga from "./postauthendication.Saga";
import postmobileauthSaga from "./postmobileauth.Saga";
import odooCallSaga from "./oodoCall.Saga";
import notificationSaga from "./notificationSaga"; 
import postcreatevisitSaga from "./postcretevisit.Saga";

export default function* (){
   
    yield takeLatest(actionType.POST_POSTAUTHENDICATION_REQUEST,postauthendicationSaga)
     yield takeLatest(actionType.POST_POSTMOBILEAUTH_REQUEST,postmobileauthSaga)
    yield takeLatest(actionType.ODOO_CALL_REQUEST, odooCallSaga);
    yield takeLatest(actionType.POST_CREATEVISIT_REQUEST,postcreatevisitSaga)
    notificationSaga();
}