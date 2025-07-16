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
          <Select
            v-model="selectedOption"
            :options="dropdownOptions"
            optionLabel="label"
            placeholder="Select an option"
            class="w-full"
            @change="searchStart"
          />
        </div>
      </div>

       <div class="p-inputgroup mb-5" style="position: relative;"> <InputText placeholder="Enter your search query" class="w-full" v-model="searchQuery" @keyup.enter="searchStart"/>
      <Button icon="pi pi-search" class="p-button-primary" @click="searchStart" />

      <div v-if="autoKeyWords.length" class="suggestions-list">
        <ul>
          <li v-for="keyword in autoKeyWords" :key="keyword" @click="selectSuggestion(keyword)" >
            {{ keyword }}
          </li>
        </ul>
      </div>
    </div>
      
      <div v-if="results.length" class="">
        <div>
          totalCount: {{ totalCount }}
        </div>
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
          <p class="p-button-text">{{ currentPage+1 }}</p>
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
import { debounce } from 'lodash';

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


const autoKeyWords = ref([]);
const autoComplete = async () => {
  const { $apiFetch } = useNuxtApp();
  console.log('Auto-complete triggered with query:', searchQuery.value);

  if (!searchQuery.value.trim()) {
    autoKeyWords.value = [];
    console.log('Search query is empty, clearing suggestions.');
    return; // 여기서 함수 종료
  }

  const response = await $apiFetch('/api/search/auto_completion', {
    params: {
      query: searchQuery.value,
      type: selectedOption.value ? selectedOption.value.value : 'anydata'
    }
  });
  console.log('Auto-complete response:', response);
  autoKeyWords.value = response;
};

const debouncedFetchSuggestions = debounce(autoComplete, 300); 

watch(searchQuery, (newValue, oldValue) => {
  debouncedFetchSuggestions();
});

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  autoKeyWords.value = [];       
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


<style scoped>
/* p-inputgroup에 position: relative를 명시적으로 추가 */
.p-inputgroup {
  position: relative; /* 자식 요소의 absolute 위치 기준점이 됩니다. */
}

.suggestions-list {
  /* 검색창 아래에 정확히 위치시키기 위한 설정 */
  position: absolute; /* 부모(p-inputgroup) 기준으로 위치를 잡습니다. */
  top: 100%;          /* 검색창 높이만큼 아래로 내려옵니다. */
  left: 0;            /* 검색창과 왼쪽 정렬 */
  width: 100%;        /* 검색창과 같은 너비를 가집니다. */
  z-index: 100;       /* 다른 요소 위에 표시되도록 z-index를 높게 설정합니다. */

  /* 목록 스타일 */
  background-color: darkgray;
  border: 1px solid darkgray;
  border-top: none; /* 위쪽 보더는 없애서 검색창에 붙은 것처럼 보이게 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과로 입체감 부여 */
  max-height: 200px;  /* 목록이 너무 길어지지 않도록 최대 높이 설정 */
  overflow-y: auto;   /* 최대 높이를 넘으면 스크롤바 생성 */
  list-style: none; /* 기본 리스트 스타일 제거 */
  padding: 0;         /* 기본 패딩 제거 */
  margin: 0;          /* 기본 마진 제거 */
}

.suggestions-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 8px 10px;
  cursor: pointer;
  white-space: nowrap; /* 제안이 길어져도 줄바꿈되지 않게 */
  overflow: hidden;    /* 넘치는 텍스트는 숨김 */
  text-overflow: ellipsis; /* 숨겨진 텍스트에 ... 표시 */
}

.suggestions-list li:hover {
  background-color: darkgray;
}
</style>