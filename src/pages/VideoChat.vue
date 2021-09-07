<template>
  <q-page class="page-chat">
    <p class="q-mt-md text-center">My id: {{ myId }}</p>
    <div class="row justify-center">
      <div style="position: relative" class="q-mx-md">
        <video ref="localVideo" autoplay />
        <div
          class="icons row justify-center"
          style="
            position: absolute;
            bottom: 90px;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
          "
        >
          <q-btn
            flat
            round
            bg-color="red"
            color="white"
            icon="eva-video-outline"
            @click="toggleVideo"
          />
          <q-btn
            flat
            round
            color="white"
            icon="eva-volume-up-outline"
            @click="toggleAudio"
          />
        </div>
        <p class="text-center">Local</p>
      </div>
      <div class="q-mx-md">
        <video ref="remoteVideo" autoplay />
        <p class="text-center">Remote</p>
      </div>
    </div>
    <div class="q-mx-lg">
      <q-input v-model="idInput" label="Please paste peer id here ..." />
    </div>

    <div class="q-my-lg row justify-center">
      <q-btn-group rounded>
        <q-btn no-caps label="Call" @click="call" />
        <q-btn no-caps label="Answer" @click="answer" />
        <q-btn no-caps label="Hang Up" @click="hangUp" />
      </q-btn-group>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const idInput = ref("");
    const myId = ref("");
    const localVideo = ref(null);
    const remoteVideo = ref(null);
    const localStream = ref(null);

    // connect to Peer server
    const peer = new Peer();

    // get a random id assigned by Peer server
    peer.on("open", (id) => {
      myId.value = id;
    });

    // receiving call
    peer.on("call", (call) => {
      call.answer(localStream.value);

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
      });
    });

    const toggleVideo = () => {
      console.log("toggle video");
    };
    const toggleAudio = () => {
      console.log("toggle audio");
    };
    const hangUp = () => {
      console.log("hang up the call");
    };
    const answer = () => {
      console.log("answer the call");
    };

    const call = () => {
      const call = peer.call(idInput.value, localStream.value);

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
      });
    };

    onMounted(() => {
      navigator.mediaDevices
        // .getUserMedia({ video: true, audio: true })
        .getUserMedia({ video: true })
        .then((stream) => {
          localVideo.value.srcObject = localStream.value = stream;

          console.log("local stream: ", stream);
        });
    });

    return {
      myId,
      call,
      answer,
      hangUp,
      idInput,
      localVideo,
      toggleVideo,
      toggleAudio,
      remoteVideo,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-chat {
  max-width: 700px;
  margin: auto;
  // border: 1px solid;
}
video {
  width: 300px;
  height: 300px;
  border: 1px solid;
}
</style>
