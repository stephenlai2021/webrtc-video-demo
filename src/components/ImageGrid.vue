<template>
  <transition-group tag="div" name="grid" appear class="img-grid">
    <!-- <div v-for="img in documents" :key="img.id" class="img-wrap"> -->
    <div v-for="img in store.state.documents" :key="img.id" class="img-wrap">
      <img :src="img.url" />
    </div>
  </transition-group>
</template>

<script>
import { onMounted, inject } from "vue";
import useCollection from "../composables/useCollection";

export default {
  setup() {
    // const { documents, documentsError } = useCollection("images");

    const store = inject("store");

    onMounted(() => {
      store.methods.useCollection("images");
    });

    return { store };
  },
};
</script>

<style lang="scss" scoped>
.img-grid {
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 40px;
}
.img-wrap {
  overflow: hidden;
  height: 0;
  padding: 50% 0;
  position: relative;
  opacity: 0.8;
}
.img-wrap img {
  min-width: 100%;
  min-height: 100%;
  max-width: 180%;
  position: absolute;
  top: 0;
  left: 0;
}

/* transition classes */
.grid-enter-from {
  opacity: 0;
}
.grid-enter-to {
  opacity: 1;
}
.grid-enter-active {
  transition: all 3s ease;
}
.grid-move {
  transition: all 0.5s ease;
}
</style>
