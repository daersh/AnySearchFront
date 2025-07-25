<template>
  <div class="p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-content-between align-items-center mb-6">
        <h1 class="text-3xl font-bold">AnyData Management</h1>
        <Button label="Add New" icon="pi pi-plus" @click="showAddDialog = true" />
      </div>

      <div class="p-card">
        <DataTable :value="anyDataList" responsiveLayout="scroll">
          <Column field="type" header="Type" :sortable="true"></Column>
          <Column field="title" header="Title" :sortable="true"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="isActive" header="Active">
            <template #body="slotProps">
              <i :class="['pi', slotProps.data.isActive ? 'pi-check-circle text-green-500' : 'pi-times-circle text-red-500']"></i>
            </template>
          </Column>
          <Column header="Actions" style="width: 8rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-text mr-2" @click="editAnyData(slotProps.data)" />
              <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteAnyData(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="flex justify-content-between align-items-center mt-5">
        <Button label="Previous" icon="pi pi-angle-left" @click="prevPage" :disabled="currentPage === 0" />
        <span>Page {{ currentPage + 1 }}</span>
        <Button label="Next" icon="pi pi-angle-right" iconPos="right" @click="nextPage" :disabled="isEnd" />
      </div>
    </div>

    <Dialog v-model:visible="showAddDialog" header="Add New AnyData" :modal="true" class="p-fluid w-full md:w-1/2">
      <div class="field">
          <label for="type">Type</label>
          <InputText id="type" v-model="newAnyData.type" required autofocus />
        </div>
        <div class="field">
          <label for="title">Title</label>
          <InputText id="title" v-model="newAnyData.title" required />
        </div>
        <div class="field">
          <label for="description">Description</label><br>
          <InputTextarea id="description" v-model="newAnyData.description" rows="3" cols="120" />
        </div>
        <div class="field">
          <label for="addInfo">Additional Info (e.g., price†tag)</label>
          <InputText id="addInfo" v-model="newAnyData.addInfo" />
        </div>
        <div class="field">
          <label for="addDetail">Additional Detail (e.g., 1000†new)</label>
          <InputText id="addDetail" v-model="newAnyData.addDetail" />
        </div>
        <div class="field-checkbox">
          <Checkbox id="isActive" v-model="newAnyData.isActive" :binary="true" />
          <label for="isActive">Is Active</label>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showAddDialog = false" />
          <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAnyData" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showEditDialog" header="Edit AnyData" :modal="true" class="p-fluid">
        <div class="field">
          <label for="editType">Type</label>
          <InputText id="editType" v-model="editingAnyData.type" required autofocus />
        </div>
        <div class="field">
          <label for="editTitle">Title</label>
          <InputText id="editTitle" v-model="editingAnyData.title" required />
        </div>
        <div class="field">
          <label for="editDescription">Description</label>
          <InputTextarea id="editDescription" v-model="editingAnyData.description" rows="3" cols="20" />
        </div>
        <div class="field">
          <label for="editAddInfo">Additional Info (e.g., price†tag)</label>
          <InputText id="editAddInfo" v-model="editingAnyData.addInfo" />
        </div>
        <div class="field">
          <label for="editAddDetail">Additional Detail (e.g., 1000†new)</label>
          <InputText id="editAddDetail" v-model="editingAnyData.addDetail" />
        </div>
        <div class="field-checkbox">
          <Checkbox id="editIsActive" v-model="editingAnyData.isActive" :binary="true" />
          <label for="editIsActive">Is Active</label>
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showEditDialog = false" />
          <Button label="Update" icon="pi pi-check" class="p-button-text" @click="updateAnyData" />
        </template>
      </Dialog>
      
      <ConfirmDialog></ConfirmDialog>
      <Toast />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputTextarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import ConfirmDialog from 'primevue/confirmdialog';
import Message from 'primevue/message';


const { $apiFetch } = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();
const isEnd = ref(false);
const anyDataList = ref([]);
const currentPage = ref(0);
const pageSize = ref(10); // Number of items to load per scroll
const loading = ref(false);
const hasMoreData = ref(true);

const newAnyData = ref({
  type: '',
  title: '',
  description: '',
  addInfo: '',
  addDetail: '',
  isActive: true,
});

onMounted(() => {
  fetchAnyData();
});

onUnmounted(() => {
});

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchAnyData();
  }
};

const nextPage = () => {
  if (!isEnd.value) {
    currentPage.value++;
    fetchAnyData();
  }
};

const fetchAnyData = async () => {
  if (loading.value || !hasMoreData.value) return;
  loading.value = true;
  try {
    const response = await $apiFetch('/api/any_data/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
      },
    });
    if (response.length > 0) {
      anyDataList.value = [...response];
      if (response.length < pageSize.value) 
        isEnd.value = true;
    } else {
      hasMoreData.value = false;
    }
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch AnyData', life: 3000 });
    console.error('Failed to fetch AnyData:', error);
  } finally {
    loading.value = false;
  }
};

const showAddDialog = ref(false);

const saveAnyData = async () => {
  try {
    await $apiFetch('/api/any_data', {
      method: 'POST',
      body: newAnyData.value,
    });
    toast.add({ severity: 'success', summary: 'Success', detail: 'AnyData added', life: 3000 });
    showAddDialog.value = false;
    resetNewAnyData();
    fetchAnyData();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add AnyData', life: 3000 });
    console.error('Failed to add AnyData:', error);
  }
};

const editingAnyData = ref(null);
console.log('editingAnyData declared:', editingAnyData.value);
const showEditDialog = ref(false);

// ...
const editAnyData = (data) => {
  console.log('editAnyData called with data:', data);
  editingAnyData.value = { ...data };
  console.log('editingAnyData after assignment:', editingAnyData.value);
  showEditDialog.value = true;
};

const updateAnyData = async () => {
  try {
    await $apiFetch('/api/any_data', {
      method: 'PUT',
      body: editingAnyData.value,
    });
    toast.add({ severity: 'success', summary: 'Success', detail: 'AnyData updated', life: 3000 });
    showEditDialog.value = false;
    editingAnyData.value = null;
    currentPage.value = 0; 
    isEnd.value = false; 
    fetchAnyData();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update AnyData', life: 3000 });
    console.error('Failed to update AnyData:', error);
  }
};

const confirmDeleteAnyData = (data) => {
  confirm.require({
    message: 'Are you sure you want to delete this AnyData entry?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await $apiFetch(`/api/any_data?id=${data.id}`, {
          method: 'DELETE',
        });
        toast.add({ severity: 'success', summary: 'Success', detail: 'AnyData deleted', life: 3000 });
        fetchAnyData();
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete AnyData', life: 3000 });
        console.error('Failed to delete AnyData:', error);
      }
    },
  });
};

const resetNewAnyData = () => {
  newAnyData.value = {
    type: '',
    title: '',
    description: '',
    addInfo: '',
    addDetail: '',
    isActive: true,
  };
};
</script>
