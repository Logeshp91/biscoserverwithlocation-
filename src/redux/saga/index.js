import { takeLatest } from "redux-saga/effects";
import actionType from "../actionTypes";
import postauthendicationSaga from "./postauthendication.Saga";
import odooCallSaga from "./oodoCall.Saga";
import notificationSaga from "./notificationSaga"; 

export default function* (){
   
    yield takeLatest(actionType.POST_POSTAUTHENDICATION_REQUEST,postauthendicationSaga)
    yield takeLatest(actionType.ODOO_CALL_REQUEST, odooCallSaga);
    notificationSaga();
}