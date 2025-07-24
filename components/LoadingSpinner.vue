<template>
  <div v-if="isLoading" class="loading-overlay">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" aria-label="Loading" />
  </div>
</template>

<script setup>
import { useLoading } from '~/composables/useLoading';
import ProgressSpinner from 'primevue/progressspinner';

const { isLoading } = useLoading();
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top of other content */
}
</style>