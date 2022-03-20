<template>
  <div class="list-peminjaman-alat-peminjam">
    <h1 class="title-list">Detail Peminjaman Alat</h1>
    <!-- START: HEADER SECTION -->
    <div class="header-list">
      <div class="info-peminjaman">
        <span class="info-numbering">
          {{ paginationData.listTotal }}
        </span>
        <br />
        <span>Peminjaman</span>
      </div>
      <div class="button-group">
        <button
          class="smil-btn smil-bg-primary mx-3"
          @click="$router.push({ name: 'ActionPeminjaman' })"
        >
          Pinjam Alat
        </button>
        <button
          class="smil-btn smil-bg-danger"
          @click="$router.push({ name: 'BerandaPeminjaman' })"
        >
          Kembali
        </button>
      </div>
    </div>
    <!-- END: HEADER SECTION -->

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
          Waktu Peminjaman
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="date"
          :default_value="filterListPeminjaman.createdDate"
          placeholder="All"
          modelFilter="createdDate"
        />
      </div>
      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Waktu Pengembalian
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="date"
          :default_value="filterListPeminjaman.expectedReturnDate"
          placeholder="All"
          modelFilter="expectedReturnDate"
        />
      </div>
      <div class="filter-group mt-2">
        <label for="" class="filter-label">
          Status Peminjaman
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="select"
          :default_value="filterListPeminjaman.pjmStatus"
          :options="statusOptions"
          placeholder="All"
          modelFilter="pjmStatus"
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
            @filterAction="getListPeminjamanAlatPeminjam"
            filter_type="select"
            :default_value="filterListPeminjaman.sortDirection"
            :options="sortOptions"
            placeholder="All"
            modelFilter="sortDirection"
          />
          <base-filter
            filter_class="mt-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListPeminjamanAlatPeminjam"
            filter_type="select"
            :default_value="filterListPeminjaman.sortBy"
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
          Waktu Peminjaman
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="date"
          :default_value="filterListPeminjaman.createdDate"
          placeholder="All"
          modelFilter="createdDate"
        />
      </div>
      <div class="filter-group">
        <label for="" class="filter-label">
          Waktu Pengembalian
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="date"
          :default_value="filterListPeminjaman.expectedReturnDate"
          placeholder="All"
          modelFilter="expectedReturnDate"
        />
      </div>
      <div class="filter-group">
        <label for="" class="filter-label">
          Status Peminjaman
        </label>
        <base-filter
          filter_class="mt-2"
          @changeValue="changeFilterValue"
          @filterAction="getListPeminjamanAlatPeminjam"
          filter_type="select"
          :default_value="filterListPeminjaman.pjmStatus"
          :options="statusOptions"
          placeholder="All"
          modelFilter="pjmStatus"
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
            @filterAction="getListPeminjamanAlatPeminjam"
            filter_type="select"
            :default_value="filterListPeminjaman.sortDirection"
            :options="sortOptions"
            placeholder="All"
            modelFilter="sortDirection"
          />
          <base-filter
            filter_class="mt-2 w-100"
            @changeValue="changeFilterValue"
            @filterAction="getListPeminjamanAlatPeminjam"
            filter_type="select"
            :default_value="filterListPeminjaman.sortBy"
            :options="sortByOptions"
            placeholder="All"
            modelFilter="sortBy"
          />
        </div>
      </div>
      <!-- End: Desktop View -->
    </div>
    <!-- END: FILTER SECTION -->

    <!-- START: PAGINATION INFO SECTION -->
    <div class="pagination-section">
      <div class="table-counter">
        {{
          `${listPeminjamanAlat.length} dari ${paginationData.listTotal} Data`
        }}
      </div>
      <div class="table-pagination">
        <ul v-if="listPeminjamanAlat.length > 0">
          <li>
            <span
              :style="paginationData.pageNo === 1 ? '' : 'cursor: pointer'"
              @click="previousPage"
              v-if="paginationData.totalPage > 1"
              :disabled="paginationData.pageNo === 1"
            >
              <icon-component
                iconName="arrow-left"
                :size="24"
                :colorIcon="paginationData.pageNo === 1 ? `#C5C5C5` : `#101939`"
              />
            </span>
          </li>
          <li :class="paginationData.totalPage > 5 ? `page-limit` : ``">
            <a
              v-for="num in paginationData.totalPage"
              :key="num"
              style="cursor: pointer;"
              class="smil-link"
              @click="jumpPage(num)"
              :class="[num === paginationData.pageNo ? 'active' : '']"
            >
              {{ num }}
            </a>
          </li>
          <li>
            <span
              :style="
                paginationData.totalPage === paginationData.pageNo
                  ? ''
                  : 'cursor: pointer'
              "
              @click="nextPage"
              v-if="paginationData.totalPage > 1"
              :disabled="paginationData.pageNo === paginationData.totalPage"
            >
              <icon-component
                iconName="arrow-right"
                :size="24"
                :colorIcon="
                  paginationData.pageNo === paginationData.totalPage
                    ? `#C5C5C5`
                    : `#101939`
                "
              />
            </span>
          </li>
        </ul>
      </div>
      <div class="table-count">
        Tampilkan
        <select
          class="custom-select"
          v-model="filterListPeminjaman.pageSize"
          @change="getListPeminjamanAlatPeminjam"
        >
          <option
            :value="count"
            v-for="count in dataCount"
            :key="`page-size-${count}`"
            >{{ count }}</option
          >
        </select>
      </div>
    </div>
    <!-- END: PAGINATION INFO SECTION -->

    <!-- LIST PEMINJAMAN -->
    <div
      class="list-data"
      :class="listPeminjamanAlat.length === 0 ? 'empty' : ''"
    >
      <template v-if="loadingData">
        <div class="text-center">
          <b-spinner style="width: 120px; height: 120px"></b-spinner>
        </div>
      </template>
      <template v-else>
        <div class="empty-list" v-if="listPeminjamanAlat.length === 0">
          <h6 class="text-muted">
            Tidak ada data peminjaman alat
          </h6>
        </div>
        <div class="row align-items-center justify-content-center" v-else>
          <div
            class="col-lg-3 col-md-6 col-12 list-card"
            v-for="(pa, idxPa) in listPeminjamanAlat"
            :key="`list-peminjaman-alat-${idxPa}`"
          >
            <div class="list-head">
              <h3 class="list-id"># {{ pa.id }}</h3>
              <span
                class="smil-status"
                :class="getStatusPeminjaman(pa.pjm_status).bg"
              >
                {{ getStatusPeminjaman(pa.pjm_status).text }}
              </span>
            </div>
            <div class="list-content">
              <div class="content">
                <p class="title">
                  Durasi Peminjaman
                </p>
                <p class="data">
                  {{
                    `${formatDate(
                      pa.created_date,
                      "DD MMMM YYYY"
                    )} - ${formatDate(pa.expected_return_date, "DD MMMM YYYY")}`
                  }}
                </p>
              </div>
              <div class="content">
                <p class="title">
                  Tujuan Peminjaman
                </p>
                <p class="data">
                  {{ pa.pjm_purpose }}
                </p>
              </div>
              <div class="content">
                <p class="title">
                  Catatan Peminjaman
                </p>
                <p class="data">
                  {{
                    pa.pjm_notes === null || pa.pjm_notes === ""
                      ? "-"
                      : pa.pjm_notes
                  }}
                </p>
              </div>
            </div>
            <div class="button-group d-flex">
              <button
                class="smil-btn smil-bg-primary mr-2"
                @click="getDetailPeminjaman(idxPa, 'alat-dipinjam')"
              >
                Alat Dipinjam
              </button>
              <button
                class="smil-btn smil-bg-secondary"
                @click="getDetailPeminjaman(idxPa, 'riwayat')"
              >
                Riwayat Peminjaman
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- LIST PEMINJAMAN -->

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
    <!-- MODAL DETAIL PEMINJAMAN -->
    <b-modal v-model="openDetail" hide-header hide-footer centered size="lg">
      <template v-if="detailType === 'riwayat'">
        <div class="riwayat-peminjaman">
          <h4>Riwayat Peminjaman</h4>
          <div class="list-riwayat">
            <div
              class="riwayat"
              v-for="(log, idxLog) in selectedPeminjamanAlat.log_peminjaman"
              :key="`list-log-${idxLog}`"
            >
              <span class="datetime-riwayat">
                {{
                  `${formatDate(log.created_at, "DD MMMM YYYY, HH:MM:SS A")}`
                }}
              </span>
              <span class="action-riwayat">
                {{ getLogPeminjaman(log) }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="detailType === 'alat-dipinjam'">
        <div class="alat-dipinjam-peminjaman">
          <h4>List Alat Dipinjam</h4>
          <div class="table-responsive-lg mt-4">
            <table class="table smil-table">
              <thead class="smil-thead">
                <tr>
                  <th
                    v-for="(head, idxHead) in headAlatDipinjam"
                    :key="`table-head-${idxHead}`"
                  >
                    {{ head }}
                  </th>
                </tr>
              </thead>
              <tbody class="smil-tbody">
                <tr
                  v-for="(data,
                  indexData) in selectedPeminjamanAlat.detail_peminjaman_model"
                  :key="`row-added-alat-${indexData}`"
                >
                  <td>
                    {{ data.alat_pinjam.alat_name }}
                  </td>
                  <td>
                    {{ data.barcode_alat !== null ? data.barcode_alat : "-" }}
                  </td>
                  <td>
                    <span
                      v-if="data.barcode_alat !== null"
                      class="smil-status"
                      :class="
                        getKondisiAlat(
                          data.barcode_alat_pinjam.condition_status
                        ).background
                      "
                    >
                      {{
                        getKondisiAlat(
                          data.barcode_alat_pinjam.condition_status
                        ).text
                      }}
                    </span>
                    <template v-else>
                      -
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </b-modal>
    <!-- MODAL DETAIL PEMINJAMAN -->
  </div>
</template>

<script>
// Components
import BaseFilter from "@/components/BaseFilter";
import BaseModalAlert from "@/components/BaseModal/BaseModalAlert";
// API
import api from "@/api/peminjam_api";
// Mixins
import ErrorHandlerMixins from "@/mixins/ErrorHandlerMixins";
import AlertInfoMixin from "@/mixins/AlertInfoMixin";

// Package
let moment = require("moment");
export default {
  name: "list-peminjaman-alat-peminjam",
  components: { BaseFilter, BaseModalAlert },
  mixins: [AlertInfoMixin, ErrorHandlerMixins],
  data() {
    return {
      // Loading State
      loadingData: false,
      // Filter List Peminjaman
      paginationData: {
        listTotal: 0,
        pageNo: 1,
        totalPage: 10,
      },
      dataCount: [5, 10, 15, 20, 25, 30],
      filterListPeminjaman: {
        pageSize: 5,
        sortBy: "id",
        sortDirection: "ASC",
        createdDate: null,
        expectedReturnDate: null,
        pjmStatus: null,
      },
      statusOptions: [
        { id: null, name: "All", value: null, disabled: false },
        { id: 1, name: "Butuh Persetujuan", value: 1, disabled: false },
        { id: 2, name: "Alat Belum Diambil", value: 2, disabled: false },
        { id: 3, name: "Ditolak", value: 3, disabled: false },
        { id: 4, name: "Belum Kembali", value: 4, disabled: false },
        { id: 5, name: "Selesai", value: 5, disabled: false },
      ],
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
          name: "Tanggal Peminjaman",
          value: "created_date",
          disabled: false,
        },
        {
          id: 2,
          name: "Tanggal Pengembalian",
          value: "expected_return_date",
          disabled: false,
        },
      ],
      // List Data
      selectedPeminjamanAlat: null,
      listPeminjamanAlat: [],
      listStatus: [
        { id: 1, name: "Butuh Persetujuan", background: "smil-bg-warning" },
        { id: 2, name: "Alat Belum Diambil", background: "smil-bg-info" },
        { id: 3, name: "Ditolak", background: "smil-bg-danger" },
        { id: 4, name: "Belum Kembali", background: "smil-bg-warning" },
        { id: 5, name: "Selesai", background: "smil-bg-success" },
      ],
      headAlatDipinjam: ["Nama Alat", "Barcode Alat", "Kondisi Alat"],
      // Popup State
      openDetail: false,
      detailType: "",
      openFilterMobile: false,
    };
  },
  watch: {
    "paginationData.pageNo": {
      deep: true,
      handler: function() {
        if (!this.loadingData) {
          this.getListPeminjamanAlatPeminjam();
        }
      },
    },
    openDetail: {
      deep: true,
      handler: function(newVal) {
        if (newVal === false) {
          this.selectedPeminjamanAlat = null;
          this.detailType = "";
        }
      },
    },
  },
  computed: {
    filterPayload() {
      let filter = this.filterListPeminjaman;
      let peminjamData = this.$store.state.peminjam;
      return {
        page_size: filter.pageSize,
        sort_by: filter.sortBy,
        sort_direction: filter.sortDirection,
        created_date: filter.createdDate,
        expected_return_date: filter.expectedReturnDate,
        nomor_induk: peminjamData.nomor_induk,
        pjm_status: filter.pjmStatus,
        is_mahasiswa: peminjamData.is_mahasiswa,
      };
    },
    isFilterUse() {
      let filterValues = Object.values(this.filterListPeminjaman).find(
        (value) => value !== "" && value !== null
      );
      return filterValues !== undefined;
    },
  },
  async mounted() {
    await this.getListPeminjamanAlatPeminjam();
  },
  methods: {
    // API
    async getListPeminjamanAlatPeminjam() {
      this.loadingData = true;
      if (this.isFilterUse && this.paginationData.pageNo > 1) {
        this.paginationData.pageNo = 1;
      }
      // Nembak API Get List Alat
      try {
        const response = await api.getFilterData(
          "cek-peminjaman",
          this.paginationData.pageNo,
          this.filterPayload
        );

        this.listPeminjamanAlat = response.data.result;
        let page = response.data.page;
        this.paginationData.totalPage = page.total;
        this.paginationData.listTotal = page.data_total;
        this.loadingData = false;
      } catch (e) {
        let message = this.getErrorMessage(e);
        if (typeof message == "object" && message.length > 0) {
          setTimeout(() => {
            this.popupAlert(false, false, "Terjadi Kesalahan", message);
          }, 500);
        } else {
          this.popupAlert(false, false, message);
        }
        this.loadingData = false;
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
        this.filterListPeminjaman[objFilter.model] =
          objFilter.value !== "" ? parseInt(objFilter.value) : null;
      } else {
        this.filterListPeminjaman[objFilter.model] = objFilter.value;
      }
    },
    // Format Value
    getStatusPeminjaman(pjmStatus) {
      let status = this.listStatus.find((status) => status.id === pjmStatus);
      return { bg: status.background, text: status.name };
    },
    formatDate(date, format = "YYYY-MM-DD") {
      return moment(date).format(format);
    },
    getLogPeminjaman(log) {
      let listAction = {
        CREATED: "membuat permintaan peminjaman alat",
        REGISTER: "mendaftarkan alat yang dipinjam",
        ACCEPTED: "menyetujui permintaan peminjaman alat",
        REJECTED: "menolak permintaan peminjaman alat",
        RETURN: "menyelesaikan peminjaman alat",
      };
      let logWording = `${log.created_by} ${listAction[log.action]}`;
      return logWording;
    },
    getKondisiAlat(conditionStatus) {
      let listKondisi = [
        {
          id: 1,
          text: "Pending",
          background: "smil-bg-pending",
        },
        {
          id: 2,
          text: "Baik",
          background: "smil-bg-success",
        },
        {
          id: 3,
          text: "Rusak",
          background: "smil-bg-danger",
        },
        {
          id: 4,
          text: "Habis",
          background: "smil-bg-warning",
        },
        {
          id: 5,
          text: "Diperbaiki",
          background: "smil-bg-info",
        },
        {
          id: 6,
          text: "Apkir",
          background: "smil-bg-danger",
        },
      ];

      return listKondisi.find((kondisi) => kondisi.id === conditionStatus);
    },
    // Detail Peminjaman
    getDetailPeminjaman(indexList, type) {
      this.selectedPeminjamanAlat = this.listPeminjamanAlat[indexList];
      this.detailType = type;
      this.openDetail = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-peminjaman-alat-peminjam {
  .title-list {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 60px;
  }
  .header-list {
    display: flex;
    align-items: center;
    margin-bottom: 60px;
    .info-peminjaman {
      .info-numbering {
        font-size: 32px;
        font-weight: bold;
      }
    }
    .button-group {
      display: flex;
      margin-left: auto;
    }
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
  .pagination-section {
    margin-top: 25px;
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

    .list-card {
      padding: 20px 15px;
      border: 1px solid #696969;
      border-radius: 10px;
      height: 420px;
      box-sizing: border-box;
      margin-right: 15px;
      margin-bottom: 15px;

      .list-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        .list-id {
          font-size: 24px;
          color: #101939;
          font-weight: bold;
          margin-bottom: 0;
        }
      }
      .list-content {
        .content {
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 30px;
          }
          p {
            margin-bottom: 0;
            &.title {
              font-weight: bold;
              text-decoration: underline;
              color: #101939;
            }
            &.data {
              color: #696969;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .list-peminjaman-alat-peminjam {
    .filter-list {
      display: flex;
      flex-direction: column;
      .filter-group {
        max-width: none;
        padding: 0 15px;
      }
    }
    .pagination-section {
      padding: 0 15px;
    }
    .list-data {
      width: 100%;
      padding: 15px;
      .list-card {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
  }
}
</style>

<style lang="scss">
.list-peminjaman-alat-peminjam {
  .list-data {
    .row {
      margin: 0;
    }
  }
}
.modal-dialog {
  .modal-body {
    .riwayat-peminjaman {
      padding: 6px;
      h4 {
        font-weight: bold;
        font-size: 24px;
        margin-bottom: 40px;
      }
      .list-riwayat {
        .riwayat {
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          .datetime-riwayat {
            font-weight: bold;
            margin-right: 12px;
          }
          .action-riwayat {
            color: #696969;
          }
        }
      }
    }
    .alat-dipinjam-peminjaman {
      padding: 6px;
      h4 {
        font-weight: bold;
        font-size: 24px;
        margin-bottom: 40px;
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .modal-dialog {
    .modal-body {
      .riwayat-peminjaman {
        .list-riwayat {
          .riwayat {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            .datetime-riwayat {
              font-size: 12px;
            }
            .action-riwayat {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
