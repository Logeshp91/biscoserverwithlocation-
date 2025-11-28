import actionTypes from "./actionTypes";

export const postmobileauth = (payload,results,) => ({
  type: actionTypes.POST_POSTMOBILEAUTH_REQUEST,
  payload,results
});

export const postauthendication = (payload,results,) => ({
  type: actionTypes.POST_POSTAUTHENDICATION_REQUEST,
  payload,results
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

export const odooCallRequest = ({ model, method, args = [], kwargs = {}, requestKey }) => ({
  type: actionTypes.ODOO_CALL_REQUEST,
  payload: { model, method, args, kwargs, requestKey },
})

export const clearLoginFields = () => ({ type: actionTypes.CLEAR_LOGIN_FIELDS, });

