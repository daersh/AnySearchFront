<template>
  <div class="flex min-h-screen">
    <aside class="admin-sidebar bg-surface-card p-4 shadow-2">
      <h2 class="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul class="list-none p-0 m-0">
        <li v-for="item in adminMenuItems" :key="item.label" class="mb-2">
          <Button 
            :label="item.label" 
            :icon="item.icon" 
            class="p-button-text p-button-plain w-full text-left"
            @click="item.command"
          />
        </li>
      </ul>
    </aside>
    <main class="flex-grow-1 p-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const adminMenuItems = [
  {
    label: 'Manage Jobs',
    icon: 'pi pi-server',
    command: () => router.push('/admin/jobs')
  },
  {
    label: 'Manage AnyData',
    icon: 'pi pi-database',
    command: () => router.push('/admin/anydata')
  },
  {
    label: 'File Upload',
    icon: 'pi pi-upload',
    command: () => router.push('/admin/fileupload')
  },
  {
    label: 'Back to Home',
    icon: 'pi pi-home',
    command: () => router.push('/')
  }
];
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  flex-shrink: 0;
  border-right: 1px solid var(--surface-border);
}

.p-button-plain {
  color: var(--text-color-secondary);
}

.p-button-plain:hover {
  color: var(--primary-color);
  background-color: var(--surface-ground);
}
</style>