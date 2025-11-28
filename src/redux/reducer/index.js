import { combineReducers } from "redux";
import postauthendicationReducer from "./postauthendication.Reducer";
import postmobileauthReducer from "./postmobileauth.Reducer";
import odooReducer from "./oodo.Reducer";
import notificationReducer from "./notificationReducer";
import fcmReducer from "../slices/fcmSlice"; 
import postcreatevisitReducer from "./postcreatevisit.Reducer";
const reducer =combineReducers({


postauthendicationReducer, 
postmobileauthReducer,  
odooReducer,
notificationReducer,
fcm: fcmReducer, 
postcreatevisitReducer,
})

export default reducer;