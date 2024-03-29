<template>
  <div class="lapor-kerusakan-alat">
    <div class="header">
      <h3 class="header-title">
        Lapor Kerusakan Alat
      </h3>
      <div class="button-group">
        <button
          class="smil-btn smil-bg-danger mr-3"
          @click="$router.push({ name: 'BerandaPeminjaman' })"
        >
          Batal
        </button>
        <button
          class="smil-btn smil-bg-primary"
          :disabled="!formFilled"
          @click="createReport"
        >
          Submit
        </button>
      </div>
    </div>
    <div class="form-content">
      <div
        class="smil-row align-items-center"
        v-for="(form, idxForm) in formList"
        :key="`form-${idxForm}`"
      >
        <div class="form-group col-lg-6 offset-lg-3">
          <label :for="`input-${idxForm}`" class="form-label">
            {{ form.label }}
          </label>
          <span style="color: #dc3545; font-size: 14px">
            *
          </span>
          <input
            :type="form.type"
            class="form-control"
            :class="
              form.verified && form.verified === true && form.model !== ''
                ? 'valid'
                : ''
            "
            v-if="formInputType(form.type) === 'input'"
            :placeholder="form.placeholder"
            @keypress="formConstraint($event, form.type)"
            @paste="formPasteConstraint($event, form.type)"
            v-model="form.model"
            @change="changeValueInput(idxForm)"
            :disabled="form.disabled"
          />

          <textarea
            v-if="form.type === 'text-area'"
            class="form-control"
            cols="30"
            rows="10"
            :placeholder="form.placeholder"
            v-model="form.model"
            :disabled="form.disabled"
          >
          </textarea>
          <p class="desc" v-if="form.description !== ''">
            {{ form.description }}
          </p>
        </div>
        <button
          class="smil-btn smil-bg-danger"
          v-if="idxForm === 1 && form.model.length > 2"
          @click="deleteBarcode(idxForm)"
        >
          Delete Barcode
        </button>
      </div>
    </div>
    <b-modal
      ref="modal-alert"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
      no-close-on-esc
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
// Components
import BaseModalAlert from "@/components/BaseModal/BaseModalAlert";
// Mixins
import AlertInfoMixin from "@/mixins/AlertInfoMixin";
import FormInputMixins from "@/mixins/FormInputMixins";

// API
import api from "@/api/peminjam_api";
export default {
  name: "lapor-kerusakan-alat",
  mixins: [FormInputMixins, AlertInfoMixin],
  components: { BaseModalAlert },
  data() {
    return {
      formList: [
        {
          label: "Barcode Alat",
          type: "barcode-input",
          model: "",
          description:
            "Arahkan kursor ke kolom input, lalu Gunakan barcode scanner yang tersedia untuk membaca barcode alat",
          placeholder: "Barcode Alat",
          isRequired: true,
          data: "alat",
          disabeld: false,
          verified: false,
        },
        {
          label: "Kronologi Kerusakan",
          type: "text-area",
          model: "",
          description: "",
          placeholder: "Kronologi Kerusakan Alat",
          isRequired: true,
          disabeld: false,
        },
      ],
    };
  },
  methods: {
    // CALL API
    async cekDataLab(type, payload) {
      try {
        const response = await api.cekData(type, payload);
        if (response.data.response.code === 200) {
          if (type === "alat") {
            let alat = response.data.data;
            if (alat === null) {
              this.formList[1].model = "";
              this.popupAlert(false, false, response.data.response.message);
            } else {
              let alatName = {
                label: "Nama Alat",
                type: "text",
                model: alat["alat_name"],
                description: "",
                placeholder: "Nama Alat",
                isRequired: false,
                disabled: true,
              };
              this.formList.splice(1, 0, alatName);
              this.formList[0].disabled = true;
            }
          }
        }
      } catch (e) {
        if (this.environment == "development") {
          console.log(e);
        }
        let message = this.getErrorMessage(e);
        if (typeof message == "object" && message.length > 0) {
          this.popupAlert(false, false, "Terjadi Kesalahan", message);
        } else {
          this.popupAlert(false, false, message);
        }
      }
    },
    async createReport() {
      this.isCreate = true;
      this.popupAlert(true);
      try {
        const response = await api.createData(
          "laporan-kerusakan",
          this.submitRequest
        );
        if (response.data.response.code === 201) {
          this.popupAlert(false, true, response.data.response.message);
          setTimeout(() => {
            this.$router.push({ name: "BerandaPeminjaman" });
          }, 2000);
        }
      } catch (e) {
        this.isCreate = false;
        if (this.environment == "development") {
          console.log(e);
        }
        let message = this.getErrorMessage(e);
        if (typeof message == "object" && message.length > 0) {
          this.popupAlert(false, false, "Terjadi Kesalahan", message);
        } else {
          this.popupAlert(false, false, message);
        }
      }
    },
    changeValueInput(indexData) {
      let form = this.formList[indexData];
      let payload = {};
      if (form.data === "alat") {
        payload.barcode_alat = form.model;
      }

      if (form.model !== "") {
        this.cekDataLab(form.data, payload);
      }
    },
    deleteBarcode(indexData) {
      let form = this.formList[indexData];
      form.model = "";
      form.disabled = false;
      let index = this.formList.findIndex((form) => form.label === "Nama Alat");
      if (index > -1) {
        this.formList.splice(index, 1);
      }
    },
  },
  computed: {
    userData() {
      return this.$store.state.peminjam;
    },
    submitRequest() {
      let form = this.formList;
      return {
        nomor_induk: this.userData.nomor_induk,
        barcode_alat: form[0].model,
        chronology: form.length === 3 ? form[2].model : form[1].model,
      };
    },
    formFilled() {
      return (
        this.submitRequest.nomor_induk !== "" &&
        this.submitRequest.barcode_alat !== "" &&
        this.submitRequest.chronology !== ""
      );
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isCreate) {
      let confirm = window.confirm(
        "Apakah anda yakin akan meninggalkan halaman ini? Data yang telah dimasukkan tidak akan tersimpan"
      );
      if (confirm) {
        next();
      }
    } else {
      next();
    }
  },
};
</script>

<style lang="scss" scoped>
.lapor-kerusakan-alat {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .header-title {
      font-size: 32px;
      font-weight: 700;
    }
  }
  .form-content {
    margin-top: 50px;
    .form-group {
      .form-label {
        font-size: 16px;
      }
      .desc {
        margin-top: 5px;
        margin-bottom: 0;
        font-size: 12px;
        color: #696969;
      }
    }
  }
  .button-group {
    display: flex;
  }
}
</style>
<style lang="scss">
.lapor-kerusakan-alat {
  @import "@/assets/css/global.scss";
  .form-control {
    &.valid {
      border-color: #28a745;
      background-color: #65e783;
    }
  }
  .col-lg-6,
  .col-12 {
    padding-left: 0;
  }
}
</style>
