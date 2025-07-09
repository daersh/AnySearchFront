// plugins/apiFetch.ts (또는 .client.ts / .server.ts)
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { ofetch } from 'ofetch';

export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('token');

  let apiBaseUrl = '/';

  // 'process.client' 대신 'import.meta.client' 사용
  if (import.meta.client) { // <-- 이 부분을 변경했습니다.
    const currentPort = window.location.port;
    if (currentPort == '3000') {
      apiBaseUrl = 'http://localhost:8080';
    }
  }

  const apiFetch = ofetch.create({
    baseURL: apiBaseUrl,

    onRequest({ request, options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },

    onResponseError({ request, options, response }) {
      if (response && response.status === 401) {
        console.warn('Unauthorized (401) response received. Redirecting to login page.');
        token.value = null;
        const router = useRouter();
        router.push('/login');
      }
    }
  });

  nuxtApp.provide('apiFetch', apiFetch);
});