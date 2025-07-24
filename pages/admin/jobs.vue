<template>
  <div class="p-8">
    <div class="max-w-2xl mx-auto">
      <div class="p-card p-5 text-center">
        <i class="pi pi-server text-primary text-4xl mb-3"></i>
        <h1 class="text-3xl font-bold mb-3">Job Management</h1>
        <p class="text-color-secondary mb-5">Trigger and monitor batch jobs.</p>

        <div class="flex justify-content-center gap-3">
          <Button v-if="activeButton" label="Trigger AnyData Batch Job" icon="pi pi-play" @click="triggerAnyDataJob" />
          <Button v-else label="Check Job Health" icon="pi pi-heartbeat" class="p-button-secondary" @click="checkJobHealth" />
        </div>

        <div v-if="message" class="mt-5">
          <Message severity="info" :closable="false">{{ message }}</Message>
        </div>
        <div v-if="error" class="mt-5">
          <Message severity="error" :closable="false">{{ error }}</Message>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});
import { ref } from 'vue';
import Button from 'primevue/button';
import Message from 'primevue/message';

const activeButton = ref(false);

const message = ref(null);
const error = ref(null);

const triggerAnyDataJob = async () => {
  message.value = null;
  error.value = null;
  activeButton.value = false;
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/any_data', {
      method: 'GET',
    });
    message.value = response;
    if(response === "already job started"){
      activeButton.value = false;
    } else {
      activeButton.value = true;
    }
  } catch (e) {
    error.value = e.message;
  }
};

const checkJobHealth = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/any_data/health', {
      method: 'GET',
    });
    if (response === 'ready') {
      message.value = response;
      activeButton.value = true;
    } else {
      message.value = response;
      activeButton.value = false;
    }
  } catch (e) {
    error.value = e.message;
  }
};
checkJobHealth();
</script>
