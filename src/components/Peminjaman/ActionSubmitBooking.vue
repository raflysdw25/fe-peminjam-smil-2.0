<template>
  <div class="action-submit-booking">
    <h5 class="title-action">{{ titleWording }}</h5>
    <p class="note-booking">
      <template v-if="submitType === 'cancel'">
        Apakah anda yakin ingin membatalkan janji ini? Anda perlu membuat janji
        baru jika ingin melakukan janji pengembalian alat
      </template>
      <template v-else>
        Catatan:
        <br />
        Pengembalian alat hanya dapat dilakukan pada
        <span>HARI KERJA</span> pukul <span>08.00</span> sampai dengan
        <span>16:00 WIB</span>
      </template>
    </p>
    <div class="form-action-submit">
      <div class="smil-row">
        <div class="col-12">
          <div class="form-group" v-if="submitType !== 'cancel'">
            <label for="appointment-date" class="form-label">
              Tanggal Rencana Pengembalian Alat
            </label>
            <!-- DATEPICKER -->
            <date-picker
              format="YYYY-MM-DD"
              value-type="format"
              v-model="submitData.appointment_date"
              @closed="setNullString(submitData.appointment_date)"
              placeholder="Tanggal Rencana Pengembalian Alat"
              :disabled-date="disableBeforeTodayAndWeekends"
            >
              <template slot="icon-clear">
                <b-icon-x-circle-fill></b-icon-x-circle-fill>
              </template>
              <template slot="icon-calendar">
                <b-icon icon="calendar-month-fill"></b-icon>
              </template>
            </date-picker>
            <!-- DATEPICKER -->
          </div>
          <div class="form-group" v-else>
            <label for="booking-notes" class="form-label">
              Alasan Membatalkan Janji Pengembalian Alat (Opsional)
            </label>
            <textarea
              id="booking-notes"
              placeholder="Alasan Membatalkan Janji"
              v-model="submitData.booking_notes"
              class="form-control"
              cols="30"
              rows="10"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="button-group">
      <button class="smil-btn smil-bg-danger mr-2" @click="closeSubmit(false)">
        Batal
      </button>
      <button
        class="smil-btn smil-bg-primary"
        :disabled="!formFilled"
        @click="submitBookingPengembalian"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script>
// API
import api from "@/api/peminjam_api";
// Mixins
import FormInputMixins from "@/mixins/FormInputMixins";
export default {
  name: "action-submit-booking",
  props: {
    popupAlert: { type: Function },
    closeSubmit: { type: Function },
    submitType: { type: String }, //create,cancel,update
    selectedData: { type: Object, default: null },
  },
  mixins: [FormInputMixins],
  data() {
    return {
      submitData: {
        appointment_date: null,
        peminjaman_id: null,
        booking_notes: null,
      },
      listReadyReturn: [],
    };
  },
  mounted() {
    if (!this.isCreateBooking) {
      this.submitData.appointment_date = this.selectedData.appointment_date;
      this.submitData.peminjaman_id = this.selectedData.peminjaman_id;
      this.submitData.booking_notes = this.selectedData.booking_notes;
    }
  },
  computed: {
    isCreateBooking() {
      return this.submitType === "create";
    },
    titleWording() {
      let title = "";
      if (this.isCreateBooking) {
        title = "Buat Janji Pengembalian Alat";
      } else {
        title =
          this.submitType === "cancel"
            ? "Batal Janji Pengembalian Alat"
            : "Ubah Janji Pengembalian Alat";
      }
      return title;
    },
    submitRequestPayload() {
      let userInput = this.submitData;
      let peminjamData = this.$store.state.peminjam;
      let selectedData = this.selectedData;

      let isBookingCancel = null;
      if (this.submitType === "cancel") {
        isBookingCancel = true;
      } else if (this.isCreateBooking) {
        isBookingCancel = null;
      } else {
        isBookingCancel = selectedData.is_booking_cancel;
      }
      return {
        booking_id: this.isCreateBooking ? null : selectedData.id,
        appointment_date: userInput.appointment_date,
        nim_mahasiswa: peminjamData.is_mahasiswa
          ? peminjamData.nomor_induk
          : null,
        nip_staff: !peminjamData.is_mahasiswa ? peminjamData.nomor_induk : null,
        peminjaman_id: userInput.peminjaman_id,
        booking_notes: this.isCreateBooking ? "" : userInput.booking_notes,
        is_booking_cancel: isBookingCancel,
        is_submit_booking: this.isCreateBooking, //true : create, false: update
      };
    },
    formFilled() {
      if (this.submitType === "cancel") {
        return true;
      } else {
        return this.submitData.appointment_date !== null;
      }
    },
  },
  methods: {
    // API
    async submitBookingPengembalian() {
      this.popupAlert(true);
      try {
        const response = await api.createData(
          "booking-pengembalian",
          this.submitRequestPayload
        );
        if (
          response.data.response.code === 201 ||
          response.data.response.code === 200
        ) {
          this.popupAlert(false, true, response.data.response.message);
          setTimeout(() => {
            this.closeSubmit(true);
          }, 2000);
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
  },
};
</script>

<style lang="scss" scoped>
.action-submit-booking {
  .title-action {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .note-booking {
    font-size: 12px;
    color: #696969;
    span {
      color: #000;
      font-weight: bold;
    }
  }
  .form-action-submit {
    margin-bottom: 30px;
    .form-group {
      .form-label {
        font-size: 14px;
      }

      .mx-datepicker {
        width: 100%;
        .mx-input {
          height: 40px !important;
        }
      }
    }
  }
  .button-group {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
<style lang="scss">
.action-submit-booking {
  .col-12 {
    padding: 0;
  }
}
</style>
