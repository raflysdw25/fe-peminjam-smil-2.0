import Vue from "vue";
import VueRouter from "vue-router";
import * as types from "@/store/types";
import { store } from "@/store/store";
import CryptoJS from "crypto-js";

// Layout
import LayoutPortalPeminjaman from "@/views/layout/LayoutPortalPeminjaman.vue";

// Pages
// PEMINJAMAN
import ListPeminjamanAlatPeminjam from "@/views/pages/peminjaman/ListPeminjamanAlatPeminjam";
import ActionPeminjaman from "@/views/pages/peminjaman/ActionPeminjaman.vue";

// BOOKING PENGEMBALIAN
import ListBookingPengembalian from "@/views/pages/peminjaman/ListBookingPengembalian";

// AUTH
import LoginPeminjam from "@/views/pages/LoginPeminjam.vue";
import FirstLoginPeminjam from "@/views/pages/FirstLoginPeminjam.vue";

// PEMINJAM
import BerandaPeminjaman from "@/views/pages/peminjaman/BerandaPeminjaman.vue";
import BuatAkunMahasiswa from "@/views/pages/peminjaman/BuatAkunMahasiswa.vue";
import LaporKerusakanAlat from "@/views/pages/peminjaman/LaporKerusakanAlat.vue";
import ActionPengembalian from "@/views/pages/peminjaman/ActionPengembalian.vue";

Vue.use(VueRouter);

const routes = [
  // App Route

  // Portal Peminjaman
  {
    path: "/",
    component: LayoutPortalPeminjaman,
    children: [
      // Beranda
      {
        path: "",
        name: "BerandaPeminjaman",
        component: BerandaPeminjaman,
      },
      // Peminjaman Alat Peminjam
      {
        path: "/list-peminjaman",
        name: "ListPeminjamanAlatPeminjam",
        component: ListPeminjamanAlatPeminjam,
      },
      {
        path: "/peminjaman",
        name: "ActionPeminjaman",
        component: ActionPeminjaman,
      },
      // Booking Pengembalian Alat
      {
        path: "/booking-pengembalian",
        name: "ListBookingPengembalian",
        component: ListBookingPengembalian,
      },
      // Form Peminjaman & Pengembalian
      {
        path: "/pengembalian",
        name: "ActionPengembalian",
        component: ActionPengembalian,
      },
      // Form Laporan Kerusakan
      {
        path: "/lapor-kerusakan",
        name: "LaporKerusakanAlat",
        component: LaporKerusakanAlat,
      },
    ],
  },

  // Login Peminjam
  {
    path: "/login",
    name: "LoginPeminjam",
    component: LoginPeminjam,
  },
  // Form Buat Akun Mahasiswa
  {
    path: "/buat-akun",
    name: "BuatAkunMahasiswa",
    component: BuatAkunMahasiswa,
  },
  // FirstLoginPeminjam
  {
    path: "/first-login",
    name: "FirstLoginPeminjam",
    component: FirstLoginPeminjam,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  let dataUser = $cookies.get("smilPeminjamAuth");
  let accessToken = $cookies.get("smilAccessTokenPeminjam");
  if (to.name == "LoginPeminjam" || to.name == "BuatAkunMahasiswa") {
    if (dataUser && accessToken) {
      next({ name: "BerandaPeminjaman" });
    } else {
      next();
    }
  } else {
    if (dataUser && accessToken) {
      let reb64 = CryptoJS.enc.Hex.parse(dataUser);
      let bytes = reb64.toString(CryptoJS.enc.Base64);
      let decrypt = CryptoJS.AES.decrypt(bytes, process.env.VUE_APP_KEY);
      let decryptedData = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
      if (Object.keys(decryptedData).length !== 0) {
        let peminjamData = {
          id: decryptedData.id,
          nomor_induk: decryptedData.is_mahasiswa
            ? decryptedData.mahasiswa_model.nim
            : decryptedData.staff_model.nip,
          staff_model: decryptedData.staff_model,
          mahasiswa_model: decryptedData.mahasiswa_model,
          jabatan_id: decryptedData.jabatan_model.id,
          jabatan_model: decryptedData.jabatan_model,
          active_period: decryptedData.active_period,
          expire_period: decryptedData.expire_period,
          first_login: decryptedData.first_login,
          skipChangePassword: decryptedData.first_login ? false : true,
          is_mahasiswa: decryptedData.is_mahasiswa,
        };
        $cookies.set("smilAccessTokenPeminjam", accessToken, "12h");
        store.dispatch(types.UPDATE_PEMINJAM, peminjamData);

        next();
      } else {
        $cookies.remove("smilAccessTokenPeminjam");
        next({ name: "LoginPeminjam" });
      }
    } else {
      next({ name: "LoginPeminjam" });
    }
  }
});

export default router;
