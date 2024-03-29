<template>
  <div class="base-filter" :class="filter_class">
    <select
      v-if="filter_type === 'select'"
      v-model="filter_value"
      class="custom-select"
    >
      <option
        :value="ops.value"
        v-for="(ops, indexList) in options"
        :key="`select-${ops.value}-${indexList}`"
        :disabled="ops.disabled"
      >
        {{ ops.name }}
      </option>
    </select>

    <div
      class="input-group"
      v-else-if="filter_type === 'search' || filter_type === 'search-number'"
    >
      <input
        type="text"
        :placeholder="placeholder"
        v-model="filter_value"
        class="form-control"
        @keypress="searchConstraint($event, filter_type)"
        @keypress.enter="filterAction"
      />
      <div class="input-group-append" @click="filterAction">
        <icon-component iconName="search" :size="16" colorIcon="#000" />
      </div>
    </div>
    <date-picker
      v-else-if="filter_type === 'date'"
      format="YYYY-MM-DD"
      value-type="format"
      placeholder="All"
      v-model="filter_value"
      @closed="setNullString"
    >
      <template slot="icon-clear">
        <b-icon-x-circle-fill></b-icon-x-circle-fill>
      </template>
      <template slot="icon-calendar">
        <b-icon icon="calendar-month-fill"></b-icon>
      </template>
    </date-picker>
  </div>
</template>

<script>
// Component
import IconComponent from "@/components/IconComponent.vue";

export default {
  name: "base-filter",
  components: { IconComponent },
  props: {
    filter_type: String,
    default_value: [String, Number, Boolean],
    placeholder: String,
    options: { type: Array, default: () => [] },
    modelFilter: String,
    filter_class: String,
  },
  data() {
    return {
      filter_value: this.default_value,
    };
  },
  watch: {
    filter_value: function(value) {
      this.$emit("changeValue", {
        type: this.filter_type,
        model: this.modelFilter,
        value: value,
      });
      if (
        this.filter_type === "select" ||
        this.filter_type === "date" ||
        !value
      ) {
        this.$emit("filterAction");
      }
    },
  },
  methods: {
    filterAction() {
      this.$emit("filterAction");
    },
    setNullString() {
      this.filter_value = "";
    },
    searchConstraint(e, type) {
      if (type === "search-number") {
        let char = String.fromCharCode(e.keyCode); // Get the character
        if (/^[0-9]+$/.test(char)) return true;
        // Match with regex
        else e.preventDefault(); // If not match, don't add to input text
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss">
.base-filter {
  .custom-select,
  .form-control,
  .input-group-append {
    border-radius: 5px;
    height: 40px !important;
    font-size: 10px;
  }
  .input-group {
    display: flex;
    align-items: center;
    .form-control {
      border-right: none;
    }
    .input-group-append {
      &:hover {
        cursor: pointer;
      }
      border: 1px solid #c5c5c5;
      border-left: none;
      padding: 0.67rem 0.75rem;

      .icon-component {
        margin-right: 0;
        margin-top: -2px;
      }
    }
  }

  .mx-datepicker {
    width: 100%;
    .mx-input {
      height: 40px;
    }
  }

  // @media screen and (max-width: 992px) {
  // 	.input-group {
  // 		.form-control {
  // 			// border-right: 1px solid #c5c5c5;
  // 		}
  // 		.input-group-append {
  // 			// display: none;
  // 		}
  // 	}
  // }
}
</style>
