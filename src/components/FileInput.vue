<template>
  <form class="q-my-md">
    <span>Vue Component</span>
    <label class="full-width btn-1">
      <input type="file" @change="handleChange" />
      <span>Upload Image</span>
    </label>
    <div class="output-1 text-center">
      <div v-if="fileError" class="error">{{ fileError }}</div>
      <div v-if="file">{{ file.name }}</div>
      <ProgressBar v-if="file" :file="file" @complete="file = null" />
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import ImageGrid from "./ImageGrid.vue";
import ProgressBar from "./ProgressBar.vue";

export default {
  components: {
    ImageGrid,
    ProgressBar,
  },
  setup() {
    const file = ref(null);
    const fileError = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";
      }
    };

    return {
      // ref
      file,
      fileError,

      // methods
      handleChange,
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
  padding: 10px;
  // height: 40px;
  border-radius: 6px;
  border: 2px solid #21ba45;
  // background: #21ba45;
  // color: white;
  font-weight: bold;
  font-size: 1rem;
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
