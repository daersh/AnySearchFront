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
        <div class="grid-container">
          <div v-for="result in results" :key="result.id" class="col-custom">
            <div class="search-result-card cursor-pointer" @click="openLink(result)">
              <div class="visible-part">
                <img v-if="result.additionalFields && result.additionalFields.image" :src="result.additionalFields.image" :alt="result.title + ' image'" class="card-img-top">
                <div v-else class="image-placeholder">
                  <span>No Image</span>
                </div>
                <div class="title-container">
                  <p class="card-title">{{ result.title }}</p>
                </div>
              </div>
              <div class="hidden-part">
                <h6 class="hidden-title">{{ result.title }}</h6>
                <p class="card-description">{{ result.description }}</p>
                <div class="additional-info">
                  <div v-if="result.additionalFields" class="text-sm">
                    <div v-for="(value, key) in result.additionalFields" :key="key">
                      <template v-if="key !== 'image' && key !== 'link'">
                        <strong>{{ key }}:</strong> 
                        <span>{{ value }}</span>
                      </template>
                    </div>
                  </div>
                  <div><strong>생성일:</strong> {{ result.createdAt }}</div>
                  <div><strong>수정일:</strong> {{ result.updatedAt }}</div>
                </div>
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

const openLink = (result) => {
  if (result.additionalFields && result.additionalFields.link) {
    window.open(result.additionalFields.link, '_blank');
  }
};

const search = async () => {
  try {
    const { $apiFetch } = useNuxtApp();
    const response = await $apiFetch('/api/search/analyzer2', {
      params: {
        request: searchQuery.value,
        type: "anydata_naver",
        page: currentPage.value,
        size: 20,
      },
    });
    results.value = [];
    totalCount.value = response.count;
    isEnd.value = response.count <= (currentPage.value + 1) * 20;
    console.log(response.docs);
    for (const item of response.docs) {
      console.log("item: ", item);
      results.value.push({
        id: item.id,
        title: item.title== null ? item.filename : item.title,
        description: item.description== null ? item.attachment.content : item.description,
        additionalFields: item.additionalFields,
        type: item.type,
        //"2025-07-24T05:15:28.313027700Z"
        createdAt: item.createdAt ,
        updatedAt: item.updatedAt
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Adjusted minmax */
  gap: 2rem; /* Increased gap */
  padding: 1rem; /* Added padding to contain scaled cards */
}

.col-custom {
  display: flex;
  justify-content: center;
}

.search-result-card {
  width: 240px; /* Increased width */
  height: 320px; /* Increased height */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: var(--surface-card);
}

.search-result-card:hover {
  transform: scale(1.1); /* Zoom in on hover */
  box-shadow: 0 12px 24px rgba(0,0,0,0.2);
  z-index: 10; /* Bring the card to the front */
}

.visible-part {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #2a2a2a; /* Dark background for the card's visible part */
}

.card-img-top {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3a3a3a; /* Darker placeholder background */
  color: #6c6c6c; /* Adjusted placeholder text color */
}

.title-container {
  padding: 1rem;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card-title {
  font-weight: bold;
  font-size: 1rem;
  color: #e5e5e5; /* Light text color for the title */
  margin: 0;
}

.hidden-part {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.search-result-card:hover .hidden-part {
  opacity: 1;
}

.hidden-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #FFD700; /* Gold color for emphasis */
}

.card-description {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.additional-info {
  font-size: 0.8rem;
  border-top: 1px solid #555;
  padding-top: 0.5rem;
}

.additional-info strong {
  color: #FFD700;
}
</style>