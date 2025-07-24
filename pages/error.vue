<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-surface-ground text-center">
    <div class="mb-4">
      <i class="pi pi-times-circle" style="font-size: 5rem; color: var(--primary-color);"></i>
    </div>
    <h1 class="text-5xl font-bold mb-3">{{ error.statusCode }} - {{ error.statusMessage || 'An Error Occurred' }}</h1>
    <p class="text-xl text-color-secondary mb-5">{{ error.message || 'Something went wrong on our end.' }}</p>
    <Button label="Go to Home" icon="pi pi-home" @click="handleClearError" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  error: Object
});

const handleClearError = () => {
  clearError({ redirect: '/' });
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>