<template>
  <div class="flex align-items-center justify-content-center min-h-screen bg-gray-100 text-color-secondary">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4 md:w-6 sm:w-8">
      <div class="text-center mb-5">
        <i class="pi pi-user-plus text-blue-500 text-4xl mb-3"></i>
        <div class="text-900 text-3xl font-medium mb-3">Welcome Back!</div>
        <span class="text-600 font-medium">Sign in to continue</span>
      </div>

      <form @submit.prevent="login">
        <div class="field mb-4">
          <label for="username" class="block text-900 font-medium mb-2">Username or Email</label>
          <InputText id="username" type="text" class="w-full" v-model="username" required />
        </div>

        <div class="field mb-4">
          <label for="password" class="block text-900 font-medium mb-2">Password</label>
          <InputText id="password" type="password" class="w-full" v-model="password" required />
        </div>

        <Button type="submit" label="Login" icon="pi pi-sign-in" class="w-full p-button-primary" />
        <Button label="Register" icon="pi pi-user-plus" class="w-full p-button-secondary mt-3" @click="navigateToRegister" />
      </form>

      <div v-if="error" class="text-red-500 text-center mt-3">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const { $apiFetch } = useNuxtApp();

const username = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();

const navigateToRegister = () => {
  console.log('Register button clicked');
  router.push('/register');
};

const token = useCookie('token');

const login = async () => {
  error.value = null;
  try {
    const response = await $apiFetch('/api/login', {
      method: 'POST',
      body: {
        nicknameOrEmail: username.value,
        password: password.value,
      },
    });
    token.value = response; // Store the token in the cookie
    router.push('/');
  } catch (e) {
    error.value = 'Invalid credentials';
  }
};
</script>