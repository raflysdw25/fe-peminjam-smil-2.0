<template>
  <div class="base-modal-profile">
    <h3 class="font-weight-bold">
      Profile User
    </h3>
    <div class="row profile-content">
      <div
        class="d-flex align-items-center flex-column mx-auto"
        v-if="loadingPage"
      >
        <b-spinner
          variant="secondary"
          style="width: 150px; height: 150px; margin-bottom: 20px"
        ></b-spinner>
        <p style="font-size: 14px; color: #696969">
          Sedang Memuat Data...
        </p>
      </div>
      <template v-else>
        <div class="col-lg-5" v-if="Object.keys(dataPeminjam).length !== 0">
          <div class="user-image">
            <template v-if="!isUpdateProfile">
              <img
                v-if="dataPeminjam.image_data === null"
                src="@/assets/images/default_user.png"
                class="img-fluid user-profile-image"
                :alt="
                  dataPeminjam.is_mahasiswa
                    ? dataPeminjam.mahasiswa_model.mahasiswa_fullname
                    : dataPeminjam.staff_model.staff_fullname
                "
              />
              <img
                v-else
                :src="dataPeminjam.image_data"
                class="img-fluid rounded-circle user-profile-image"
                :alt="
                  dataPeminjam.is_mahasiswa
                    ? dataPeminjam.mahasiswa_model.mahasiswa_fullname
                    : dataPeminjam.staff_model.staff_fullname
                "
              />
            </template>
            <template v-else>
              <img
                v-if="payloadUpdateUser.image_data === null"
                src="@/assets/images/default_user.png"
                class="img-fluid user-profile-image"
                :alt="
                  dataPeminjam.is_mahasiswa
                    ? dataPeminjam.mahasiswa_model.mahasiswa_fullname
                    : dataPeminjam.staff_model.staff_fullname
                "
              />
              <img
                v-else
                :src="payloadUpdateUser.image_data"
                class="img-fluid rounded-circle user-profile-image"
                :alt="
                  dataPeminjam.is_mahasiswa
                    ? dataPeminjam.mahasiswa_model.mahasiswa_fullname
                    : dataPeminjam.staff_model.staff_fullname
                "
              />
              <div class="d-flex" v-if="isUpdateProfile">
                <button
                  class="smil-btn smil-btn-large smil-bg-primary"
                  @click="browseImage"
                >
                  Pilih Foto
                </button>
                <button
                  class="smil-btn smil-btn-large smil-bg-secondary-danger ml-2"
                  @click="deleteImage"
                  v-if="payloadUpdateUser.image_data !== null"
                >
                  Hapus Foto
                </button>
                <input
                  type="file"
                  id="file_image"
                  ref="file_image"
                  accept=".png,.jpg,.jpeg"
                  class="d-none"
                  @change="handleBrowseUpload"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="col-lg-7" v-if="Object.keys(dataPeminjam).length !== 0">
          <div class="profile-group">
            <h5 class="profile-head">
              Nomor Induk
              {{
                dataPeminjam.is_mahasiswa ? "Mahasiswa (NIM)" : "Pegawai (NIP)"
              }}
            </h5>
            <p class="profile-value" v-if="!isUpdateProfile">
              {{
                dataPeminjam.is_mahasiswa
                  ? dataPeminjam.mahasiswa_model.nim
                  : dataPeminjam.staff_model.nip
              }}
            </p>
            <input
              type="text"
              class="form-control"
              disabled
              :value="
                dataPeminjam.is_mahasiswa
                  ? dataPeminjam.mahasiswa_model.nim
                  : dataPeminjam.staff_model.nip
              "
              v-else
            />
          </div>
          <div class="profile-group">
            <h5 class="profile-head">
              Nama
            </h5>
            <p class="profile-value" v-if="!isUpdateProfile">
              {{
                dataPeminjam.is_mahasiswa
                  ? dataPeminjam.mahasiswa_model.mahasiswa_fullname
                  : dataPeminjam.staff_model.staff_fullname
              }}
            </p>
            <input
              type="text"
              v-model="payloadUpdateUser.fullname"
              class="form-control"
              v-else
            />
          </div>
          <div class="profile-group">
            <h5 class="profile-head">
              Email
            </h5>
            <p class="profile-value" v-if="!isUpdateProfile">
              {{
                dataPeminjam.is_mahasiswa
                  ? dataPeminjam.mahasiswa_model.email
                  : dataPeminjam.staff_model.email
              }}
            </p>
            <input
              type="email"
              class="form-control"
              v-model="payloadUpdateUser.email"
              v-else
            />
          </div>
          <div class="profile-group">
            <h5 class="profile-head">
              Program Studi
            </h5>
            <p class="profile-value" v-if="!isUpdateProfile">
              {{
                getProdiName(
                  dataPeminjam.is_mahasiswa
                    ? dataPeminjam.mahasiswa_model.prodi_id
                    : dataPeminjam.staff_model.prodi_id
                )
              }}
            </p>
            <select
              v-model="payloadUpdateUser.prodi_id"
              class="custom-select"
              v-else
            >
              <option :value="null">Pilih Program Studi</option>
              <option
                :value="prodi.id"
                v-for="(prodi, idxProdi) in listProdi"
                :key="`option-prodi-${idxProdi}-${prodi.id}`"
              >
                {{ prodi.name }}
              </option>
            </select>
          </div>
          <div class="profile-group">
            <h5 class="profile-head">
              Alamat Tempat Tinggal
            </h5>
            <p class="profile-value" v-if="!isUpdateProfile">
              {{ getUserAddress }}
            </p>
            <textarea
              v-else
              v-model="payloadUpdateUser.address"
              class="form-control"
              cols="30"
              rows="10"
              placeholder="Alamat tempat tinggal"
            >
            </textarea>
          </div>
          <div class="profile-group" v-if="!isUpdateProfile">
            <h5 class="profile-head">
              Status
            </h5>
            <p class="profile-value">
              <template v-if="dataPeminjam.is_mahasiswa">
                Mahasiswa
              </template>
              <template v-else>
                {{
                  `Staff Jurusan - ${dataPeminjam.jabatan_model.jabatan_name}`
                }}
              </template>
            </p>
          </div>
          <button
            class="smil-btn smil-btn-large smil-bg-primary w-100"
            v-if="!isUpdateProfile"
            @click="updateProfile"
          >
            Update Profile
          </button>
          <div class="button-group" v-else>
            <button
              class="smil-btn smil-btn-large smil-bg-secondary-danger mr-3"
              @click="cancelUpdate"
            >
              Cancel
            </button>
            <button
              class="smil-btn smil-btn-large smil-bg-primary"
              @click="submitUpdateProfile"
            >
              <b-spinner
                style="width: 16px; height: 16px;"
                v-if="loadingSubmit"
              ></b-spinner>
              <template v-else>
                Save
              </template>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import api from "@/api/peminjam_api";
import CryptoJs from "crypto-js";

import * as types from "@/store/types";
import ErrorHandlerMixins from "@/mixins/ErrorHandlerMixins";
export default {
  name: "base-modal-profile",
  mixins: [ErrorHandlerMixins],
  props: {
    popupAlert: Function,
  },
  data() {
    return {
      loadingPage: false,
      loadingSubmit: false,
      isUpdateProfile: false,
      payloadUpdateUser: {
        email: "",
        fullname: "",
        phone_number: "",
        address: "",
        prodi_id: null,
        image_data: null,
      },
      listProdi: [],
      dataPeminjam: {},
    };
  },
  async mounted() {
    this.loadingPage = true;
    await this.getListProdi();
    await this.setDataPeminjam();
    this.loadingPage = false;
  },
  computed: {
    getUserAddress() {
      let userKey = this.dataPeminjam.is_mahasiswa
        ? "mahasiswa_model"
        : "staff_model";
      return this.dataPeminjam[userKey].address === null ||
        this.dataPeminjam[userKey].address === ""
        ? "-"
        : this.dataPeminjam[userKey].address;
    },
  },
  methods: {
    // API
    async getListProdi() {
      try {
        const response = await api.getPlainData("prodi");
        let prodi = response.data.data;
        prodi.forEach((pd) => {
          let option = {
            id: pd.id,
            name: pd.prodi_name,
          };
          this.listProdi.push(option);
        });
      } catch (e) {
        let message = this.getErrorMessage(e);
        if (typeof message == "object" && message.length > 0) {
          setTimeout(() => {
            this.popupAlert(false, false, "Terjadi Kesalahan", message);
          }, 500);
        } else {
          this.popupAlert(false, false, message);
        }
      }
    },
    async updateProfile() {
      this.isUpdateProfile = true;
      let dataUser = this.dataPeminjam.is_mahasiswa
        ? this.dataPeminjam.mahasiswa_model
        : this.dataPeminjam.staff_model;
      this.payloadUpdateUser = {
        email: dataUser.email,
        fullname: this.dataPeminjam.is_mahasiswa
          ? dataUser.mahasiswa_fullname
          : dataUser.staff_fullname,
        phone_number: dataUser.phone_number,
        address: dataUser.address,
        prodi_id: dataUser.prodi_id,
        image_data: this.dataPeminjam.image_data,
      };
    },
    cancelUpdate() {
      this.isUpdateProfile = false;
      this.payloadUpdateUser.image_data = this.dataPeminjam.image_data;
    },
    async submitUpdateProfile() {
      this.loadingSubmit = true;
      try {
        const response = await api.updateProfileUser(
          this.dataPeminjam.id,
          this.payloadUpdateUser
        );
        if (response.status === 200) {
          this.popupAlert(false, true, "Berhasil memperbarui data user");

          let rawData = response.data.data;
          // console.log("Response Raw Data: ", rawData);
          let peminjamData = {
            id: rawData.id,
            staff_model: rawData.staff_user,
            mahasiswa_model: rawData.mahasiswa_user,
            nomor_induk:
              rawData.nip !== null && rawData.nip !== ""
                ? rawData.staff_user.nip
                : rawData.mahasiswa_user.nim,
            jabatan_id:
              rawData.jabatan_user !== null ? rawData.jabatan_user.id : null,
            jabatan_model: rawData.jabatan_user,
            active_period: rawData.user_active_period,
            expire_period: rawData.user_expire_period,
            first_login: rawData.first_login,
            is_mahasiswa: rawData.nip == null || rawData.nip == "",
          };
          // console.log("Peminjam Data: ", peminjamData);

          if (peminjamData.first_login) {
            peminjamData.skipChangePassword = false;
          } else {
            peminjamData.skipChangePassword = true;
          }

          this.$store.dispatch(types.UPDATE_PEMINJAM, peminjamData);
          this.$store.dispatch(types.UPDATE_IMAGE_PEMINJAM, rawData.image_data);
          // // Save User Data and Token into Local Storage or Cookies
          let cipherData = CryptoJs.AES.encrypt(
            JSON.stringify(peminjamData),
            process.env.VUE_APP_KEY
          ).toString();
          let e64 = CryptoJs.enc.Base64.parse(cipherData);
          let eHex = e64.toString(CryptoJs.enc.Hex);
          $cookies.set("smilPeminjamAuth", eHex, "12h");
          this.setDataPeminjam();
          this.loadingSubmit = false;
          this.isUpdateProfile = false;
        }
      } catch (error) {
        this.loadingSubmit = false;
        let message = this.getErrorMessage(error);
        console.error(message);
        if (typeof message == "object" && message.length > 0) {
          setTimeout(() => {
            this.popupAlert(false, false, "Terjadi Kesalahan", message);
          }, 500);
        } else {
          this.popupAlert(false, false, message);
        }
      }
    },
    // Change Value
    getProdiName(prodiId) {
      if (prodiId !== null) {
        let getProdi = this.listProdi.find((prodi) => prodi.id === prodiId);

        return getProdi ? getProdi.name : "-";
      } else {
        return "-";
      }
    },
    setDataPeminjam() {
      let imagePeminjam = this.$store.state.imagePeminjam
        ? this.$store.state.imagePeminjam
        : null;
      let peminjam = this.$store.state.peminjam
        ? this.$store.state.peminjam
        : null;

      this.dataPeminjam = { image_data: imagePeminjam, ...peminjam };
    },
    // Handle Uploda Image Profile
    browseImage() {
      this.$refs["file_image"].click();
    },
    deleteImage() {
      this.payloadUpdateUser.image_data = null;
    },
    handleBrowseUpload() {
      let uploadedFiles = this.$refs.file_image.files;

      this.imageUpload(uploadedFiles);
    },
    imageUpload(objectUpload) {
      let files = objectUpload;
      let notes = [];
      let countError = 0;

      let fileSize = this.bytesToSize(files[0].size);
      if (fileSize.sizes === "MB" && fileSize.total > 1) {
        let message = {
          title: files[0].name,
          message: "Ukuran gambar lebih dari 1MB",
        };
        notes.push(message);
        countError += 1;
      } else {
        this.createImage(files[0]);
      }

      if (notes.length === files.length) {
        this.popupAlert(false, false, "Gambar gagal diunggah", notes);
      } else {
        if (countError > 0) {
          this.popupAlert(false, true, "Gambar berhasil diunggah", notes);
        } else {
          this.popupAlert(false, true, "Gambar berhasil diunggah");
        }
      }
    },
    // Image data manipulation
    bytesToSize(bytes) {
      let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return {
        total: Math.round(bytes / Math.pow(1024, i), 2),
        sizes: sizes[i],
      };
    },
    createImage(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.payloadUpdateUser.image_data = e.target.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>
<style lang="scss" scoped>
.base-modal-profile {
  padding: 16px;
  .profile-content {
    margin-top: 30px;
    .user-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      .user-profile-image {
        max-width: 250px;
        margin-bottom: 30px;
      }
    }
    .profile-group {
      margin-bottom: 25px;
      .profile-head {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .profile-value {
        margin-bottom: 0;
        font-size: 20px;
      }
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

<style lang="scss">
.base-modal-profile {
  input.form-control,
  .custom-select {
    height: 40px !important;
  }

  textarea.form-control {
    height: 120px !important;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
