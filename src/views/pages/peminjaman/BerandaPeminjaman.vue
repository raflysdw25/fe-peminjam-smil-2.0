<template>
  <div class="beranda-peminjaman">
    <div class="header">
      <div class="header-title">
        <h2 class="text-center">
          PORTAL PEMINJAMAN ALAT LABORATORIUM
          <br />
          TEKNIK INFORMATIKA DAN KOMPUTER
        </h2>
      </div>
    </div>
    <div class="action-menu row justify-content-center">
      <div class="col-lg-4 col-md-4 col-sm-12 box">
        <div class="box-action">
          <h3>
            Atur <br />
            Pengembalian
          </h3>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 box">
        <div
          class="box-action"
          @click="$router.push({ name: 'ActionPeminjaman' })"
        >
          <h3>
            Peminjaman <br />
            Alat
          </h3>
        </div>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 box">
        <div
          class="box-action"
          @click="$router.push({ name: 'LaporKerusakanAlat' })"
        >
          <h3>
            Lapor <br />
            Kerusakan Alat
          </h3>
        </div>
      </div>
    </div>

    <!-- START: POPUP ACTION -->
    <b-modal
      ref="modal-popup"
      id="modal-popup"
      centered
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
    >
      <action-modal
        v-if="baseModalType === 'action'"
        :title="actionModal[activeTab]"
        :form="formModal"
        :closeModal="closePopup"
        :actionType="activeTab"
      />
    </b-modal>
    <!-- END: POPUP ACTION -->
  </div>
</template>

<script>
// Components
import TabMenuComponent from "@/components/Peminjaman/TabMenuComponent";
import ActionModal from "@/components/Peminjaman/ActionModal";

// Mixins
import ModalMixins from "@/mixins/ModalMixins";

export default {
  name: "beranda-peminjaman",
  components: { TabMenuComponent, ActionModal },
  mixins: [ModalMixins],
  data() {
    return {
      activeTab: "peminjaman",
      actionModal: {
        peminjaman: "Peminjaman Alat Laboratorium",
        pengembalian: "Pengembalian Alat Laboratorium",
      },
      formModal: {
        label: "Nomor Induk",
        type: "text",
        placeholder: "Nomor Induk",
        model: "",
      },
    };
  },
  computed: {
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

    checkActiveButton() {
      let form = this.tabs.find((tab) => tab.id === 3);
      return form.inputValue !== "";
    },
  },
  mounted() {},
  methods: {
    // Tab Interaction
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
  },
};
</script>

<style lang="scss" scoped>
.beranda-peminjaman {
  .header {
    .header-title {
      h2 {
        font-weight: 700;
        font-size: 32px;
      }
    }
  }

  .action-menu {
    margin: 120px 0;

    .box-action {
      height: 100px;
      padding: 20px;
      background-color: #213069;
      color: #fff;
      font-weight: bold;
      text-align: center;
      border-radius: 5px;
      font-size: 24px;
      &:hover {
        cursor: pointer;
        background-color: #101939;
      }
    }
  }
}
@media screen and (max-width: 992px) {
  .beranda-peminjaman {
    .header {
      .header-title {
        h2 {
          font-size: 24px;
        }
      }
    }
    .action-menu {
      .box {
        margin-bottom: 4rem;
      }
    }
  }
}
</style>

<style lang="scss">
.beranda-peminjaman {
  overflow-y: hidden;
}

@media screen and (max-width: 992px) {
  .beranda-peminjaman {
    .header {
      .header-title {
        h2 {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
