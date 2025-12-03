import actionTypes from "./actionTypes";

export const postmobileauth = (payload) => ({
  type: actionTypes.POST_POSTMOBILEAUTH_REQUEST,
  payload
});

export const resetMobileAuth = () => ({ type: actionTypes.POST_POSTMOBILEAUTH_RESET });
export const resetSendOtp = () => ({ type: actionTypes.SEND_OTP_RESET });
export const clearVerifyOtp = () => ({
  type: actionTypes.CLEAR_VERIFY_OTP
});


export const postauthendication = (payload,results,) => ({
  type: actionTypes.POST_POSTAUTHENDICATION_REQUEST,
  payload,results
});

export const postSendOtp = (payload) => ({
  type: actionTypes.SEND_OTP_REQUEST,
  payload,
});

export const postVerifyOtp = (payload) => ({
  type: actionTypes.VERIFY_OTP_REQUEST,
  payload,
});

export const addNotification = (payload) => {
  return {
    type: actionTypes.ADD_NOTIFICATION,
    payload,
  };
};

export const postcreatevisit = (payload, requestKey,resolve) => {
  return {
    type: actionTypes.POST_CREATEVISIT_REQUEST,
    payload,
    requestKey,
    resolve
  };
};

export const postOutstanding = (payload, requestKey,resolve) => {
  return {
    type: actionTypes.POST_OUTSTANDING_REQUEST,
    payload,
    requestKey,
    resolve
  };
};

export const postCustomerList = (payload, requestKey,resolve) => {
  return {
    type: actionTypes.POST_CUSTOMERLIST_REQUEST,
    payload,
    requestKey,
    resolve,
  };
};

export const postAccessRead = (payload, requestKey) => {
  return {
    type: actionTypes.POST_ACCESSREAD_REQUEST,
    payload,
    requestKey,
  };
};

export const postConvert = (payload, requestKey) => {
  return {
    type: actionTypes.POST_CONVERT_REQUEST,
    payload,
    requestKey,
  };
};

export const odooCallRequest = ({ model, method, args = [], kwargs = {}, requestKey }) => ({
  type: actionTypes.ODOO_CALL_REQUEST,
  payload: { model, method, args, kwargs, requestKey },
})

export const clearLoginFields = () => ({ type: actionTypes.CLEAR_LOGIN_FIELDS, });

