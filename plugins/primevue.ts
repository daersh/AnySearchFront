import { defineNuxtPlugin } from "#app";
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { useTheme } from '~/composables/useTheme';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.use(ConfirmationService);

  // Initialize theme on client-side
  if (process.client) {
    const { isDark } = useTheme();
    // The watch in useTheme will handle applying the theme on mount
  }
});