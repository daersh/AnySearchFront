export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return;

  const token = useCookie('token');

  if (to.path === '/login' || to.path === '/register') {
    return navigateTo('/auth');
  }

  if (!token.value && to.path !== '/auth') {
    return navigateTo('/auth');
  }
});
