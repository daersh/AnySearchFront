// plugins/apiFetch.ts (또는 .client.ts / .server.ts)
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { ofetch } from 'ofetch';
import { useLoading } from '~/composables/useLoading';

export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('token');
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter(); // useRouter를 여기서 한 번만 호출

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
      startLoading(); // 요청 시작 시 로딩 시작
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },

    onResponse({ request, options, response }) {
      stopLoading(); // 응답 성공 시 로딩 중지
    },

    onResponseError({ request, options, response }) {
      stopLoading(); // 응답 에러 시 로딩 중지
      if (response && response.status === 401) {
        console.warn('Unauthorized (401) response received. Redirecting to auth page.');
        token.value = null;
        router.push('/auth'); // /login 대신 /auth로 리다이렉트
      }
    }
  });

  nuxtApp.provide('apiFetch', apiFetch);
});