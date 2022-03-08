<template>
  <div class="login-peminjam">
    <section class="login-form-section">
      <div class="banner-jurusan">
        <img src="@/assets/images/Logo_PNJ.png" alt="" srcset="" />
        <p class="banner-title">
          Laboratorium Jurusan Teknik Informatika dan Komputer
        </p>
      </div>
      <h4>Silahkan Login untuk Memulai Sesi Anda</h4>
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
              <template #append v-if="form.isAppend">
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
        <div class="button-group" v-if="btnGroup">
          <button
            class="smil-btn smil-bg-primary"
            :disabled="!formFilled"
            @click="loginPeminjam"
          >
            Masuk
          </button>
        </div>
        <div class="button-group align-items-center mt-4">
          <span
            class="action-create-mahasiswa"
            @click="$router.push({ name: 'BuatAkunMahasiswa' })"
          >
            <icon-component iconName="users" :size="18" colorIcon="#101939" />
            Buat Akun Mahasiswa
          </span>
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
import IconComponent from "@/components/IconComponent";

// Mixins
import AlertInfoMixin from "@/mixins/AlertInfoMixin";
import FormInputMixins from "@/mixins/FormInputMixins";

export default {
  name: "login-peminjam",
  components: { BaseModalAlert, IconComponent },
  mixins: [AlertInfoMixin, FormInputMixins],
  data() {
    return {
      formGroupList: [
        {
          id: 1,
          label: "Email Peminjam",
          type: "email",
          model: "email",
          description: "",
          placeholder: "Email Peminjam",
          isRequired: true,
          isAppend: false,
        },
        {
          id: 2,
          label: "Password",
          type: "password",
          model: "password",
          description: "",
          placeholder: "Password",
          isRequired: true,
          isAppend: true,
        },
      ],
      btnGroup: [
        {
          id: 1,
          text: "Submit",
          type: "submit",
          class: "smil-bg-primary",
          size: "",
        },
      ],
      formInput: {
        email: "",
        password: "",
      },
      buttonActive: false,
    };
  },
  mounted() {
    // this.popupAlert(false, false, 'Alert Berhasil')
  },
  watch: {},
  computed: {
    formFilled() {
      return (
        this.formInput.email !== "" &&
        this.emailValidate(this.formInput.email) &&
        this.formInput.password !== ""
      );
    },
  },
  methods: {
    async loginPeminjam() {
      if (!this.formFilled) {
        return false;
      }
      // Request Login via API
      this.popupAlert(true);
      try {
        const response = await api.loginPeminjam(this.formInput);

        // Get Data Admin via API
        let peminjam = response.data;
        if (peminjam.response.code === 200 && peminjam.data !== null) {
          let peminjamData = {
            id: peminjam.data.id,
            staff_model: peminjam.data.staff_model,
            mahasiswa_model: peminjam.data.mahasiswa_model,
            nomor_induk: peminjam.data.is_mahasiswa
              ? peminjam.data.mahasiswa_model.nim
              : peminjam.data.staff_model.nip,
            jabatan_id: peminjam.data.jabatan_model.id,
            jabatan_model: peminjam.data.jabatan_model,
            active_period: peminjam.data.user_active_period,
            expire_period: peminjam.data.user_expire_period,
            first_login: peminjam.data.first_login,
            is_mahasiswa: peminjam.data.is_mahasiswa,
          };

          if (peminjamData.first_login) {
            peminjam.skipChangePassword = false;
          } else {
            peminjam.skipChangePassword = true;
          }

          // // Save User Data and Token into Local Storage or Cookies
          let cipherData = CryptoJs.AES.encrypt(
            JSON.stringify(peminjamData),
            process.env.VUE_APP_KEY
          ).toString();
          let e64 = CryptoJs.enc.Base64.parse(cipherData);
          let eHex = e64.toString(CryptoJs.enc.Hex);
          $cookies.set("smilPeminjamAuth", eHex, "12h");
          $cookies.set("smilAccessToken", peminjam.data.access_token, "12h");

          // Save data peminjam into Vuex
          this.popupAlert(false, true, peminjam.response.message);

          setTimeout(() => {
            this.$router.go({ name: "BerandaPeminjaman" });
          }, 1500);
        } else {
          this.popupAlert(false, false, peminjam.response.message);
        }
      } catch (e) {
        let errorMessage = e.response
          ? e.response.data.response.message
          : e.message;
        this.popupAlert(false, false, errorMessage);
        this.resetLoginAdmin();
      }
    },
    resetLoginAdmin() {
      // this.formInput.email = ''
      this.formInput.password = "";
    },
    changePasswordType(form) {
      form.type = form.type === "password" ? "text" : "password";
    },
  },
};
</script>

<style lang="scss" scoped>
.login-peminjam {
  display: flex;
  height: 100vh;
  // background-color: #c5c5c5;
  font-family: Arial, Helvetica, sans-serif;
  .login-form-section {
    width: 550px;
    margin: auto;
    display: flex;
    align-items: center;
    flex-flow: column;
    .banner-jurusan {
      width: 450px;
      display: flex;
      align-items: center;
      margin-bottom: 28px;
      img {
        width: 110px;
        height: 110px;
      }
      .banner-title {
        font-size: 18px;
        font-weight: bolder;
        text-transform: uppercase;
        font-style: italic;
        margin-bottom: 0;
        margin-left: 10px;
      }
    }

    .form-section {
      margin-top: 30px;
      width: 360px;
      .button-group {
        display: flex;
        button {
          width: 100%;
        }
      }
    }
  }
  .action-create-mahasiswa {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #101939;
    &:hover {
      cursor: pointer;
      font-weight: bold;
    }
  }
}
@media screen and (max-width: 992px) {
  .login-peminjam {
    overflow-x: hidden;
    align-items: center;
    .login-form-section {
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
.login-peminjam {
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
