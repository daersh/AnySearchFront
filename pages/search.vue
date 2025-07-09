<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen p-4">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-8 md:w-10">
      <div class="text-center mb-5">
        <i class="pi pi-search text-blue-500 text-4xl mb-3"></i>
        <div class="text-900 text-3xl font-medium mb-3">AnySearch</div>
        <span class="text-600 font-medium">Find anything you need</span>
      </div>

      <div class="p-inputgroup mb-5">
        <InputText placeholder="Enter your search query" class="w-full" v-model="searchQuery" @keyup.enter="search" />
        <Button icon="pi pi-search" class="p-button-primary" @click="search" />
      </div>

      <div v-if="results" class="grid">
        <div v-for="result in results" :key="result.id" class="col-12 md:col-6 lg:col-4">
          <div class="surface-100 p-3 border-round shadow-1 h-full">
            <div class="text-900 font-medium text-xl mb-2">{{ result.textfield }}</div>
            <div class="text-700">{{ result.keywordfield }}</div>
          </div>
        </div>
      </div>

      <div v-if="error" class="text-red-500 text-center mt-5">
        <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
        <p class="text-lg">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const results = ref(null);
const error = ref(null);

const search = async () => {
  if (!searchQuery.value) {
    return;
  }
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/search/analyzer', {
      params: {
        sample: searchQuery.value,
        page: 0,
        size: 10,
      },
    });
    results.value = response;
    error.value = null;
  } catch (e) {
    error.value = e.message;
    results.value = null;
  }
};
</script>
