<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-surface-ground">
    <div class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">User Profile</h1>
        <p class="text-color-secondary">Manage your profile information</p>
      </div>

      <Card>
        <template #content>
          <TabView>
            <TabPanel header="Profile Information">
              <form @submit.prevent="updateProfile" class="p-fluid mt-4">
                <div class="field">
                  <span class="p-float-label">
                    <InputText id="profile-nickname" v-model="profileForm.nickname" :class="{'p-invalid': profileErrors.nickname}" />
                    <label for="profile-nickname">Nickname</label>
                  </span>
                  <small class="p-error" v-if="profileErrors.nickname">{{ profileErrors.nickname }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <InputText id="profile-email" v-model="profileForm.email" disabled />
                    <label for="profile-email">Email</label>
                  </span>
                </div>
                <Button label="Update Profile" type="submit" class="w-full mt-4" :loading="loadingProfile" />
              </form>
            </TabPanel>
            <TabPanel header="Change Password">
              <form @submit.prevent="changePassword" class="p-fluid mt-4">
                <div class="field">
                  <span class="p-float-label">
                    <Password id="current-password" v-model="passwordForm.currentPassword" :feedback="false" toggleMask :class="{'p-invalid': passwordErrors.currentPassword}" />
                    <label for="current-password">Current Password</label>
                  </span>
                  <small class="p-error" v-if="passwordErrors.currentPassword">{{ passwordErrors.currentPassword }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <Password id="new-password" v-model="passwordForm.newPassword" :feedback="true" toggleMask :class="{'p-invalid': passwordErrors.newPassword}" />
                    <label for="new-password">New Password</label>
                  </span>
                  <small class="p-error" v-if="passwordErrors.newPassword">{{ passwordErrors.newPassword }}</small>
                </div>
                <div class="field">
                  <span class="p-float-label">
                    <Password id="confirm-password" v-model="passwordForm.confirmPassword" :feedback="false" toggleMask :class="{'p-invalid': passwordErrors.confirmPassword}" />
                    <label for="confirm-password">Confirm New Password</label>
                  </span>
                  <small class="p-error" v-if="passwordErrors.confirmPassword">{{ passwordErrors.confirmPassword }}</small>
                </div>
                <Button label="Change Password" type="submit" class="w-full mt-4" :loading="loadingPassword" />
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
import { ref, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useToast } from 'primevue/usetoast';

const { $apiFetch } = useNuxtApp();
const { getUser, token } = useAuth();
const toast = useToast();

const profileForm = ref({
  nickname: '',
  email: ''
});

const profileErrors = ref({});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordErrors = ref({});

const loadingProfile = ref(false);
const loadingPassword = ref(false);

onMounted(() => {
  const user = getUser();
  if (user) {
    profileForm.value.nickname = user.user_nickname || '';
    profileForm.value.email = user.user_email || '';
  }
});

const validateProfileForm = () => {
  profileErrors.value = {};
  let isValid = true;

  if (!profileForm.value.nickname) {
    profileErrors.value.nickname = 'Nickname is required.';
    isValid = false;
  }
  return isValid;
};

const validatePasswordForm = () => {
  passwordErrors.value = {};
  let isValid = true;

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required.';
    isValid = false;
  }
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required.';
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'New password must be at least 6 characters.';
    isValid = false;
  }
  if (!passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Confirm new password is required.';
    isValid = false;
  }
  if (passwordForm.value.newPassword && passwordForm.value.confirmPassword && passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'New password and confirmation do not match.';
    isValid = false;
  }
  return isValid;
};

const updateProfile = async () => {
  if (!validateProfileForm()) {
    return;
  }
  loadingProfile.value = true;
  try {
    // Assuming an API endpoint for updating profile
    const response = await $apiFetch('/api/user/profile', {
      method: 'PUT',
      body: {
        nickname: profileForm.value.nickname
      }
    });
    // If the token contains updated info, refresh it
    if (response.token) {
      token.value = response.token;
    }
    toast.add({ severity: 'success', summary: 'Profile Updated', detail: 'Your profile has been updated successfully.', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Update Failed', detail: error.data?.message || 'An error occurred', life: 3000 });
  } finally {
    loadingProfile.value = false;
  }
};

const changePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }
  loadingPassword.value = true;
  try {
    // Assuming an API endpoint for changing password
    await $apiFetch('/api/user/change-password', {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      }
    });
    toast.add({ severity: 'success', summary: 'Password Changed', detail: 'Your password has been changed successfully.', life: 3000 });
    // Clear password fields
    passwordForm.value.currentPassword = '';
    passwordForm.value.newPassword = '';
    passwordForm.value.confirmPassword = '';
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Change Failed', detail: error.data?.message || 'An error occurred', life: 3000 });
  } finally {
    loadingPassword.value = false;
  }
};
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>