import actionTypes from "../actionTypes";

const initialState = {
  postVerifyOtpLoading: false,
  postVerifyOtpData: null,
  postVerifyOtpError: null,
  postVerifyOtpErrorInvalid: null,
  isVerified: false,
};

const postVerifyOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VERIFY_OTP_REQUEST:
      return {
        ...state,
        postVerifyOtpLoading: true,
        postVerifyOtpData: null,
        postVerifyOtpError: null,
        postVerifyOtpErrorInvalid: null,
        isVerified: false,
      };

    case actionTypes.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpData: action.payload,
        postVerifyOtpError: null,
        postVerifyOtpErrorInvalid: null,
        isVerified: true,
      };

    case actionTypes.VERIFY_OTP_FAILURE:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpData: null,
        postVerifyOtpError: action.payload,
        postVerifyOtpErrorInvalid: null,
        isVerified: false,
      };

    case actionTypes.VERIFY_OTP_FAILURE_INVALID:
      return {
        ...state,
        postVerifyOtpLoading: false,
        postVerifyOtpData: null,
        postVerifyOtpError: null,
        postVerifyOtpErrorInvalid: action.payload,
        isVerified: false,
      };

    case actionTypes.CLEAR_VERIFY_OTP:
      return initialState;

    default:
      return state;
  }
};

export default postVerifyOtpReducer;
