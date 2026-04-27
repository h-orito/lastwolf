export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return;
  }

  const auth = useAuth();

  const authRequiredPaths = ["/create-village", "/village-setting"];

  const requiresAuth = authRequiredPaths.some((path) => to.path.startsWith(path));

  if (requiresAuth) {
    await auth.waitForAuth();
    if (!auth.isAuthenticated.value) {
      return navigateTo("/");
    }
  }
});
