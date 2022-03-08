import * as types from "@/store/types";

export default {
  [types.PEMINJAMANDATA]: (state) => {
    return state.peminjamanData;
  },
  [types.PEMINJAM]: (state) => {
    return state.peminjam;
  },
  [types.IMAGE_PEMINJAM]: (state) => {
    return state.imagePeminjam;
  },
};
