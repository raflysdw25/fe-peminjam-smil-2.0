<template>
  <div class="first-login-peminjam">
    <section class="first-login-form-section">
      <h4 class="font-weight-bold text-center">
        Selamat,
        {{ userData.staff_model ? userData.staff_model.staff_fullname : "-" }}
      </h4>
      <h6 class="text-center">
        Password pada akun anda masih password default, Silahkan atur password
        terlebih dahulu sebelum melanjutkan
      </h6>
      <div class="form-section">
        <div
          v-for="(form, indexInput) in formGroupList"
          :key="`form-input-${indexInput}-${form.id}`"
        >
          <b-form-group :label-for="`input-${indexInput + 1}`">
            <template slot="label">
              {{ form.label }}
              <span
                v-if="form.isRequired"
                style="color: #dc3545; font-size: 14px"
              >
                *
              </span>
            </template>
            <b-input-group>
              <b-form-input
                :id="`input-${indexInput + 1}`"
                :type="form.type"
                class="form-control"
                v-model="formInput[form.model]"
                :placeholder="form.placeholder"
                :required="form.isRequired"
                @keypress.enter="loginPeminjam"
                :state="
                  form.type === 'email'
                    ? emailValidate(formInput[form.model])
                    : null
                "
              />
              <template #append>
                <b-input-group-text
                  class="password-visible"
                  @click="changePasswordType(form)"
                >
                  <b-icon
                    :icon="form.type === 'password' ? 'eye-slash' : 'eye'"
                    class="trigger-input-password"
                  ></b-icon>
                </b-input-group-text>
              </template>
            </b-input-group>
          </b-form-group>
        </div>
        <div class="button-group">
          <button
            class="smil-btn smil-bg-primary"
            :disabled="!formFilled"
            @click="changePassword"
          >
            Ganti Password
          </button>
          <p @click="skip">
            Lewati Langkah Ini
          </p>
        </div>
      </div>
    </section>

    <b-modal
      ref="modal-alert"
      no-close-on-backdrop
      no-close-on-esc
      hide-header
      hide-footer
      centered
    >
      <base-modal-alert
        :isProcess="alertInfo.isProcess"
        :isSuccess="alertInfo.isSuccess"
        :message="alertInfo.message"
        :notes="alertInfo.notes"
        :closeAlert="closeAlert"
      />
    </b-modal>
  </div>
</template>

<script>
// API
import api from "@/api/peminjam_api";
import CryptoJs from "crypto-js";
// Componenets
import BaseModalAlert from "@/components/BaseModal/BaseModalAlert";

// Mixins
import AlertInfoMixin from "@/mixins/AlertInfoMixin";
// import ErrorHandlerMixins from '@/mixins/ErrorHandlerMixins'

export default {
  name: "first-login-peminjam",
  components: { BaseModalAlert },
  mixins: [AlertInfoMixin],
  data() {
    return {
      formGroupList: [
        {
          id: 1,
          label: "Password Baru",
          type: "password",
          model: "password",
          description: "",
          placeholder: "Password Baru",
          isRequired: true,
        },
        {
          id: 2,
          label: "Konfirmasi Password Baru",
          type: "password",
          model: "password_confirmation",
          description: "",
          placeholder: "Konfirmasi Password Baru",
          isRequired: true,
        },
      ],

      formInput: {
        password: "",
        password_confirmation: "",
      },
      buttonActive: false,
    };
  },
  mounted() {},
  watch: {},
  computed: {
    formFilled() {
      return (
        this.formInput.password !== "" &&
        this.formInput.password_confirmation !== "" &&
        this.formInput.password === this.formInput.password_confirmation
      );
    },
    userData() {
      return this.$store.state.peminjam ? this.$store.state.peminjam : null;
    },
  },
  methods: {
    async changePassword() {
      // Request Login via API
      this.popupAlert(true);
      try {
        const response = await api.changePassword(
          this.userData.id,
          this.formInput
        );

        let peminjam = response.data;
        if (peminjam.response.code === 200) {
          this.action();
          this.popupAlert(false, true, peminjam.response.message);
          setTimeout(() => {
            this.$router.push({ name: "BerandaPeminjaman" });
          }, 2000);
        }
      } catch (e) {
        let errorMessage = e.response
          ? e.response.data.response.message
          : e.message;
        this.popupAlert(false, false, errorMessage);
        this.resetLoginAdmin();
      }
    },
    action() {
      this.userData.first_login = false;
      this.userData.skipChangePassword = true;
      let cipherData = CryptoJs.AES.encrypt(
        JSON.stringify(this.userData),
        process.env.VUE_APP_KEY
      ).toString();
      let e64 = CryptoJs.enc.Base64.parse(cipherData);
      let eHex = e64.toString(CryptoJs.enc.Hex);
      $cookies.set("smilPeminjamAuth", eHex, "12h");
    },
    skip() {
      this.action();
      this.$router.push({ name: "BerandaPeminjaman" });
    },
    resetLoginAdmin() {
      this.formInput.password = "";
      this.formInput.password_confirmation = "";
    },
    changePasswordType(form) {
      form.type = form.type === "password" ? "text" : "password";
    },
  },
};
</script>

<style lang="scss" scoped>
.first-login-peminjam {
  display: flex;
  height: 100vh;
  // background-color: #c5c5c5;
  font-family: Arial, Helvetica, sans-serif;
  .first-login-form-section {
    width: 550px;
    margin: auto;
    display: flex;
    align-items: center;
    flex-flow: column;

    .form-section {
      margin-top: 30px;
      width: 360px;
      .button-group {
        display: flex;
        flex-flow: column;
        button {
          width: 100%;
          margin-bottom: 10px;
        }
        p {
          text-align: center;
          color: #c5c5c5;
          &:hover {
            color: #101939;
            cursor: pointer;
            font-weight: bold;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .first-login-peminjam {
    overflow-x: hidden;
    align-items: center;
    .first-login-form-section {
      .banner-jurusan {
        width: 350px;

        .banner-title {
          font-size: 14px;
        }
        img {
          width: 70px;
          height: 70px;
        }
      }
      h4 {
        font-size: 18px;
      }
    }
  }
}
</style>

<style lang="scss">
.first-login-peminjam {
  @import "@/assets/css/global.scss";
  .input-group-text {
    &.password-visible {
      background-color: #fff;
      border-left-color: #fff;
      cursor: pointer;
    }
  }
}
</style>
