// axiosConfig.js
import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 
    // process.env.NODE_ENV === 'production' ? String(process.env.NEXT_PUBLIC_BACKEND_URL_PROD) : 'http://192.168.1.92:3000/',
    process.env.NODE_ENV === 'production' ? String(process.env.NEXT_PUBLIC_BACKEND_URL_PROD) : String(process.env.NEXT_TEST_BACKEND_URL_PROD),
    // String(process.env.NEXT_PUBLIC_BACKEND_URL_PROD),
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true
});
export var SOCKET;
(function (SOCKET) {
    SOCKET["CONNECT"] = "connect";
})(SOCKET || (SOCKET = {}));
export var API;
(function (API) {
    // auth
    API["AUTH"] = "api/v1/auth";
    API["GOOGLE_LOGIN"] = "api/v1/auth/google/login";
    API["LOGOUT"] = "api/logout";
    // App
    API["DEPLOY_APP"] = "api/v1/apps";
    API["GET_APPS"] = "api/v1/apps";
    // items
    API["GET_HOSTS"] = "api/v1/hosts";
    // base
    API["GET_BASE_METADATA"] = "api/v1/base/metadata";
    API["GET_BASE_TOKEN"] = "api/v1/iam/login";
    API["ACQUIRE_BASE"] = "api/v1/session/acquire";
    API["RELINQUISH_ITEM"] = "api/v1/session/acquire";
    API["UPDATE_BASE"] = "api/v1/base/update";
    API["POST_BASE"] = "api/v1/base/create";
    API["JOIN_BASE"] = "api/v1/base/join";
    API["LEAVE_BASE"] = "api/v1/base/leave";
    API["INVITE_MEMBER"] = "api/v1/base/invite";
    API["ADD_MEMBERS"] = "api/v1/base/addMember";
    // event
    API["GET_EVENT_COUNTS"] = "api/v1/events/dates";
    API["GET_EVENT"] = "api/v1/event";
    API["DELETE_EVENT"] = "api/v1/events";
    API["GET_EVENT_METADATA"] = "api/v1/events/metadata";
    API["GET_EVENT_SERIES"] = "api/v1/event/series";
    API["POST_EVENT"] = "api/v1/events";
    API["UPDATE_EVENT"] = "api/v1/events";
    API["PATCH_SERIES"] = "api/v1/event/updateSeries";
    API["SEARCH_EVENTS"] = "api/v1/event/search";
    API["SAVE_EVENT"] = "api/v1/event/save";
    API["CHANGE_EVENT_STATUS"] = "api/v1/events";
    API["UPDATE_EVENT_CHILDREN_ORDER"] = "api/v1/event/children";
    // events
    API["GET_EVENTS"] = "api/v1/events";
    // location
    API["GET_LOCATIONS"] = "api/v1/locations";
    API["DELETE_LOCATIONS"] = "api/v1/locations";
    API["UPDATE_LOCATION"] = "api/v1/locations";
    API["POST_LOCATION"] = "api/v1/locations/create";
    API["SEARCH_LOCATIONS"] = "api/v1/locations/search";
    // media
    API["CONVERT_TO_WEBP"] = "api/v1/media/convertToWebp";
    API["GET_SECURE_MEDIA_URL"] = "/api/v1/media/secure_url";
    // people
    API["GET_IAM"] = "api/v1/iam";
    API["POST_IAM_INVITE"] = "api/v1/iam/invite";
    API["GET_PEOPLE"] = "api/v1/people";
    API["REMOVE_PEOPLE"] = "api/v1/people/remove";
    API["REGISTER_PROFILE"] = "api/v1/people/register";
    // profile
    API["SEARCH_PROFILES"] = "api/v1/profile/search";
    API["LOGIN"] = "api/login";
    API["VERIFY_SESSION_TOKEN"] = "/api/v1/session/me";
    // certificates
    API["GET_CERTIFICATES"] = "api/v1/certificate";
    API["POST_CERTIFICATE"] = "api/v1/certificate/create";
    // host
    API["PATCH_HOST"] = "api/v1/hosts";
    // OTHER
    API["GET_NOTIFICATIONS"] = "api/v1/notifications";
})(API || (API = {}));
export default axiosInstance;
