<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen p-4">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-8 md:w-10">
      <div class="text-center mb-5">
        <i class="pi pi-search text-blue-500 text-4xl mb-3"></i>
        <div class="text-900 text-3xl font-medium mb-3">AnySearch</div>
        <span class="text-600 font-medium">Find anything you need</span>
      </div>
      <div>
        <div class="mb-4">
          <Dropdown
            v-model="selectedOption"
            :options="dropdownOptions"
            optionLabel="label"
            placeholder="Select an option"
            class="w-full"
            @change="searchStart"
          />
        </div>
      </div>

      <div class="p-inputgroup mb-5">
        <InputText placeholder="Enter your search query" class="w-full" v-model="searchQuery" @keyup.enter="searchStart" />
        <Button icon="pi pi-search" class="p-button-primary" @click="searchStart" />
      </div>

      <div v-if="results.length" class="">
        <div v-for="result in results" :key="result.id" class="">
          <div class="surface-100 p-3 border-round shadow-1 h-full" style="margin-bottom: 5px;">
            <div class="text-900 font-medium text-xl mb-2">{{ result.title }}</div>
            <div class="text-700">{{ result.description }}</div>
            <div v-if="result.additionalFields" class="mt-2">
              <div v-for="(value, key) in result.additionalFields" :key="key" class="text-sm text-600">
                <strong>{{ key }}:</strong> {{ value }}
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
          <Button label="Prev" icon="pi pi-chevron-left" class="p-button-text" @click="prevPage" :disabled="currentPage==0" />
          <Button label="Next" icon="pi pi-chevron-right" class="p-button-text" @click="nextPage" :disabled="isEnd" />
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
const results = ref([]);
const error = ref(null);

const selectedOption = ref(null);
const dropdownOptions = ref([]);
const currentPage= ref(0);
const isEnd = ref(false);
const totalCount = ref(0);

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    search();
  }
};

const nextPage = () => {
  if (!isEnd.value) {
    currentPage.value++;
    search();
  }
};
const searchStart = () => {
  currentPage.value = 0;
  isEnd.value = false;
  search();
}

const getDropdownOptions = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/any_data/type');
    console.log('Dropdown options response:', response);
    dropdownOptions.value.push({ label: 'anydata', value: "anydata" });
    for (const item of response) {
      dropdownOptions.value.push({ label: item, value: "anydata_" + item });
    }

  } catch (e) {
    console.error('Failed to fetch dropdown options:', e);
    return [];
  }
};
getDropdownOptions();


const search = async () => {
  if (!searchQuery.value) {
    return;
  }
  try {
    const { $apiFetch } = useNuxtApp();
    console.log('Search query:', searchQuery.value, 'Selected option:', selectedOption.value.value);
    const response = await $apiFetch('/api/search/analyzer2', {
      params: {
        request: searchQuery.value,
        type: selectedOption.value.value,
        page: currentPage.value,
        size: 3,
      },
    });
    results.value = [];
    totalCount.value = response.count;
    isEnd.value = response.count <= (currentPage.value + 1) * 3
    for (const item of response.docs) {
      results.value.push({
        id: item.id,
        title: item.title,
        description: item.description,
        additionalFields: item.additionalFields,
      });
    }
    console.log('Search results:', results.value);
    error.value = null;
  } catch (e) {
    error.value = e.message;
    results.value = null;
  }
};
</script>
