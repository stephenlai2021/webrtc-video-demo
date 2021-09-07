<template>
  <q-form class="q-my-md">
    <span>Quasar Component</span>
    <q-file outlined class="full-width" v-model="file" label="Uplaod Image">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <div class="output-2 text-center">
      <div v-if="fileError" class="error">{{ fileError }}</div>
      <q-linear-progress
        v-if="file"
        class="q-mt-sm"
        color="primary"
        :value="store.state.progress"
      />
    </div>
  </q-form>
</template>

<script>
import ImageGrid from "./ImageGrid.vue";
import { ref, watch, watchEffect, inject } from "vue";

export default {
  components: {
    ImageGrid,
  },
  setup() {
    const store = inject("store");

    const file = ref(null);
    const fileError = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

    watch(
      () => file.value,
      (newVal, oldVal) => {
        console.log("You have selected: ", newVal);

        if (file.value && types.includes(file.value.type)) {
          fileError.value = null;
          store.methods.useStorage(file.value, "images");
        } else {
          file.value = null;
          // fileError.value = "Please select an image file (png or jpeg/jpg)";
        }
      }
    );

    watchEffect(() => {
      if (store.state.progress === 100) {
        file.value = null;
      }
    });

    return {
      store,

      // ref
      file,
      fileError,
    };
  },
};
</script>

<style lang="scss" scoped>
input {
  // hide input
  height: 0;
  width: 0;
  opacity: 0;
}
.btn-1 {
  display: block;
  width: 150px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #21ba45;
  font-weight: bold;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #21ba45;
    color: white;
  }
}
.output {
  height: 40px;
  font-size: 0.8rem;
}
.error {
  color: red;
}
</style>
