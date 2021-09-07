<template>
  <q-page class="q-pt-xl flex row justify-center">
    <div>
      <q-btn flat dense round icon="insert_emoticon" @click="showEmojiPicker" />
      <input v-model="text" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const picker = ref(null);
    const text = ref('');

    picker.value = new EmojiButton({
      position: "left-start",
    });

    picker.value.on("emoji", (emoji) => {
      text.value += emoji;
    });

    const showEmojiPicker = () => {
      picker.value.pickerVisible ? picker.hidePicker() : picker.value.showPicker(text.value)
    }

    return {
      text,

      showEmojiPicker
    };
  },
};
</script>
