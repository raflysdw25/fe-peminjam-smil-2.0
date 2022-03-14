// Vuex
import * as types from "@/store/types.js";
export default {
  data() {
    return {};
  },
  methods: {
    getErrorMessage(e, typeDisplayError = "modal") {
      // typeDisplayError : alert() -> alert, showAlert() -> modal

      if (e.response) {
        let err = e.response.data;
        if (e.response.status === 401) {
          $cookies.remove("smilPeminjamAuth");
          $cookies.remove("smilAccessTokenPeminjam");

          alert("User tidak memiliki akses");
          setTimeout(() => {
            this.$router.push({ name: "LoginPeminjam" });
            this.$store.dispatch(types.UPDATE_PEMINJAM, null);
          }, 2000);
        } else if (err && err.response.code === 400) {
          let mKey = Object.keys(err.response.message);
          let message = err.response.message;
          if (typeDisplayError == "alert") {
            let output = "";
            mKey.forEach((key, idxKey) => {
              if (idxKey !== mKey.length - 1) {
                output += `${message[key]}, `;
              } else {
                output += `${message[key]}`;
              }
            });
            return output;
          } else {
            let output = [];
            mKey.forEach((key, idxKey) => {
              let modalNotes = {
                title: key,
                message: message[key],
              };
              output.push(modalNotes);
            });
            return output;
          }
        } else {
          return err.response.data.message;
        }
      } else {
        return e.message;
      }
    },
  },
  computed: {
    environment() {
      return process.env.NODE_ENV;
    },
    peminjamData() {
      return this.$store.state.peminjam ? this.$store.state.peminjam : null;
    },
    isKaLab() {
      return this.peminjamData.jabatan_id == 2;
    },
    isSuperAdmin() {
      return this.peminjamData.jabatan_id == 1;
    },
    isMobile() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
      ];

      return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
      });
    },
  },
};
