<template>
  <div class="p-grid p-fluid">
    <div class="p-col-12">
      <Card>
        <template #title>
          File Upload
        </template>
        <template #content>
          <Toast />

          <FileUpload 
            name="demo[]" 
            :multiple="true" 
            :maxFileSize="1000000"
            @select="onFileSelect"
            :customUpload="true"
            :auto="false"
            :showUploadButton="false"
            :showCancelButton="false"
          >
            <template #empty>
              <p>Drag and drop files to here to upload.</p>
            </template>
          </FileUpload>

          <div v-if="selectedFiles.length > 0" class="mt-4">
            <h3 class="text-lg font-medium mb-2">Selected Files:</h3>
            <ul class="list-none p-0 m-0">
              <li v-for="(file, index) in selectedFiles" :key="index" class="flex align-items-center mb-2 p-2 border-round"
                :class="{
                  'bg-green-100 text-green-800': file.status === 'success',
                  'bg-red-100 text-red-800': file.status === 'failed',
                  'bg-blue-100 text-blue-800': file.status === 'pending'
                }">
                <i :class="{
                  'pi pi-check-circle text-green-500': file.status === 'success',
                  'pi pi-times-circle text-red-500': file.status === 'failed',
                  'pi pi-spin pi-spinner text-blue-500': file.status === 'uploading',
                  'pi pi-file': file.status === 'pending'
                }" class="mr-2"></i>
                <span>{{ file.name }} ({{ formatSize(file.size) }})</span>
                <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger ml-auto" @click="removeFile(index)" />
              </li>
            </ul>
            <Button label="Upload Selected Files" icon="pi pi-upload" class="mt-4 w-full" @click="uploadSelectedFiles" :disabled="isUploading" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
});
import { ref, onMounted } from 'vue';
import FileUpload from 'primevue/fileupload';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = ref(null);
const selectedFiles = ref([]);
const isUploading = ref(false);

onMounted(() => {
  toast.value = useToast();
});

const onFileSelect = (event) => {
  selectedFiles.value = event.files.map(file => ({
    originalFile: file, // Store the original File object
    name: file.name,
    size: file.size,
    status: 'pending'
  }));
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
};

const uploadSelectedFiles = async () => {
  isUploading.value = true;
  const { $apiFetch } = useNuxtApp();

  for (let i = 0; i < selectedFiles.value.length; i++) {
    const fileItem = selectedFiles.value[i];
    fileItem.status = 'uploading';

    const formData = new FormData();
    formData.append('file', fileItem.originalFile, fileItem.name);

    try {
      await $apiFetch('/api/any_data/file', {
        method: 'POST',
        body: formData,
      });
      fileItem.status = 'success';
      toast.value.add({ severity: 'success', summary: 'Success', detail: `File ${fileItem.name} uploaded successfully`, life: 3000 });
    } catch (error) {
      fileItem.status = 'failed';
      toast.value.add({ severity: 'error', summary: 'Upload Failed', detail: `Failed to upload ${fileItem.name}: ${error.data?.message || 'An error occurred'}`, life: 3000 });
      console.error(`File upload error for ${fileItem.name}:`, error);
    }
  }
  isUploading.value = false;
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.p-grid {
  margin: 0;
}
</style>