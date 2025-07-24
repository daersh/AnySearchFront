<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-surface-ground">
    <div class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">Welcome</h1>
        <p class="text-color-secondary">Sign in or create an account to continue</p>
      </div>

      <Card>
        <template #content>
          <TabView v-model:activeIndex="activeIndex">
            <TabPanel header="Login">
              <form @submit.prevent="login" class="p-fluid mt-4">
                <div class="field">
                  <span class="p-float-label">
                    <InputText id="login-nickname-or-email" v-model="loginForm.nicknameOrEmail" :class="{'p-invalid': loginErrors.nicknameOrEmail}" />
                    <label for="login-nickname-or-email">Nickname or Email</label>
                  </span>
                  <small class="p-error" v-if="loginErrors.nicknameOrEmail">{{ loginErrors.nicknameOrEmail }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <Password id="login-password" v-model="loginForm.password" :feedback="false" toggleMask :class="{'p-invalid': loginErrors.password}" />
                    <label for="login-password">Password</label>
                  </span>
                  <small class="p-error" v-if="loginErrors.password">{{ loginErrors.password }}</small>
                </div>
                <Button label="Login" type="submit" class="w-full mt-4" :loading="loading" />
              </form>
            </TabPanel>
            <TabPanel header="Register">
              <form @submit.prevent="register" class="p-fluid mt-4">
                <div class="field">
                  <span class="p-float-label">
                    <InputText id="register-nickname" v-model="registerForm.nickname" :class="{'p-invalid': registerErrors.nickname}" />
                    <label for="register-nickname">Nickname</label>
                  </span>
                  <small class="p-error" v-if="registerErrors.nickname">{{ registerErrors.nickname }}</small>
                </div>
                <div class="field">
                   <span class="p-float-label">
                    <InputText id="register-email" v-model="registerForm.email" :class="{'p-invalid': registerErrors.email}" />
                    <label for="register-email">Email</label>
                  </span>
                  <small class="p-error" v-if="registerErrors.email">{{ registerErrors.email }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <InputText id="register-name" v-model="registerForm.name" :class="{'p-invalid': registerErrors.name}" />
                    <label for="register-name">Name</label>
                  </span>
                  <small class="p-error" v-if="registerErrors.name">{{ registerErrors.name }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <Password id="register-password" v-model="registerForm.password" :feedback="true" toggleMask :class="{'p-invalid': registerErrors.password}" />
                     <label for="register-password">Password</label>
                  </span>
                  <small class="p-error" v-if="registerErrors.password">{{ registerErrors.password }}</small>
                </div>
                <Button label="Register" type="submit" class="w-full mt-4" :loading="loading" />
              </form>
            </TabPanel>
          </TabView>
        </template>
      </Card>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useToast } from 'primevue/usetoast';
  const { $apiFetch } = useNuxtApp();

const router = useRouter();
const { token } = useAuth();
const toast = useToast();

const activeIndex = ref(0);
const loading = ref(false);

const loginForm = ref({
  nicknameOrEmail: '',
  password: ''
});

const loginErrors = ref({});

const registerForm = ref({
  nickname: '',
  password: '',
  email: '',
  name: ''
});

const registerErrors = ref({});

const validateLoginForm = () => {
  loginErrors.value = {};
  let isValid = true;

  if (!loginForm.value.nicknameOrEmail) {
    loginErrors.value.nicknameOrEmail = 'Nickname or Email is required.';
    isValid = false;
  }
  if (!loginForm.value.password) {
    loginErrors.value.password = 'Password is required.';
    isValid = false;
  }
  return isValid;
};

const validateRegisterForm = () => {
  registerErrors.value = {};
  let isValid = true;

  if (!registerForm.value.nickname) {
    registerErrors.value.nickname = 'Nickname is required.';
    isValid = false;
  }
  if (!registerForm.value.email) {
    registerErrors.value.email = 'Email is required.';
    isValid = false;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerForm.value.email)) {
    registerErrors.value.email = 'Invalid email format.';
    isValid = false;
  }
  if (!registerForm.value.name) {
    registerErrors.value.name = 'Name is required.';
    isValid = false;
  }
  if (!registerForm.value.password) {
    registerErrors.value.password = 'Password is required.';
    isValid = false;
  } else if (registerForm.value.password.length < 6) {
    registerErrors.value.password = 'Password must be at least 6 characters.';
    isValid = false;
  }
  return isValid;
};

const login = async () => {
  if (!validateLoginForm()) {
    return;
  }
  loading.value = true;
  try {
    
    const response = await $apiFetch('/api/login', {
      method: 'POST',
      body: {
        nicknameOrEmail: loginForm.value.nicknameOrEmail,
        password: loginForm.value.password
      }
    });
    token.value = response;
    toast.add({ severity: 'success', summary: 'Login Successful', life: 3000 });
    router.push('/');
    console.log('Attempting to redirect to /');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Login Failed', detail: error.data?.message || 'An error occurred', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const register = async () => {
  if (!validateRegisterForm()) {
    return;
  }
  loading.value = true;
  try {
    await $apiFetch('/api/login/register', {
      method: 'POST',
      body: {
        nickname: registerForm.value.nickname,
        password: registerForm.value.password,
        email: registerForm.value.email,
        name: registerForm.value.name
      }
    });
    toast.add({ severity: 'success', summary: 'Registration Successful', detail: 'Please login to continue.', life: 3000 });
    activeIndex.value = 0; // Switch to login tab
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Registration Failed', detail: error.data?.message || 'An error occurred', life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>