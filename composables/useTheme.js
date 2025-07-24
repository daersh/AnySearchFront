import { onMounted } from 'vue';

export const useTheme = () => {
  const applyTheme = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', '#4b89ff');
    root.style.setProperty('--primary-color-text', '#ffffff');
    root.style.setProperty('--surface-ground', '#121212');
    root.style.setProperty('--surface-card', '#1e1e1e');
    root.style.setProperty('--surface-border', '#2c2c2c');
    root.style.setProperty('--text-color', '#e0e0e0');
    root.style.setProperty('--text-color-secondary', '#a0a0a0');
  };

  onMounted(() => {
    if (process.client) {
      applyTheme();
    }
  });

  return {
    // No toggle function needed as it's always dark mode
  };
};