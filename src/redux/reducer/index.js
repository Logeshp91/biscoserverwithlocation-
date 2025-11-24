import { combineReducers } from "redux";
import postauthendicationReducer from "./postauthendication.Reducer";
import odooReducer from "./oodo.Reducer";
import notificationReducer from "./notificationReducer";
const reducer =combineReducers({


postauthendicationReducer,   
odooReducer,
notificationReducer,
})

export default reducer;