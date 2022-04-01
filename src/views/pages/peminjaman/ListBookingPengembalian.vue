<template>
  <div class="list-booking-pengembalian">
    <h1 class="title-list">List Janji Laboratorium</h1>
    <div class="button-group">
      <button
        class="smil-btn smil-bg-primary mx-3"
        @click="openSubmit('create')"
      >
        Buat Janji
      </button>
      <button
        class="smil-btn smil-bg-danger"
        @click="$router.push({ name: 'BerandaPeminjaman' })"
      >
        Kembali
      </button>
    </div>

    <!-- START: FILTER SECTION -->
    <button
      class="smil-btn smil-bg-info d-block d-lg-none"
      :class="openFilterMobile ? null : 'collapsed'"
      :aria-expanded="openFilterMobile ? 'true' : 'false'"
      aria-controls="filter-mobile"
      @click="openFilterMobile = !openFilterMobile"
    >
      {{ openFilterMobile ? "Close Filter" : "Open Filter" }}
    </button>
    <!-- Mobile View -->
    <b-collapse
      id="filter-mobile"
      v-model="openFilterMobile"
      class="filter-list mt-2"
    >
      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Tanggal Janjian
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="date"
          :default_value="filterListBooking.appointmentDate"
          placeholder="All"
          modelFilter="appointmentDate"
        />
      </div>
      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Petugas
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="search"
          :default_value="filterListBooking.processBy"
          placeholder="All"
          modelFilter="processBy"
        />
      </div>

      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Status Booking
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="select"
          :default_value="filterListBooking.isBookingCancel"
          :options="listBookingStatus"
          placeholder="All"
          modelFilter="isBookingCancel"
        />
      </div>
      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Sort
        </label>
        <div class="d-flex">
          <base-filter
            filter_class="mt-2 mr-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListBookingPengembalian"
            filter_type="select"
            :default_value="filterListBooking.sortDirection"
            :options="sortOptions"
            placeholder="All"
            modelFilter="sortDirection"
          />
          <base-filter
            filter_class="mt-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListBookingPengembalian"
            filter_type="select"
            :default_value="filterListBooking.sortBy"
            :options="sortByOptions"
            placeholder="All"
            modelFilter="sortBy"
          />
        </div>
      </div>
    </b-collapse>
    <!-- Mobile View -->
    <div class="filter-list d-lg-flex d-none">
      <!-- Desktop View -->
      <div class="filter-group">
        <label for="" class="filter-label">
          Tanggal Janjian
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="date"
          :default_value="filterListBooking.appointmentDate"
          placeholder="All"
          modelFilter="appointmentDate"
        />
      </div>
      <div class="filter-group">
        <label for="" class="filter-label">
          Petugas
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="search"
          :default_value="filterListBooking.processBy"
          placeholder="All"
          modelFilter="processBy"
        />
      </div>

      <div class="filter-group">
        <label for="" class="filter-label">
          Status Booking
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListBookingPengembalian"
          filter_type="select"
          :default_value="filterListBooking.isBookingCancel"
          :options="listBookingStatus"
          placeholder="All"
          modelFilter="isBookingCancel"
        />
      </div>
      <div class="filter-group">
        <label for="" class="filter-label">
          Sort
        </label>
        <div class="d-flex">
          <base-filter
            filter_class="mt-2 mr-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListBookingPengembalian"
            filter_type="select"
            :default_value="filterListBooking.sortDirection"
            :options="sortOptions"
            placeholder="All"
            modelFilter="sortDirection"
          />
          <base-filter
            filter_class="mt-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListBookingPengembalian"
            filter_type="select"
            :default_value="filterListBooking.sortBy"
            :options="sortByOptions"
            placeholder="All"
            modelFilter="sortBy"
          />
        </div>
      </div>
      <!-- End: Desktop View -->
    </div>
    <!-- END: FILTER SECTION -->

    <!-- LIST BOOKING -->
    <div
      class="list-data"
      :class="listBookingPengembalian.length === 0 ? 'empty' : ''"
    >
      <template v-if="loadingData">
        <div class="text-center">
          <b-spinner style="width: 120px; height: 120px"></b-spinner>
        </div>
      </template>
      <template v-else>
        <div class="empty-list" v-if="listBookingPengembalian.length === 0">
          <h6 class="text-muted">
            Tidak ada data booking pengembalian
          </h6>
        </div>
        <div class="smil-row align-items-center justify-content-center">
          <div
            class="col-lg-3 col-md-6 col-12"
            v-for="(booking, idxBooking) in listBookingPengembalian"
            :key="`booking-data-${idxBooking}`"
          >
            <b-card>
              <b-card-title>
                <div class="d-flex align-items-center">
                  <h4 class="font-weight-bold">#{{ booking.id }}</h4>
                  <span
                    class="smil-status ml-auto"
                    :class="getBookingStatus(booking.is_booking_cancel).bgClass"
                  >
                    {{ getBookingStatus(booking.is_booking_cancel).name }}
                  </span>
                </div>
              </b-card-title>
              <div class="mt-4">
                <h6 class="font-weight-bold">
                  Tanggal Janjian
                </h6>
                <p>
                  {{ formatDate(booking.appointment_date, "DD MMMM YYYY") }}
                </p>
              </div>
              <div class="mt-4">
                <h6 class="font-weight-bold">
                  {{
                    booking.is_booking_cancel == true
                      ? "Dibatalkan oleh"
                      : "Diselesaikan oleh"
                  }}
                </h6>
                <p>
                  {{
                    booking.process_by === null || booking.process_by === ""
                      ? "-"
                      : booking.process_by
                  }}
                </p>
              </div>

              <div class="mt-4" v-if="booking.is_booking_cancel === true">
                <h6 class="font-weight-bold">
                  {{ "Alasan Membatalkan Janji" }}
                </h6>
                <p>
                  {{
                    booking.booking_notes === null ||
                    booking.booking_notes === ""
                      ? "-"
                      : booking.booking_notes
                  }}
                </p>
              </div>

              <div class="d-flex" v-if="booking.is_booking_cancel === null">
                <button
                  class="smil-btn smil-bg-danger"
                  @click="openSubmit('cancel', idxBooking)"
                >
                  Batal Perjanjian
                </button>
                <button
                  class="smil-btn smil-bg-primary ml-2"
                  @click="openSubmit('update', idxBooking)"
                >
                  Ubah Perjanjian
                </button>
              </div>
            </b-card>
          </div>
        </div>
      </template>
    </div>
    <!-- LIST BOOKING -->

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

    <!-- MODAL POPUP SUBMIT BOOKING -->
    <b-modal
      v-model="openSubmitBooking"
      hide-header
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      centered
    >
      <action-submit-booking
        :popupAlert="popupAlert"
        :closeSubmit="closeSubmit"
        :submitType="submitType"
        :selectedData="selectedBookingData"
      />
    </b-modal>
    <!-- MODAL POPUP SUBMIT BOOKING -->
  </div>
</template>

<script>
// Components
import BaseFilter from "@/components/BaseFilter";
import BaseModalAlert from "@/components/BaseModal/BaseModalAlert";
import ActionSubmitBooking from "@/components/Peminjaman/ActionSubmitBooking";
// API
import api from "@/api/peminjam_api";
// Mixins
import ErrorHandlerMixins from "@/mixins/ErrorHandlerMixins";
import AlertInfoMixin from "@/mixins/AlertInfoMixin";

// Package
let moment = require("moment");
export default {
  name: "list-booking-pengembalian",
  components: { BaseFilter, BaseModalAlert, ActionSubmitBooking },
  mixins: [ErrorHandlerMixins, AlertInfoMixin],
  data() {
    return {
      // Loading State
      loadingData: false,
      // Filter Data
      paginationData: {
        listTotal: 0,
        pageNo: 1,
        totalPage: 10,
      },
      dataCount: [5, 10, 15, 20, 25, 30],
      filterListBooking: {
        pageSize: 5,
        sortBy: "id",
        sortDirection: "ASC",
        appointmentDate: null,
        isBookingCancel: "",
        processBy: "",
      },
      sortOptions: [
        { id: null, name: "All", value: null, disabled: true },
        { id: 1, name: "ASC", value: "ASC", disabled: false },
        { id: 2, name: "DESC", value: "DESC", disabled: false },
      ],
      sortByOptions: [
        { id: null, name: "All", value: null, disabled: true },
        { id: 1, name: "ID", value: "id", disabled: false },
        {
          id: 2,
          name: "Tanggal Janji Pengembalian",
          value: "appointment_date",
          disabled: false,
        },
      ],
      openFilterMobile: false,
      // List Data
      selectedBookingData: null,
      listBookingPengembalian: [],
      headTable: [
        "Tanggal Pengembalian",
        "Nomor Induk Peminjam",
        "Status Booking",
        "Petugas",
      ],
      listBookingStatus: [
        { id: "", name: "All", value: "", disabled: false, bgClass: "" },
        {
          id: null,
          name: "Belum diproses",
          value: 0,
          disabled: false,
          bgClass: "smil-bg-pending",
        },
        {
          id: false,
          name: "Booking Selesai",
          value: 1,
          disabled: false,
          bgClass: "smil-bg-success",
        },
        {
          id: true,
          name: "Booking Batal",
          value: 2,
          disabled: false,
          bgClass: "smil-bg-danger",
        },
      ],
      // Popup Data
      openSubmitBooking: false,
      submitType: "", //create,cancel,update
    };
  },
  async mounted() {
    await this.getListBookingPengembalian();
  },
  watch: {
    "paginationData.pageNo": {
      deep: true,
      handler: function() {
        if (!this.loadingData) {
          this.getListBookingPengembalian();
        }
      },
    },
    openSubmitBooking: {
      deep: true,
      handler: function(newVal) {
        if (!newVal) {
          this.selectedBookingData = null;
          this.submitType = "";
        }
      },
    },
  },
  computed: {
    filterPayload() {
      let filter = this.filterListBooking;
      let peminjamData = this.$store.state.peminjam;
      return {
        page_size: filter.pageSize,
        sort_by: filter.sortBy,
        sort_direction: filter.sortDirection,
        appointment_date: filter.appointmentDate,
        booking_notes: "",
        is_booking_cancel: filter.isBookingCancel,
        process_by: filter.processBy,
        nomor_induk: peminjamData.nomor_induk,
        is_mahasiswa: peminjamData.is_mahasiswa,
      };
    },
    isFilterUse() {
      let filterValues = Object.values(this.filterListBooking).find(
        (value) => value !== "" && value !== null
      );
      return filterValues !== undefined;
    },
  },
  methods: {
    //   API
    async getListBookingPengembalian() {
      this.loadingData = true;
      if (this.isFilterUse && this.paginationData.pageNo > 1) {
        this.paginationData.pageNo = 1;
      }
      // Nembak API Get List Alat
      try {
        const response = await api.getFilterData(
          "get-booking-pengembalian",
          this.paginationData.pageNo,
          this.filterPayload
        );

        this.listBookingPengembalian = response.data.result;
        let page = response.data.page;
        this.paginationData.totalPage = page.total;
        this.paginationData.listTotal = page.data_total;
        this.loadingData = false;
      } catch (e) {
        this.loadingData = false;
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
    // Filter Methods
    nextPage() {
      if (this.paginationData.pageNo !== this.paginationData.totalPage) {
        this.paginationData.pageNo += 1;
      }
    },
    previousPage() {
      if (this.paginationData.pageNo !== 1) {
        this.paginationData.pageNo -= 1;
      }
    },
    jumpPage(pageNo) {
      this.paginationData.pageNo = pageNo;
    },
    changeFilterValue(objFilter) {
      if (objFilter.type == "search-number") {
        this.filterListBooking[objFilter.model] =
          objFilter.value !== "" ? parseInt(objFilter.value) : null;
      } else {
        this.filterListBooking[objFilter.model] = objFilter.value;
      }
    },
    // Format Value
    getBookingStatus(isBookingCancel) {
      let listStatus = this.listBookingStatus.filter(
        (list) => list.name !== "All"
      );
      return listStatus.find((status) => status.id === isBookingCancel);
    },
    formatDate(date, format = "YYYY-MM-DD") {
      return moment(date).format(format);
    },

    // Custom Popup Methods
    openSubmit(submitType, indexBooking = null) {
      if (indexBooking !== null) {
        this.selectedBookingData = this.listBookingPengembalian[indexBooking];
      }
      this.submitType = submitType;
      this.openSubmitBooking = true;
    },
    async closeSubmit(needRefresh = false) {
      this.openSubmitBooking = false;
      if (needRefresh) {
        await this.getListBookingPengembalian();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-booking-pengembalian {
  .title-list {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 60px;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
  }

  .filter-list {
    display: flex;
    .filter-group {
      max-width: 350px;
      width: 100%;
      margin-right: 30px;
      &:last-child {
        margin-right: 0;
      }
      .filter-label {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .list-data {
    margin-top: 30px;
    overflow-y: auto;
    max-height: 1000px;
    height: 100%;
    &.empty {
      height: 250px;
    }
    .empty-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  }
}
@media screen and (max-width: 992px) {
  .list-booking-pengembalian {
    .filter-list {
      display: flex;
      flex-direction: column;
    }
    .list-data {
      width: 100%;
      .list-card {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
  }
}
</style>

<style lang="scss">
.list-booking-pengembalian {
  .card {
    min-height: 300px;
  }
}
@media screen and (max-width: 992px) {
  .list-booking-pengembalian {
    .card {
      min-height: 300px;
      margin-bottom: 12px;
    }
    .filter-list {
      .filter-group {
        max-width: none !important;
        padding: 0 15px;
      }
    }
  }
}
</style>
