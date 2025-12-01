import axios from "axios";
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';

let dynamicBaseUrl = null; // Base URL
let sessionId = null;       // Session stored in memory

// Set Base URL dynamically
export const setBaseUrl = (url) => {
  dynamicBaseUrl = url;
};


export const endPoint = {
  postmobileauth: "/checkmobile",
  postsendotp:"/mobile/send_otp",
  postverifyotp:"/mobile/verify_otp",
  postauthendication: "/web/session/authenticate",
  postAccessRead: "/api/visit/verified",
  postcreatevisit: "/web/dataset/call_kw",
  postconvert: "/api/visit/convert",
  postOutstanding: '/web/dataset/call_kw',
  postCustomerList: '/web/dataset/call_kw',
};

export const ApiMethod = {
  POST: async (url, data) => {
    const server = dynamicBaseUrl || data?.serverUrl;
    if (!server) throw new Error("Base URL not set!");

    if (!sessionId) {
      const storedSession = await AsyncStorage.getItem('session_id');
      if (storedSession) sessionId = storedSession;
    }

    try {
      const response = await axios.post(server + url, data, {
        headers: {
          "Content-Type": "application/json",
          ...(sessionId && { Cookie: `session_id=${sessionId}` }),
        },
        withCredentials: true,
      });

      const resData = response.data;
      if (resData?.error?.message === "Odoo Server Error") {
        throw {
          type: "ODOO_ERROR",
          message: resData.error.message,
          detail: resData.error.data,
        };
      }
      if (url === endPoint.postauthendication) {
        const cookies = await CookieManager.get(dynamicBaseUrl);
        if (cookies.session_id) {
          sessionId = cookies.session_id.value;
          await AsyncStorage.setItem('session_id', sessionId);
        }
      }

      return { data: resData, status: response.status };

    } catch (error) {
      if (error.type === "ODOO_ERROR") throw error;
      throw error;
    }
  }
};

axios.interceptors.request.use(
  async (config) => {
    if (!config.headers.Cookie) {
      const storedSession = await AsyncStorage.getItem('session_id');
      if (storedSession) {
        config.headers.Cookie = `session_id=${storedSession}`;
        sessionId = storedSession;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
