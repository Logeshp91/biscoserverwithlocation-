
import actionTypes from "../actionTypes";

const initial = {
  postauthendicationLoading: false,
  userToken: null,
  postauthendicationData: null,
  postauthendicationError: null,
  postauthendicationErrorInvalid: null,
  uid: null,
  isLoggedIn: false, // <-- add this
};

const postauthendicationReducer = (state = initial, action) => {
  switch (action.type) {
    case actionTypes.POST_POSTAUTHENDICATION_REQUEST:
      return {
        ...state,
        postauthendicationLoading: true,
      };

    case actionTypes.POST_POSTAUTHENDICATION_SUCCESS:
      return {
        ...state,
        postauthendicationLoading: false,
        postauthendicationData: action.payload,
        uid: action.payload?.uid || null,
        userToken: action.payload?.AccessToken || null,
        postauthendicationError: null,
        postauthendicationErrorInvalid: null,
        isLoggedIn: true,
      };

    case actionTypes.POST_POSTAUTHENDICATION_FAILURE:
    case actionTypes.POST_POSTAUTHENDICATION_FAILURE_INVALID:
      return {
        ...state,
        postauthendicationLoading: false,
        userToken: null,
        postauthendicationData: null,
                postauthendicationError: null,
        postauthendicationErrorInvalid: action.payload,
        isLoggedIn: false, 
      };

    case actionTypes.CLEAR_LOGIN_FIELDS:
      return {
        ...state,
        userToken: null,
        uid: null,
        postauthendicationError: null,
        postauthendicationErrorInvalid: null,
        postauthendicationLoading: false,
        postauthendicationData: null,
        isLoggedIn: false, 
      };
      

    default:
      return state;
  }
};

export default postauthendicationReducer;

