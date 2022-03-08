<template>
  <div class="layout-portal-peminjaman">
    <!-- START: Navbar -->
    <b-navbar toggleable="lg" type="dark" variant="smil-primary">
      <b-navbar-brand to="/">
        <div class="logo-brand container">
          <img src="@/assets/images/brand-peminjaman.png" alt="" />
        </div>
      </b-navbar-brand>
      <div class="peminjam-info">
        <b-dropdown
          right
          size="sm"
          variant="smil-drop"
          toggle-class="text-decoration-none"
          no-caret
          no-flip
        >
          <template v-slot:button-content>
            <div class="identity">
              <div class="identity-info">
                <span class="identity-name">{{
                  peminjamData.peminjam.fullname
                }}</span>
                <span class="identity-job">{{
                  peminjamData.isMahasiswa ? "Mahasiswa" : "Staff Jurusan"
                }}</span>
              </div>
              <div class="identity-icon">
                <icon-component iconName="user" :size="30" colorIcon="#fff" />
              </div>
            </div>
          </template>
          <b-dropdown-item @click="openProfile = true">
            Profile
          </b-dropdown-item>
          <b-dropdown-item @click="openChangePassword = true">
            Ganti Password
          </b-dropdown-item>
          <b-dropdown-item @click="logoutPeminjam">
            Keluar
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-navbar>
    <!-- END: Navbar -->

    <!-- START: CONTENT VIEW -->
    <div class="content-view">
      <!-- START: CONTENT VIEW -->
      <div class="content-peminjaman">
        <router-view />
      </div>
      <!-- END: CONTENT VIEW -->
    </div>

    <!-- START: FOOTER -->
    <footer-layout />
    <!-- END: FOOTER -->
    <!-- END: CONTENT VIEW -->

    <!-- MODAL ALERT -->
    <b-modal
      ref="modal-alert"
      hide-header
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
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
    <!-- MODAL ALERT -->

    <!-- MODAL PROFILE -->
    <b-modal v-model="openProfile" hide-header hide-footer centered size="xl">
      <base-modal-profile :popupAlert="popupAlert" />
    </b-modal>
    <!-- MODAL PROFILE -->
    <!-- MODAL CHANGE PASSWORD -->
    <b-modal v-model="openChangePassword" hide-header hide-footer centered>
      <base-modal-change-password
        :popupAlert="popupAlert"
        :closePopup="closeChangePassword"
      />
    </b-modal>
    <!-- MODAL CHANGE PASSWORD -->
  </div>
</template>

<script>
// Components
import FooterLayout from "@/components/FooterLayout.vue";
import IconComponent from "@/components/IconComponent.vue";
import BaseModalAlert from "@/components/BaseModal/BaseModalAlert";
import BaseModalProfile from "@/components/BaseModal/BaseModalProfile";
import BaseModalChangePassword from "@/components/BaseModal/BaseModalChangePassword";

// API
import api from "@/api/peminjam_api";

// Vuex
import * as types from "@/store/types";

// Mixin
import AlertInfoMixin from "@/mixins/AlertInfoMixin";

export default {
  name: "layout-portal-peminjaman",
  components: {
    FooterLayout,
    IconComponent,
    BaseModalAlert,
    BaseModalProfile,
    BaseModalChangePassword,
  },
  mixins: [AlertInfoMixin],
  data() {
    return {
      openProfile: false,
      openChangePassword: false,
    };
  },
  async mounted() {
    if (this.userData.first_login && !this.userData.skipChangePassword) {
      this.$router.push({ name: "FirstLoginPeminjam" });
    }
    await this.getPeminjamImage();
  },
  methods: {
    // Authorize
    async logoutPeminjam() {
      this.popupAlert(true);
      try {
        const response = await api.logoutPeminjam();
        if (response.data.response.code == 200) {
          $cookies.remove("smilPeminjamAuth");
          $cookies.remove("smilAccessToken");
          this.popupAlert(false, true, response.data.response.message);
          setTimeout(() => {
            this.$router.push({ name: "LoginPeminjam" });
            this.$store.dispatch(types.UPDATE_PEMINJAM, null);
          }, 2000);
        }
      } catch (e) {
        this.popupAlert(false, false, e.response.data.message);
      }
    },
    async getPeminjamImage() {
      try {
        const response = await api.getUserImage(this.userData.id);
        if (response.status === 200) {
          let imageData = response.data.data.image_data;
          this.$store.dispatch(types.UPDATE_IMAGE_PEMINJAM, imageData);
        }
      } catch (error) {
        this.popupAlert(false, false, error.message);
      }
    },
    closeChangePassword() {
      this.openChangePassword = false;
    },
  },
  computed: {
    peminjamData() {
      let data = this.$store.state.peminjam;
      let rawPeminjamData = {
        nomor_induk: data.nomor_induk,
        fullname: data.is_mahasiswa
          ? data.mahasiswa_model.mahasiswa_fullname
          : data.staff_model.staff_fullname,
        email: data.is_mahasiswa
          ? data.mahasiswa_model.email
          : data.staff_model.email,
        phone_number: data.is_mahasiswa
          ? data.mahasiswa_model.phone_number
          : data.staff_model.phone_number,
        prodi_id: data.is_mahasiswa
          ? data.mahasiswa_model.prodi_id
          : data.staff_model.prodi_id,
        address: data.is_mahasiswa
          ? data.mahasiswa_model.address
          : data.staff_model.address,
      };
      return {
        peminjam: rawPeminjamData,
        isMahasiswa: data.is_mahasiswa,
      };
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
    userData() {
      return this.$store.state.peminjam ? this.$store.state.peminjam : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-portal-peminjaman {
  .bg-smil-primary {
    background-color: #101939 !important;
  }
  .peminjam-info {
    display: flex;
    margin-left: auto;
    .btn-return {
      margin-right: 60px;
    }
    .identity {
      display: flex;
      align-items: center;
      flex-flow: row;
      overflow-y: hidden;
      .identity-info {
        text-align: right;
        display: flex;
        flex-flow: column;
        margin-right: 10px;
        .identity-name {
          font-size: 14px;
          color: #fff;
          font-weight: bold;
        }
        .identity-job {
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }
  .content-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    .content-peminjaman {
      overflow-y: auto !important;
      margin: 80px 0 45px;
      padding: 0 20px;
      height: 90%;
    }

    .footer-layout {
      padding-left: 10px;
    }
  }
}

@media screen and (max-width: 992px) {
  .navbar {
    padding: 20px;
  }
  .logo-brand {
    display: none !important;
  }
  .content-view {
    .content-peminjaman {
      padding: 0 10px 0 10px !important;
    }
  }
}
</style>

<style lang="scss">
@import "@/assets/css/global.scss";
</style>
