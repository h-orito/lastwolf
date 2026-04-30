import { defineStore } from "pinia";
import type { components } from "~/lib/api/schema";

type MessageView = components["schemas"]["MessageView"];

export const useMessagesStore = defineStore("messages", () => {
  // 昼・投票時間のメッセージ（Firebase v${vid}/messages/ から直接取得）
  const noonMessages = ref<MessageView[]>([]);
  // 夜のメッセージ（API /message-list から取得）
  const nightMessages = ref<MessageView[]>([]);

  const init = () => {
    noonMessages.value = [];
    nightMessages.value = [];
  };

  const addNoonMessage = (m: MessageView) => {
    noonMessages.value.unshift(m);
  };

  const saveNightMessages = (msgs: MessageView[]) => {
    nightMessages.value = msgs;
  };

  return {
    noonMessages: readonly(noonMessages),
    nightMessages: readonly(nightMessages),
    init,
    addNoonMessage,
    saveNightMessages,
  };
});
