<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen p-4">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6 md:w-8">
      <div class="text-center mb-5">
        <i class="pi pi-server text-blue-500 text-4xl mb-3"></i>
        <div class="text-900 text-3xl font-medium mb-3">Job Management</div>
        <span class="text-600 font-medium">Trigger batch jobs</span>
      </div>

      <div class="flex justify-content-center">
        <Button label="Trigger AnyData Batch Job" icon="pi pi-play" class="p-button-primary" @click="triggerAnyDataJob" />
      </div>

      <div v-if="message" class="text-center mt-4">
        <Message severity="info">{{ message }}</Message>
      </div>
      <div v-if="error" class="text-red-500 text-center mt-4">
        <Message severity="error">{{ error }}</Message>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Message from 'primevue/message';

const message = ref(null);
const error = ref(null);

const triggerAnyDataJob = async () => {
  message.value = null;
  error.value = null;
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/any_data', {
      method: 'GET',
    });
    message.value = response;
  } catch (e) {
    error.value = e.message;
  }
};
</script>
