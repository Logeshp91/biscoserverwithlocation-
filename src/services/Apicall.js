// // Apicall.js
// import axios from 'axios';
// import { postAccessRead } from '../redux/action';
// import CookieManager from '@react-native-cookies/cookies';


// export const baseUrl = "https://testserver.biztechnovations.com";
// // export const baseUrl = "https://devserver.biztechnovations.com";
// export const endPoint = {
//     postauthendication: '/web/session/authenticate',
//     postcreatevisit: '/web/dataset/call_kw',
//     postAccessRead:'/api/visit/verified',
//     postconvert:"/api/visit/convert"
// };
// const headers = {
//     'Content-Type': 'application/json',
//     'Accept': '*/*'
// };

// export const ApiMethod = {
//     POST: async (url, data) => {
//         const cookies = await CookieManager.get(baseUrl);

//         return axios.post(baseUrl + url, data, {
//             headers: {
//                 ...headers,
//                 Cookie: cookies?.session_id ? `session_id=${cookies.session_id}` : ''
//             },
//             withCredentials: true
//         });
//     }
// };
import axios from "axios";

let dynamicBaseUrl = null;
let sessionId = null;  

export const setBaseUrl = (url) => {
  dynamicBaseUrl = url;
};

export const endPoint = {
  postmobileauth: "/checkmobile",
  postauthendication: "/web/session/authenticate",
  postAccessRead: "/api/visit/verified",
  postcreatevisit: "/web/dataset/call_kw",
};

export const ApiMethod = {
  POST: async (url, data) => {
    const server = dynamicBaseUrl || data?.serverUrl;
    if (!server) throw new Error("Base URL not set!");

    const response = await axios.post(server + url, data, {
      headers: {
        "Content-Type": "application/json",
        ...(sessionId && { Cookie: `session_id=${sessionId}` }),  
      },
      withCredentials: true,
    });

      if (url === endPoint.postauthendication && response.headers['set-cookie']) {
      const cookie = response.headers['set-cookie'][0];
      const match = cookie.match(/session_id=([^;]+)/);
      if (match) {
        sessionId = match[1];
        console.log("🔐 Odoo Session saved from headers:", sessionId);
      }
    }

    return response;
  },
};