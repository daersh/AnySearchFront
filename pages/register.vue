<template>
  <div class="flex align-items-center justify-content-center min-h-screen bg-gray-100">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4 md:w-6 sm:w-8">
      <div class="text-center mb-5">
        <i class="pi pi-user-plus text-blue-500 text-4xl mb-3"></i>
        <div class="text-900 text-3xl font-medium mb-3">Register</div>
        <span class="text-600 font-medium">Create your new account</span>
      </div>

      <form @submit.prevent="register">
        <div class="field mb-4">
          <label for="name" class="block text-900 font-medium mb-2">Name</label>
          <InputText id="name" type="text" class="w-full" v-model="name" required />
        </div>

        <div class="field mb-4">
          <label for="email" class="block text-900 font-medium mb-2">Email</label>
          <InputText id="email" type="email" class="w-full" v-model="email" required />
        </div>

        <div class="field mb-4">
          <label for="nickname" class="block text-900 font-medium mb-2">Nickname</label>
          <InputText id="nickname" type="text" class="w-full" v-model="nickname" required />
        </div>

        <div class="field mb-4">
          <label for="password" class="block text-900 font-medium mb-2">Password</label>
          <InputText id="password" type="password" class="w-full" v-model="password" required />
        </div>

        <Button type="submit" label="Register" icon="pi pi-user-plus" class="w-full p-button-primary" />
      </form>

      <div v-if="error" class="text-red-500 text-center mt-3">{{ error }}</div>
      <div v-if="success" class="text-green-500 text-center mt-3">{{ success }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const nickname = ref('');
const password = ref('');
const error = ref(null);
const success = ref(null);
const router = useRouter();

const register = async () => {
  error.value = null;
  success.value = null;
  try {
    await $fetch('/api/login/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        nickname: nickname.value,
        password: password.value,
      },
    });
    success.value = 'Registration successful! You can now log in.';
    // Optionally redirect to login page after a short delay
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (e) {
    error.value = e.message || 'Registration failed.';
  }
};
</script>
