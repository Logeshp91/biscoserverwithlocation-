import actionTypes from "../actionTypes";

const initialState = {
  postVerifyOtpLoading: false,
  postVerifyOtpData: null,
  postVerifyOtpError: null,
  postVerifyOtpErrorInvalid: null,
  isVerified: false,
  isLoggedIn: false,
  userId: null,
  sessionId: null,
};

const postVerifyOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VERIFY_OTP_REQUEST:
      return {
        ...state,
        postVerifyOtpLoading: true,
        postVerifyOtpError: null,
        postVerifyOtpErrorInvalid: null,
      };

    case actionTypes.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpData: action.payload,
        isVerified: true,
        isLoggedIn: true,
        userId: action.payload?.result?.uid,
        sessionId: action.payload?.result?.session_id,
      };

    case actionTypes.VERIFY_OTP_FAILURE:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpError: action.payload,
        isVerified: false,
        isLoggedIn: false,
      };

    case actionTypes.VERIFY_OTP_FAILURE_INVALID:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpErrorInvalid: action.payload,
        isVerified: false,
        isLoggedIn: false,
      };

    case actionTypes.CLEAR_VERIFY_OTP:
      return initialState;

    default:
      return state;
  }
};

export default postVerifyOtpReducer;
