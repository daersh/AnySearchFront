// plugins/apiFetch.ts (또는 .client.ts / .server.ts)
import { defineNuxtPlugin, useCookie, useRouter } from '#app';
import { ofetch } from 'ofetch';
import { useLoading } from '~/composables/useLoading';

export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('token');
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  let apiBaseUrl = '';

  if (process.client) {
    // Client-side: Determine base URL based on current window location
    const currentPort = window.location.port;
    if (currentPort === '3000') {
      apiBaseUrl = 'http://localhost:8080';
    } else {
      apiBaseUrl = window.location.origin; // Use current origin for other ports/production
    }
  } else if (process.server) {
    // Server-side: Use environment variable or a default server URL
    apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080';
  }

  const apiFetch = ofetch.create({
    baseURL: apiBaseUrl,

    onRequest({ request, options }) {
      startLoading();
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },

    onResponse({ request, options, response }) {
      stopLoading();
    },

    onResponseError({ request, options, response }) {
      stopLoading();
      if (response && response.status === 401) {
        console.warn('Unauthorized (401) response received. Redirecting to auth page.');
        token.value = null;
        router.push('/auth');
      }
    }
  });

  nuxtApp.provide('apiFetch', apiFetch);
});