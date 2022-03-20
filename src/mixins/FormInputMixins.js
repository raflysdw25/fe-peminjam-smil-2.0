let moment = require("moment");
export default {
  data() {
    return {
      inputType: [
        "number",
        "text",
        "password",
        "email",
        "tel",
        "text-barcode",
        "barcode-input",
        "nomor_induk",
      ],
      isCreate: false,
      loadingForm: false,
    };
  },
  methods: {
    formInputType(type) {
      if (this.inputType.includes(type)) {
        return "input";
      } else {
        return type;
      }
    },

    formConstraint(e, type) {
      if (type === "tel") {
        let char = String.fromCharCode(e.keyCode);

        if (
          /^[0-9]+$/.test(char) ||
          e.keyCode == 8 ||
          e.keyCode == 37 ||
          e.keyCode == 39
        )
          return true;
        // Match with regex
        else e.preventDefault();
      } else if (type === "barcode-input") {
        if (this.environment === "development") {
          return true;
        }
        let timer = 0;
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (e.target.value.length <= 1) {
            e.target.value = "";
          }
        }, 66);
      } else {
        return true;
      }
    },
    emailValidate(email) {
      if (email === "") {
        return null;
      } else {
        const EMAIL_REGEX = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (EMAIL_REGEX.test(email)) {
          return true;
        }
        return false;
      }
    },
    formPasteConstraint(e, type) {
      if (type === "barcode-input") {
        if (this.environment === "development") {
          return true;
        }
        e.preventDefault();
      } else {
        return true;
      }
    },
    formatDate(date, format = "YYYY-MM-DD") {
      return moment(date).format(format);
    },
    notBeforeToday(date) {
      return date < new Date().setHours(0, 0, 0, 0);
    },
    disableBeforeTodayAndWeekends(date) {
      let today = new Date(date);
      let dayIndex = today.getDay();
      let weekend = [0, 6];
      return (
        date < new Date().setHours(0, 0, 0, 0) ||
        (date > new Date().setHours(0, 0, 0, 0) && weekend.includes(dayIndex))
      );
    },
    dateRange(start, end) {
      if (end !== null) {
        let startDate = moment(start);
        let endDate = moment(end);
        return endDate.diff(startDate, "days");
      } else {
        return null;
      }
    },
    getErrorMessage(e, typeDisplayError = "modal") {
      // typeDisplayError : alert() -> alert, showAlert() -> modal
      if (e.response) {
        let err = e.response.data;
        if (err.status === 400) {
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
          } else if (typeDisplayError == "modal") {
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
          return err.message;
        }
      } else {
        return e;
      }
    },
  },
  computed: {
    environment() {
      return process.env.VUE_APP_DEVELOPMENT === "true"
        ? "development"
        : "production";
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
