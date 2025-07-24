import { ref, onMounted, watch } from 'vue';

export const useTheme = () => {
  const isDark = ref(false);

  const applyTheme = (dark) => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty('--primary-color', '#4b89ff');
      root.style.setProperty('--primary-color-text', '#ffffff');
      root.style.setProperty('--surface-ground', '#121212');
      root.style.setProperty('--surface-card', '#1e1e1e');
      root.style.setProperty('--surface-border', '#2c2c2c');
      root.style.setProperty('--text-color', '#e0e0e0');
      root.style.setProperty('--text-color-secondary', '#a0a0a0');
    } else {
      // Light theme colors (example, adjust as needed)
      root.style.setProperty('--primary-color', '#1e88e5');
      root.style.setProperty('--primary-color-text', '#ffffff');
      root.style.setProperty('--surface-ground', '#f0f2f5');
      root.style.setProperty('--surface-card', '#ffffff');
      root.style.setProperty('--surface-border', '#e0e0e0');
      root.style.setProperty('--text-color', '#333333');
      root.style.setProperty('--text-color-secondary', '#666666');
    }
  };

  const toggleDark = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };

  onMounted(() => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        isDark.value = true;
      } else if (savedTheme === 'light') {
        isDark.value = false;
      } else {
        // Default to dark if no preference saved
        isDark.value = true;
      }
    }
  });

  watch(isDark, (newVal) => {
    if (process.client) {
      applyTheme(newVal);
    }
  }, { immediate: true });

  return {
    isDark,
    toggleDark,
  };
};