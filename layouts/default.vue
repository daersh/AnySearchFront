<script setup>
import Menubar from 'primevue/menubar';
import { ref, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRoute } from 'vue-router';

const { isAdmin, token } = useAuth();
const router = useRouter();
const route = useRoute();
console.log("isAdmin:", isAdmin);
const showMenubar = computed(() => route.path !== '/login' && route.path !== '/register');

const logout = () => {
  token.value = null;
  router.push('/login');
};

const menuItems = computed(() => {
  const commonItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => router.push('/')
    },
    {
      label: 'Search',
      icon: 'pi pi-search',
      command: () => router.push('/search')
    },
  ];

  const adminItems = isAdmin() ? [
    {
      label: 'Admin',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Manage Jobs',
          icon: 'pi pi-server',
          command: () => router.push('/admin/jobs')
        },
        {
          label: 'Manage AnyData',
          icon: 'pi pi-database',
          command: () => router.push('/admin/anydata')
        }
      ]
    }
  ] : [];

  const authItems = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: logout
    }
  ];

  return [...commonItems, ...adminItems, ...authItems];
});
</script>

<template>
  <div class="min-h-screen flex flex-column">
    <Menubar :model="menuItems" class="p-menubar-light shadow-2" v-if="showMenubar" />
    <main class="flex-grow-1">
      <slot />
    </main>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: var(--font-family);
  background-color: var(--surface-ground);
  color: var(--text-color);
}

.p-menubar-light {
  background-color: var(--surface-card);
  color: var(--text-color);
  border-radius: 0;
}
</style>
