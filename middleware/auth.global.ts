import { useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = useCookie('userid');

  if (authRequired && !loggedIn.value)
    return navigateTo('/login');
  else
    GlobalVars.userid = loggedIn.value!;
  if (to.path === '/')
    return navigateTo('/words-unit');
})
