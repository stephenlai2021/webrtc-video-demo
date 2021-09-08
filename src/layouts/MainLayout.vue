<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar Demo </q-toolbar-title>

        <q-btn
          dense
          round
          style="margin-left: auto"
          icon="eva-moon-outline"
          @click="toggleDark"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Emoji Button",
    link: "/emoji",
  },
  {
    title: "I18N",
    link: "/i18n",
  },
  {
    title: "Upload",
    link: "/upload",
  },
  {
    title: "Video Chat",
    link: "/videochat",
  },
];

import { useQuasar } from "quasar";
import { defineComponent, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const route = useRoute();
    const router = useRouter();

    const darkMode = ref(false);
    const leftDrawerOpen = ref(false);

    const toggleDark = () => {
      darkMode.value = !darkMode.value;

      if (darkMode.value) {
        $q.dark.set(true);
      }
      if (!darkMode.value) {
        $q.dark.set(false);
      }
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      store,
      route,
      router,

      essentialLinks: linksList,
      leftDrawerOpen,

      toggleDark,
      toggleLeftDrawer,
    };
  },
});
</script>
