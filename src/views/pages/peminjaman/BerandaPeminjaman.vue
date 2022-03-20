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
      <div class="col-lg-4 col-md-6 col-12 box">
        <div
          class="box-action"
          @click="$router.push({ name: 'ListBookingPengembalian' })"
        >
          <icon-component iconName="calendar" :size="160" colorIcon="#101939" />
          <h3>
            Atur Janji Laboratorium
          </h3>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12 box">
        <div
          class="box-action"
          @click="$router.push({ name: 'ListPeminjamanAlatPeminjam' })"
        >
          <icon-component iconName="scanner" :size="160" colorIcon="#101939" />
          <h3>
            Peminjaman Alat
          </h3>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-12 box" v-if="!isMobile">
        <div
          class="box-action"
          @click="$router.push({ name: 'LaporKerusakanAlat' })"
        >
          <icon-component
            iconName="fixing-tools"
            :size="160"
            colorIcon="#101939"
          />
          <h3>
            Lapor Kerusakan Alat
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import IconComponent from "@/components/IconComponent";

// Mixins
import ModalMixins from "@/mixins/ModalMixins";

export default {
  name: "beranda-peminjaman",
  components: { IconComponent },
  mixins: [ModalMixins],
  data() {
    return {};
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
  },
  mounted() {},
  methods: {},
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: fit-content;
      padding: 20px;
      text-align: center;
      &:hover {
        cursor: pointer;
        background-color: #f4f4f4;
        border-radius: 8px;
      }
      h3 {
        margin-bottom: 0;
        margin-top: 24px;
        font-size: 20px;
        font-weight: bold;
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
        margin-bottom: 2em;
      }
    }
  }
}
</style>

<style lang="scss">
.beranda-peminjaman {
  overflow-y: hidden;
}
</style>
