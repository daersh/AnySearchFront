export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const token = useCookie('token');

  if (!token.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login');
  }
});
