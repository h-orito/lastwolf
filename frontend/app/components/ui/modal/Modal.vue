<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        @click.self="handleOverlayClick"
      >
        <Transition
          enter-active-class="transition-transform duration-200 ease-out"
          enter-from-class="scale-95"
          enter-to-class="scale-100"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="scale-100"
          leave-to-class="scale-95"
        >
          <div
            v-if="isModalOpen"
            ref="modalRef"
            class="modal-card relative flex w-full max-w-full flex-col overflow-hidden bg-elev shadow-xl sm:max-w-lg md:max-w-[80vw]"
            :style="{ maxHeight: 'calc(100dvh - 6.5rem)' }"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title || $slots.title ? titleId : undefined"
            tabindex="-1"
          >
            <!-- 上端グラデバー（黒→赤の rim light） -->
            <div
              class="h-px shrink-0 bg-[linear-gradient(90deg,transparent,var(--color-blood-deep),var(--color-blood),var(--color-ember),var(--color-blood),var(--color-blood-deep),transparent)]"
              aria-hidden="true"
            />

            <!-- ヘッダー -->
            <div
              v-if="title || $slots.title"
              class="shrink-0 border-b border-line-soft bg-soft px-6 py-4"
            >
              <div class="flex items-center justify-between">
                <h3
                  :id="titleId"
                  class="m-0 text-left font-serif text-lg font-semibold leading-tight text-fg"
                >
                  <slot name="title">{{ title }}</slot>
                </h3>
                <button
                  v-if="showCloseButton"
                  type="button"
                  class="rounded p-1 text-fg-secondary hover:bg-elev hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-blood"
                  aria-label="閉じる"
                  @click="closeModal"
                >
                  <svg
                    class="h-5 w-5"
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
            </div>

            <!-- ボディ -->
            <div
              class="flex-1 overflow-y-auto bg-elev px-4 py-4 text-left font-sans text-fg sm:px-6"
            >
              <slot />
            </div>

            <!-- フッター -->
            <div
              v-if="$slots.footer"
              class="flex shrink-0 justify-end gap-2 border-t border-line-soft bg-deep px-4 py-4 sm:px-6"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "close" | "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  closeOnOverlayClick: true,
  closeOnEscape: true,
  showCloseButton: true,
});

const emit = defineEmits<Emits>();

const modalRef = ref<HTMLElement | null>(null);
const titleId = useId();

const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit("update:modelValue", value);
    if (!value) {
      emit("close");
      emit("cancel");
    }
  },
});

const closeModal = () => {
  isModalOpen.value = false;
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal();
  }
};

const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.closeOnEscape) {
    closeModal();
  }
};

watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscKey);
    nextTick(() => {
      modalRef.value?.focus();
    });
  } else {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleEscKey);
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleEscKey);
});
</script>

<style scoped>
/* モーダル本体: 黒ベース + 右上から赤光、border は赤い rim gradient */
.modal-card {
  border-radius: 16px;
  background:
    radial-gradient(
        ellipse 40% 55% at 100% 0%,
        rgba(255, 91, 58, 0.14) 0%,
        rgba(224, 46, 46, 0.06) 32%,
        transparent 65%
      )
      padding-box,
    radial-gradient(ellipse 35% 45% at 0% 100%, rgba(224, 46, 46, 0.06) 0%, transparent 60%)
      padding-box,
    linear-gradient(135deg, var(--color-elev) 0%, var(--color-base) 100%) padding-box,
    linear-gradient(
        225deg,
        rgba(255, 130, 100, 0.85) 0%,
        rgba(224, 46, 46, 0.5) 12%,
        rgba(139, 26, 26, 0.22) 28%,
        rgba(244, 241, 232, 0.04) 50%,
        rgba(0, 0, 0, 0) 70%,
        rgba(139, 26, 26, 0.14) 100%
      )
      border-box;
  border: 1px solid transparent;
  box-shadow:
    inset 0 0 0 1px rgba(255, 91, 58, 0.05),
    0 0 50px -12px rgba(224, 46, 46, 0.4),
    0 30px 70px -20px rgba(0, 0, 0, 0.95);
}
</style>
