<script setup lang="ts">
const { initializeAuth } = useAuth();
initializeAuth();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
