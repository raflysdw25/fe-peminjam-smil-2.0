import axios from "axios";
import VueCookies from "vue-cookies";

const domain_api = process.env.VUE_APP_BASE_API_PEMINJAM_SMIL;
const domain_auth = process.env.VUE_APP_BASE_API_AUTH_SMIL;

let token = VueCookies.get("smilAccessToken");

export const peminjam_api = axios.create({
  baseURL: domain_api,
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  },
});

export const auth_peminjam_token = axios.create({
  baseURL: domain_auth,
  headers: {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  },
});

export const auth_peminjam = axios.create({
  baseURL: domain_auth,
  headers: {
    "Content-type": "application/json",
  },
});
