<template>
  <div class="dashboard-container p-5">
    <div class="text-center mb-6">
      <h1 class="text-5xl font-bold mb-3">Welcome to Your AnySearch Dashboard</h1>
      <p class="text-xl text-color-secondary">Quickly access key features and manage your information.</p>
    </div>

    <div class="p-inputgroup mb-6 mx-auto" style="max-width: 600px;">
      <InputText placeholder="Start your search here..." v-model="searchQuery" @keyup.enter="performSearch" />
      <Button icon="pi pi-search" class="p-button-primary" @click="performSearch" />
    </div>

    <div class="grid">
      <div class="col-12 md:col-6 lg:col-4">
        <Card class="dashboard-card" @click="navigateTo('/search')">
          <template #title>
            <i class="pi pi-search text-primary text-3xl mb-3"></i>
            <h3>Search & Discover</h3>
          </template>
          <template #content>
            <p class="text-color-secondary">Find information across all your connected data sources.</p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <Card class="dashboard-card" @click="navigateTo('/profile')">
          <template #title>
            <i class="pi pi-user text-primary text-3xl mb-3"></i>
            <h3>Manage Profile</h3>
          </template>
          <template #content>
            <p class="text-color-secondary">Update your personal information and settings.</p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <Card class="dashboard-card" @click="navigateTo('/admin/fileupload')">
          <template #title>
            <i class="pi pi-upload text-primary text-3xl mb-3"></i>
            <h3>Upload Files</h3>
          </template>
          <template #content>
            <p class="text-color-secondary">Add new documents and data to your search index.</p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <Card class="dashboard-card" @click="navigateTo('/admin/jobs')">
          <template #title>
            <i class="pi pi-server text-primary text-3xl mb-3"></i>
            <h3>Manage Jobs</h3>
          </template>
          <template #content>
            <p class="text-color-secondary">Monitor and manage background processing jobs.</p>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-4">
        <Card class="dashboard-card" @click="navigateTo('/admin/anydata')">
          <template #title>
            <i class="pi pi-database text-primary text-3xl mb-3"></i>
            <h3>Manage AnyData</h3>
          </template>
          <template #content>
            <p class="text-color-secondary">View and edit your structured data entries.</p>
          </template>
        </Card>
      </div>

      <!-- Add more cards for other features as needed -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const searchQuery = ref('');
const { isAdmin } = useAuth();

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?query=${encodeURIComponent(searchQuery.value)}`);
  } else {
    router.push('/search');
  }
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.dashboard-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%; /* Ensure cards in a row have same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.dashboard-card .p-card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.dashboard-card .p-card-title i {
  margin-bottom: 0.5rem;
}

.dashboard-card .p-card-content {
  flex-grow: 1;
}

/* Responsive adjustments for input group */
@media screen and (max-width: 768px) {
  .p-inputgroup {
    width: 100% !important;
  }
}
</style>