<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen p-4">
    <div class="surface-card p-4 shadow-2 border-round text-center">
      <i class="pi pi-star-fill text-blue-500 text-5xl mb-3"></i>
      <div class="text-900 text-4xl font-bold mb-3">Welcome to AnySearch!</div>
      <p class="text-600 text-lg mb-5">Your ultimate search experience starts here.</p>
      <Button label="Start Searching" icon="pi pi-search" class="p-button-primary p-button-lg" @click="navigateToSearch" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToSearch = () => {
  router.push('/search');
};
</script>