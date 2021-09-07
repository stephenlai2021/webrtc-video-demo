<template>
  <q-page padding>
    <q-btn label="English" @click="locale = 'en-US'" />
    <q-btn label="French" @click="locale = 'fr'" />
    <q-btn label="Chinese" @click="locale = 'zh'" />

    <q-separator class="q-my-lg" />

    <q-btn :label="t('failed')" />
    <q-btn :label="t('success')" />

    <q-separator class="q-my-lg" />
    
    <p>{{ t('failed') }}</p>
    <p>{{ t('success') }}</p>
  </q-page>
</template>

<script>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()

    onMounted(() => {
      console.log('failed: ', t('failed'))
      console.log('success: ', t('success'))
    })

    return {
      t, 
      locale
    }
  }
}
</script>
