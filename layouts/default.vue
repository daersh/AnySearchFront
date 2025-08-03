<script setup>
import Menubar from 'primevue/menubar';
import { ref, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRoute } from 'vue-router';

const { isAdmin, token } = useAuth();
const router = useRouter();
const route = useRoute();

const showMenubar = computed(() => route.path !== '/auth');

const logout = () => {
  token.value = null;
  router.push('/auth'); // Redirect to auth page after logout
};

const menuItems = computed(() => {
  const commonItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => router.push('/')
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => router.push('/profile')
    },
    {
      label: 'Search',
      icon: 'pi pi-search',
      items: [
        {
          label: 'Search AnyData',
          icon: 'pi pi-at',
          command: () => router.push('/search')
        },
        {
          label: 'Search File',
          icon: 'pi pi-link',
          command: () => router.push('/file-search')
        },
        {
          label: 'Search Naver',
          icon: 'pi pi-mobile',
          command: () => router.push('/naver-search')
        }
      ]
    }
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
        },
        {
          label: 'File Upload',
          icon: 'pi pi-upload',
          command: () => router.push('/admin/fileupload')
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
    <LoadingSpinner />
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
  color: var(--text-color); /* Ensure default text color */
  border-radius: 0;
}

/* Ensure menubar item text color follows theme */
.p-menubar .p-menuitem-link .p-menuitem-text {
  color: var(--text-color);
}

.p-menubar .p-menuitem-link:hover .p-menuitem-text {
  color: var(--primary-color);
}

.p-menubar .p-submenu-list .p-menuitem-link .p-menuitem-text {
  color: var(--text-color);
}

.p-menubar .p-submenu-list .p-menuitem-link:hover .p-menuitem-text {
  color: var(--primary-color);
}
</style>
