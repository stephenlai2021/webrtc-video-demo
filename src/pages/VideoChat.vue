<template>
  <q-page class="page-chat">
    <p class="q-mt-md text-center">My id: {{ myId }}</p>
    <div class="row justify-center">
      <div style="position: relative" class="q-mx-md">
        <video ref="localVideo" autoplay />
        <div
          class="row justify-center"
          style="position: absolute; bottom: 90px; left: 0; width: 100%"
        >
          <q-btn
            v-if="pause && cameraEnabled"
            flat
            round
            color="white"
            icon="eva-play-circle-outline"
            @click="resumeVideo"
          />
          <q-btn
            v-if="!pause && cameraEnabled"
            flat
            round
            color="white"
            icon="eva-pause-circle-outline"
            @click="pauseVideo"
          />
          <q-btn
            v-if="videoOn"
            flat
            round
            color="white"
            icon="eva-video-outline"
            @click="toggleVideo"
          />
          <q-btn
            v-else
            flat
            round
            color="white"
            icon="eva-video-off-outline"
            @click="toggleVideo"
          />
          <q-btn
            v-if="audioOn && cameraEnabled"
            flat
            round
            color="white"
            icon="eva-volume-up-outline"
            @click="toggleAudio"
          />
          <q-btn
            v-if="!audioOn && cameraEnabled"
            flat
            round
            color="white"
            icon="eva-volume-off-outline"
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
        <q-btn no-caps label="Open" @click="call" />
        <q-btn no-caps label="Call" @click="call" />
        <q-btn no-caps label="Answer" @click="answer" />
        <q-btn no-caps label="Hang Up" @click="hangUp" />
      </q-btn-group>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const idInput = ref("");
    const myId = ref("");
    const localVideo = ref(null);
    const remoteVideo = ref(null);
    const localStream = ref(null);
    const videoOn = ref(false);
    const audioOn = ref(false);
    const pause = ref(false);
    const cameraEnabled = ref(false);

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

    const playVideo = () => {
      console.log("play video");
    };

    const pauseVideo = () => {
      console.log("pause video");

      pause.value = true;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    const resumeVideo = () => {
      console.log("resume video");

      pause.value = false;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const toggleVideo = () => {
      videoOn.value = !videoOn.value;

      if (videoOn.value) {
        openCamera();
      }

      if (!videoOn.value) {
        closeCamera();
      }

      console.log("video on: ", videoOn.value);
    };

    const toggleAudio = () => {
      audioOn.value = !audioOn.value;

      if (audioOn.value) {
        openAudio();
      }

      if (!audioOn.value) {
        closeAudio();
      }

      console.log("video on: ", videoOn.value);
    };

    const openCamera = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideo.value.srcObject = localStream.value = stream;

          cameraEnabled.value = true;
          console.log("local stream: ", stream);
        });
    };

    const closeCamera = () => {
      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.stop();

        cameraEnabled.value = false;
      });
    };

    const openAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const closeAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    const hangUp = () => {
      console.log("close connection");

      // peer.on("close", () => {
      //   closeCamera();
      // });

      peer.destory();
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

    onBeforeUnmount(() => {
      closeCamera();
    });

    onMounted(() => {
      openCamera();

      videoOn.value = true;
      audioOn.value = true;
    });

    return {
      myId,
      idInput,

      call,
      answer,
      hangUp,

      pause,
      cameraEnabled,

      videoOn,
      audioOn,

      playVideo,
      pauseVideo,
      resumeVideo,

      localVideo,
      remoteVideo,

      toggleVideo,
      toggleAudio,
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
