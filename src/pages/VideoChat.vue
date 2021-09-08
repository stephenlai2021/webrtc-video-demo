<template>
  <q-page class="page-chat">
    <p class="q-mt-md text-center">My id: {{ myId }}</p>
    <div class="row justify-center">
      <div style="position: relative" class="q-mx-sm">
        <video class="local-video" ref="localVideo" autoplay />
        <div
          class="row justify-center"
          style="position: absolute; bottom: 60px; left: 0; width: 100%"
        >
          <q-btn
            dense
            v-if="pause && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-play-circle-outline"
            @click="resumeVideo"
          />
          <q-btn
            dense
            v-if="!pause && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-pause-circle-outline"
            @click="pauseVideo"
          />
          <q-btn
            dense
            v-if="videoOn"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-video-outline"
            @click="toggleVideo"
          />
          <q-btn
            dense
            v-else
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-video-off-outline"
            @click="toggleVideo"
          />
          <q-btn
            dense
            v-if="audioOn && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-volume-up-outline"
            @click="toggleAudio"
          />
          <q-btn
            dense
            v-if="!audioOn && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            icon="eva-volume-off-outline"
            style="opacity: 0.7"
            @click="toggleAudio"
          />
          <div class="full-width text-center q-mt-md">
            <q-btn
              dense
              round
              color="red"
              style="opacity: 0.7"
              class="q-mx-sm"
              icon="eva-phone-off-outline"
              @click="hangUp"
            />
          </div>
        </div>
        <p class="text-center">Local</p>
      </div>
      <div class="q-mx-sm">
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
        <q-btn no-caps label="Hang Up" @click="hangUp" />
      </q-btn-group>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    console.log($q.dark.isActive);
    console.log($q.dark.mode);

    const idInput = ref("");
    const myId = ref("");
    const localVideo = ref(null);
    const remoteVideo = ref(null);
    const localStream = ref(null);
    const videoOn = ref(false);
    const audioOn = ref(false);
    const pause = ref(false);
    const cameraEnabled = ref(false);
    const callAnswered = ref(false);

    // connect to Peer server
    const peer = new Peer();

    // get a random id assigned by Peer server
    peer.on("open", (id) => {
      myId.value = id;
    });

    peer.on("call", (call) => {
      const acceptCall = confirm("Do you want to answer this call ?");

      if (acceptCall) {
        call.answer(localStream.value);

        call.on("stream", (remoteStream) => {
          remoteVideo.value.srcObject = remoteStream;
        });
      }
    });

    const hangUp = () => {
      console.log("close connection");

      peer.destroy();
    };

    const call = () => {
      const call = peer.call(idInput.value, localStream.value);

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
      });
    };

    const answer = () => {
      callAnswered.value = true;
    };

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
          videoOn.value = true;
          audioOn.value = true;

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

    onBeforeUnmount(() => {
      closeCamera();
    });

    onMounted(() => {
      openCamera();
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
      openCamera,

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
  width: 100%;
  // height: 300px;
  // border: 1px solid;
}
</style>
