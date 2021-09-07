<template>
  <q-page class="q-pa-md">
    <div class="flex row justify-center">
      <FileInput style="width: 300px" />
      <QFileInput style="width: 300px" />
    </div>
    <ImageGrid />
  </q-page>
</template>

<script>
import { ref } from "vue";
import ImageGrid from "../components/ImageGrid.vue";
import ProgressBar from "../components/ProgressBar.vue";
import FileInput from "../components/FileInput.vue";
import QFileInput from "../components/QFileInput.vue";

export default {
  components: {
    ImageGrid,
    ProgressBar,
    FileInput,
    QFileInput,
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
