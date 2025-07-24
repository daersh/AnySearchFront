<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">File Search</h1>
        <p class="text-lg text-color-secondary">Search and discover files.</p>
      </div>

      <div class="p-card p-4 mb-5">
        <div class="p-inputgroup">
          <InputText placeholder="Enter your file search query" v-model="searchQuery" @keyup.enter="searchStart"/>
          <Button icon="pi pi-times" class="p-button-secondary" @click="clearSearchQuery" v-if="searchQuery" />
          <Button icon="pi pi-search" class="p-button-primary" @click="searchStart" />
        </div>
      </div>

      <div v-if="results.length" class="mb-4">
        <div class="mb-4 text-sm text-color-secondary">
          Showing {{ results.length }} of {{ totalCount }} results.
        </div>
        <div class="grid" >
          <div v-for="result in results" :key="result.id" class="col-12">
            <div class="p-card p-4">
              <div class="text-xl font-semibold mb-2">{{ result.title }}</div>
              <p class="text-color-secondary mb-3">
                <template v-if="result.description && result.description.length > 200">
                  {{ result.showFullDescription ? result.description : result.description.substring(0, 200) + '...' }}
                  <Button :label="result.showFullDescription ? 'Read Less' : 'Read More'" class="p-button-link p-0" @click="result.showFullDescription = !result.showFullDescription" />
                </template>
                <template v-else>
                  {{ result.description }}
                </template>
              </p>
              <div v-if="result.additionalFields" class="text-sm">
                <div v-for="(value, key) in result.additionalFields" :key="key">
                  <strong>{{ key }}:</strong> {{ value }}
                </div>
              </div>
              <div class="text-sm">
                <strong>Uploaded on:</strong> {{ result.date }}
              </div>
            </div>
          </div>
        </div>


        <div class="flex justify-content-between align-items-center mt-5">
          <Button label="Previous" icon="pi pi-angle-left" @click="prevPage" :disabled="currentPage === 0" />
          <span>Page {{ currentPage + 1 }}</span>
          <Button label="Next" icon="pi pi-angle-right" iconPos="right" @click="nextPage" :disabled="isEnd" />
        </div>
      </div>

      <div v-else-if="searchPerformed && !results.length" class="text-center mt-5">
        <i class="pi pi-info-circle text-blue-500 text-4xl mb-3"></i>
        <p class="text-xl">No results found for your query.</p>
      </div>

      <div v-if="error" class="text-center mt-5">
        <i class="pi pi-times-circle text-red-500 text-4xl mb-3"></i>
        <p class="text-xl">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import _ from 'lodash';
const debounce = _.debounce;

const route = useRoute();

const searchQuery = ref('');
const results = ref([]);
const error = ref(null);
const searchPerformed = ref(false); // Track if a search has been performed

const currentPage= ref(0);
const isEnd = ref(false);
const totalCount = ref(0);

onMounted(() => {
  if (route.query.query) {
    searchQuery.value = route.query.query;
    searchStart();
  }
});

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
  searchPerformed.value = true; // Set search performed flag
  search();
}

const clearSearchQuery = () => {
  searchQuery.value = '';
  results.value = [];
  error.value = null;
  searchPerformed.value = false; // Reset search performed flag
};

const search = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/search/analyzer2', {
      params: {
        request: searchQuery.value,
        type: 'anydata_file', // Always search for files
        page: currentPage.value,
        size: 3,
      },
    });
    results.value = [];
    totalCount.value = response.count;
    isEnd.value = response.count <= (currentPage.value + 1) * 3;
    for (const item of response.docs) {
     
      results.value.push({
        id: item.id,
        title: item.title== null ? item.filename : item.title,
        description: item.description== null ? item.attachment.content : item.description,
        additionalFields: item.additionalFields,
        type: item.type,
        //"2025-07-24T05:15:28.313027700Z"
        date: item.uploadedAt ? item.uploadedAt : '',
        showFullDescription: false // Add this property
      });
    }
    error.value = null;
  } catch (e) {
    error.value = e.message;
    results.value = [];
  }
};
</script>


<style scoped>
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-top: none;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
}

.suggestions-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid var(--surface-border);
}

.suggestions-list li:last-child {
  border-bottom: none;
}

.suggestions-list li:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.p-inputgroup {
  position: relative;
}
</style>