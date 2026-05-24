<template>
  <Teleport to="body">
    <div class="fixed left-1/2 top-4 z-[9999] -translate-x-1/2">
      <TransitionGroup name="toast" tag="div" class="flex flex-col items-center gap-2">
        <div v-for="toast in toasts" :key="toast.id" :class="toastClasses(toast.type)" role="alert">
          <!-- トーストタイプ別アイコン -->
          <svg
            :class="iconClasses(toast.type)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <!-- info -->
            <path
              v-if="toast.type === 'info'"
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
            <!-- success -->
            <path
              v-else-if="toast.type === 'success'"
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
            <!-- error -->
            <path
              v-else
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="flex-1 text-sm">{{ toast.message }}</span>
          <button
            type="button"
            class="ml-auto shrink-0 pl-3 opacity-70 transition-opacity hover:opacity-100"
            @click="remove(toast.id)"
          >
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast();

const toastClasses = (type: "info" | "success" | "error") => {
  const baseClasses =
    "flex items-center px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[400px] bg-elev text-fg border border-line-soft border-l-4";

  const typeClasses = {
    info: "border-l-steel",
    success: "border-l-mason",
    error: "border-l-wolf",
  };

  return `${baseClasses} ${typeClasses[type]}`;
};

const iconClasses = (type: "info" | "success" | "error") => {
  const map = {
    info: "text-steel",
    success: "text-mason",
    error: "text-wolf",
  };
  return `mr-2 h-5 w-5 shrink-0 ${map[type]}`;
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
