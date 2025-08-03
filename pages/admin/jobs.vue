<template>
  <div class="grid grid-nogutter">
    <div class="p-8">
      <div class="max-w-2xl mx-auto">
        <div class="p-card p-5 text-center">
          <i class="pi pi-server text-primary text-4xl mb-3"></i>
          <h1 class="text-3xl font-bold mb-3">AnyData Management</h1>
          <p class="text-color-secondary mb-5">Trigger and monitor batch jobs.</p>
          
          <div class="flex justify-content-center gap-3">
            <Button v-if="anyDataButton" label="Trigger AnyData Batch Job" icon="pi pi-play" @click="triggerAnyDataJob" />
            <Button v-else label="Check Job Health" icon="pi pi-heartbeat" class="p-button-secondary" @click="checkJobHealth" />
          </div>
          
          <div v-if="anydataMessage" class="mt-5">
            <Message severity="info" :closable="false">{{ anydataMessage }}</Message>
          </div>
          <div v-if="error" class="mt-5">
            <Message severity="error" :closable="false">{{ error }}</Message>
          </div>
        </div>
      </div>
    </div>
    <div class="p-8">
      <div class="max-w-2xl mx-auto">
        <div class="p-card p-5 text-center">
          <i class="pi pi-server text-primary text-4xl mb-3"></i>
          <h1 class="text-3xl font-bold mb-3">Naver Management</h1>
          <p class="text-color-secondary mb-5">Trigger and monitor batch jobs.</p>
          
          <div class="flex justify-content-center gap-3">
            <Button v-if="naverButton" label="Trigger Naver Batch Job" icon="pi pi-play" @click="triggerNaverJob" />
            <Button v-else label="Check Job Health" icon="pi pi-heartbeat" class="p-button-secondary" @click="checkNaverHealth" />
          </div>
          
          <div v-if="naverMessage" class="mt-5">
            <Message severity="info" :closable="false">{{ naverMessage }}</Message>
          </div>
          <div v-if="naverError" class="mt-5">
            <Message severity="error" :closable="false">{{ naverError }}</Message>
          </div>
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

const anyDataButton = ref(false);
const anydataMessage = ref(null);
const anyDataError = ref(null);

const naverButton = ref(false);
const naverMessage = ref(null);
const naverError = ref(null);

const triggerAnyDataJob = async () => {
  anydataMessage.value = null;
  anyDataError.value = null;
  anyDataButton.value = false;
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/any_data', {
      method: 'GET',
    });
    anydataMessage.value = response;
    if(response === "already job started"){
      anyDataButton.value = false;
    } else {
      anyDataButton.value = true;
    }
  } catch (e) {
    anyDataError.value = e.anydataMessage;
  }
};

const checkJobHealth = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/any_data/health', {
      method: 'GET',
    });
    if (response === 'ready') {
      anydataMessage.value = response;
      anyDataButton.value = true;
    } else {
      anydataMessage.value = response;
      anyDataButton.value = false;
    }
  } catch (e) {
    anyDataError.value = e.anydataMessage;
  }
};


const triggerNaverJob = async () => {
  naverMessage.value = null;
  naverError.value = null;
  naverButton.value = false;
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/naver', {
      method: 'GET',
    });
    naverMessage.value = response;
    if(response === "already job started"){
      naverButton.value = false;
    } else {
      naverButton.value = true;
    }
  } catch (e) {
    naverError.value = e.naverMessage;
  }
};

const checkNaverHealth = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/batch/naver/health', {
      method: 'GET',
    });
    if (response === 'ready') {
      naverMessage.value = response;
      naverButton.value = true;
    } else {
      naverMessage.value = response;
      naverButton.value = false;
    }
  } catch (e) {
    naverError.value = e.naverMessage;
  }
};
checkJobHealth();
checkNaverHealth();
</script>
