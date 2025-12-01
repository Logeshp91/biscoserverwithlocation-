import { combineReducers } from "redux";
import postauthendicationReducer from "./postauthendication.Reducer";
import postmobileauthReducer from "./postmobileauth.Reducer";
import odooReducer from "./oodo.Reducer";
import notificationReducer from "./notificationReducer";
import fcmReducer from "../slices/fcmSlice"; 
import postcreatevisitReducer from "./postcreatevisit.Reducer";
import postAccessReadReducer from "./postAccessRead.Reducer";
import postConvertReducer from './postConvert.Reducer';
import postCustomerListReducer from './postCustomerList.Reducer';
import postOutstandingReducer from './postOutstanding.Reducer';
import postSendOtpReducer from "./postSendOtp.Reducer";
import postVerifyOtpReducer from "./postVerifyOtp.Reducer";
const reducer =combineReducers({


postauthendicationReducer, 
postmobileauthReducer,  
odooReducer,
notificationReducer,
fcm: fcmReducer, 
postcreatevisitReducer,
postAccessReadReducer,
postConvertReducer,
postCustomerListReducer,
postOutstandingReducer,
postSendOtpReducer,
postVerifyOtpReducer,
})

export default reducer;