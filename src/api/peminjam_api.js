import { peminjam_api, auth_peminjam, auth_peminjam_token } from "@/api/config";

export default {
  // User Auth
  loginPeminjam(loginRequest) {
    return auth_peminjam.post(`login-peminjam`, loginRequest);
  },
  logoutPeminjam() {
    return auth_peminjam_token.post(`logout`);
  },
  changePassword(userId, passwordPayload) {
    return auth_peminjam_token.post(
      `change-password/${userId}`,
      passwordPayload
    );
  },

  updateProfileUser(id, payload) {
    return peminjam_api.put(`update-profile/${id}`, payload);
  },

  //Global User
  getUserImage(userId) {
    return peminjam_api.get(`peminjam/get-image/${userId}`);
  },
  createData(type, createPayload) {
    // laporan-kerusakan, mahasiswa, peminjaman, submit-booking-pengembalian
    let endpoint =
      type !== "booking-pengembalian" ? `add-${type}` : `submit-${type}`;
    return peminjam_api.post(`${endpoint}`, createPayload);
  },
  getFilterData(type, page, filterPayload) {
    return peminjam_api.post(`${type}?page=${page}`, filterPayload);
  },
  getPlainData(type) {
    return peminjam_api.get(`get-${type}`);
  },

  cekData(type, cekPayload) {
    // cek-alat, cek-pelapor, cek-peminjaman
    return peminjam_api.post(`cek-${type}`, cekPayload);
  },

  // Custom
  getDataPeminjam(payload) {
    return peminjam_api.post(`get-peminjam`, payload);
  },

  getNeedReturnedPeminjam(payload) {
    return peminjam_api.post(`get-need-returned`, payload);
  },

  returnPeminjaman(peminjamanId) {
    return peminjam_api.put(`return-peminjaman/${peminjamanId}`);
  },
};
