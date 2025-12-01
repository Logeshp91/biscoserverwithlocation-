import actionTypes from "../actionTypes";

const initialState = {
  postSendOtpLoading: false,
  postSendOtpMessage: null,
  postSendOtpError: null,
};

const postSendOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_OTP_REQUEST:
      return {
        ...state,
        postSendOtpLoading: true,
        postSendOtpMessage: null,
        postSendOtpError: null,
      };

    case actionTypes.SEND_OTP_SUCCESS:
      return {
        ...state,
        postSendOtpLoading: false,
        postSendOtpMessage: action.payload,
        postSendOtpError: null,
      };

    case actionTypes.SEND_OTP_FAILURE:
      return {
        ...state,
        postSendOtpLoading: false,
        postSendOtpMessage: null,
        postSendOtpError: action.payload,
      };
        case actionTypes.SEND_OTP_RESET:
      return { ...state, postSendOtpMessage: null, postSendOtpError: null, otpAttempts: 0 };


    case actionTypes.CLEAR_SEND_OTP:
      return initialState;

    default:
      return state;
  }
};

export default postSendOtpReducer;
