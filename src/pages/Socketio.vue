<template>
  <q-page class="q-pa-sm chat-page">
    <video autoplay ref="video" width="300" height="300" />
  </q-page>
</template>

<script>
import { ref, onMounted, watch, watchEffect } from "vue";
import { io } from "socket.io-client";

export default {
  setup() {
    // ref
    const video = ref(null);

    const socket = io("http://localhost:5000/");

    socket.on("me", (id) => {
      console.log("socket id: ", id);
    });

    socket.emit("toServer", "hi, server!");

    watchEffect(() => {});

    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.value.srcObject = stream
        });
    });

    return {
      video,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat-page {
}
</style>
