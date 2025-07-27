<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">AnySearch</h1>
        <p class="text-lg text-color-secondary">Find what you need, faster.</p>
      </div>

      <div class="p-card p-4 mb-5">
        <div class="grid formgrid p-fluid">
          <div class="field col-12 md:col-8" style="position: relative;">
            <div class="p-inputgroup">
              <InputText placeholder="Enter your search query" v-model="searchQuery" @keyup.enter="searchStart"/>
              <Button icon="pi pi-times" class="p-button-secondary" @click="clearSearchQuery" v-if="searchQuery" />
              <Button icon="pi pi-search" class="p-button-primary" @click="searchStart" />
            </div>
            <div v-if="autoKeyWords.length" class="suggestions-list">
              <ul>
                <li v-for="keyword in autoKeyWords" :key="keyword" @click="selectSuggestion(keyword)">
                  {{ keyword }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="results.length" class="mb-4">
        <div class="mb-4 text-sm text-color-secondary">
          Showing {{ results.length }} of {{ totalCount }} results.
        </div>
        <div class="grid">
    <div v-for="result in results" :key="result.id" class="col-12">
      <div class="p-card p-4">
        <div class="text-xl font-semibold mb-2">{{ result.title }}</div>
        <p class="text-color-secondary mb-3">
          {{ result.description }}
        </p>

        <div v-if="result.additionalFields && result.additionalFields.image" class="mb-3">
          <img :src="result.additionalFields.image" :alt="result.title + ' 추가 이미지'" style="max-width: 150px; height: auto; display: block; margin-bottom: 10px;">
        </div>
        
        <div v-if="result.additionalFields" class="text-sm">
          <div v-for="(value, key) in result.additionalFields" :key="key">
            <strong v-if="key !== 'image'">{{ key }}:</strong> 
            <span v-if="key !== 'image'">{{ value }}</span>
          </div>
        </div>
        <div class="text-sm">
          <strong>생성일:</strong> {{ result.createdAt }}
        </div>
        <div class="text-sm">
          <strong>수정일:</strong> {{ result.updatedAt }}
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

const selectedOption = ref(null);
const dropdownOptions = ref([]);
const currentPage= ref(0);
const isEnd = ref(false);
const totalCount = ref(0);
let blockAutocomplete = false;

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

const autoKeyWords = ref([]);

const autoComplete = async () => {
  const { $apiFetch } = useNuxtApp();
  const response = await $apiFetch('/api/search/auto_completion', {
    params: {
      query: searchQuery.value,
      type:'anydata_naver'
    }
  });
  autoKeyWords.value = response;
};

const debouncedFetchSuggestions = debounce(autoComplete, 300);

watch(searchQuery, (newValue) => {
  if (blockAutocomplete) {
    blockAutocomplete = false;
    autoKeyWords.value = [];
    return;
  }
  if (!newValue.trim()) {
    autoKeyWords.value = [];
    debouncedFetchSuggestions.cancel();
    return;
  }
  debouncedFetchSuggestions();
});

const selectSuggestion = (suggestion) => {
  debouncedFetchSuggestions.cancel();
  blockAutocomplete = true;
  searchQuery.value = suggestion;
  searchStart();
};

const nextPage = () => {
  if (!isEnd.value) {
    currentPage.value++;
    search();
  }
};

const searchStart = () => {
  autoKeyWords.value = [];
  debouncedFetchSuggestions.cancel();
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
  autoKeyWords.value = [];
  debouncedFetchSuggestions.cancel();
};

const search = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/search/analyzer2', {
      params: {
        request: searchQuery.value,
        type: "anydata_naver",
        page: currentPage.value,
        size: 3,
      },
    });
    results.value = [];
    totalCount.value = response.count;
    isEnd.value = response.count <= (currentPage.value + 1) * 3;
    console.log(response.docs);
    for (const item of response.docs) {
     
      results.value.push({
        id: item.id,
        title: item.title== null ? item.filename : item.title,
        description: item.description== null ? item.attachment.content : item.description,
        additionalFields: item.additionalFields,
        type: item.type,
        //"2025-07-24T05:15:28.313027700Z"
        createdDate: item.createdAt ? item.createdAt : 'Unknown',
        updateDate: item.updatedAt ? item.updatedAt : 'Unknown',
      });
    }
    console.log("datas: ", results);
    error.value = null;
  } catch (e) {
    error.value = e.message;
    results.value = [];
  }
};
search();
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