<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-surface-ground text-center">
    <div class="mb-4">
      <i class="pi pi-exclamation-triangle" style="font-size: 5rem; color: var(--primary-color);"></i>
    </div>
    <h1 class="text-5xl font-bold mb-3">404 - Page Not Found</h1>
    <p class="text-xl text-color-secondary mb-5">The page you are looking for does not exist.</p>
    <Button label="Go to Home" icon="pi pi-home" @click="navigateToHome" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>