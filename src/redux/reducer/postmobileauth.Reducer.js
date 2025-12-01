import actionTypes from "../actionTypes";

const initial = {
  postmobileauthLoading: false,
  userToken: null,
  postmobileauthData: null,
  postmobileauthError: null,
  postmobileauthErrorInvalid: null,
  uid: null,
};

const postmobileauthReducer = (state = initial, action) => {
  switch (action.type) {
    case actionTypes.POST_POSTMOBILEAUTH_REQUEST:
      return {
        ...state,
        postmobileauthLoading: true,
        userToken: action.payload?.token || null,
      };

    case actionTypes.POST_POSTMOBILEAUTH_SUCCESS:
      return {
        ...state,
        postmobileauthLoading: false,
        postmobileauthData: action.payload,
        uid: action.payload?.uid || null,
        userToken: action.payload?.AccessToken || null,
        postmobileauthError: null,
        postmobileauthErrorInvalid: null,
      };

    case actionTypes.SET_AUTH_TOKEN:
      return {
        ...state,
        userToken: action.payload?.token || null,
        postmobileauthData: {
          Data: action.payload?.userdata || null,
        },
      };

    case actionTypes.POST_POSTMOBILEAUTH_FAILURE:
      return {
        ...state,
        postmobileauthLoading: false,
        postmobileauthData: null,  // ✅ fix here
        postmobileauthError: action.payload,
        userToken: null,
      };

    case actionTypes.POST_POSTMOBILEAUTH_FAILURE_INVALID:
      return {
        ...state,
        postmobileauthLoading: false,
        postmobileauthData: null,  // ✅ fix here
        postmobileauthError: null,
        postmobileauthErrorInvalid: action.payload,
        userToken: null,
      };
      case actionTypes.POST_POSTMOBILEAUTH_RESET:
      return { ...state, postmobileauthData: null, postmobileauthError: null };

    case actionTypes.CLEAR_LOGIN_FIELDS:
      return {
        ...state,
        userToken: null,
        uid: null,
        postmobileauthError: null,
        postmobileauthErrorInvalid: null,
        postmobileauthLoading: false,
        postmobileauthData: null,
      };

    default:
      return state;
  }
};

export default postmobileauthReducer;
